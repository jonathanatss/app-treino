(function () {
  "use strict";

  const DB_NAME = "fitplan-progress-media";
  const DB_VERSION = 3;
  const PHOTO_STORE = "progressPhotos";
  const QUEUE_STORE = "photoSyncQueue";
  const SYNC_TAG = "fitplan-evolution-photos";
  let flushing = false;

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PHOTO_STORE)) {
          const photos = db.createObjectStore(PHOTO_STORE, { keyPath: "id" });
          photos.createIndex("profile", "profile", { unique: false });
        }
        if (!db.objectStoreNames.contains("profileAvatars")) db.createObjectStore("profileAvatars", { keyPath: "profile" });
        if (!db.objectStoreNames.contains(QUEUE_STORE)) {
          const queue = db.createObjectStore(QUEUE_STORE, { keyPath: "photoId" });
          queue.createIndex("profile", "profile", { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Não foi possível abrir a fila de fotos."));
    });
  }

  async function storeRequest(storeName, mode, operation) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = operation(transaction.objectStore(storeName));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  const getPhoto = (id) => storeRequest(PHOTO_STORE, "readonly", (store) => store.get(id));
  const putPhoto = (photo) => storeRequest(PHOTO_STORE, "readwrite", (store) => store.put(photo));
  const listQueue = () => storeRequest(QUEUE_STORE, "readonly", (store) => store.getAll());
  const putQueue = (entry) => storeRequest(QUEUE_STORE, "readwrite", (store) => store.put(entry));
  const deleteQueue = (id) => storeRequest(QUEUE_STORE, "readwrite", (store) => store.delete(id));

  async function registerBackgroundSync() {
    try {
      const registration = await navigator.serviceWorker?.ready;
      if (registration?.sync?.register) {
        await registration.sync.register(SYNC_TAG);
        return true;
      }
    } catch {}
    return false;
  }

  async function queuePhoto(record, options = {}) {
    if (!record?.id || !record?.profile) return false;
    await putQueue({ photoId: record.id, profile: record.profile, queuedAt: new Date().toISOString(), attempts: 0 });
    await registerBackgroundSync();
    if (navigator.onLine && !options.defer) flushQueue({ quiet: true });
    return true;
  }

  function cloudContext() {
    const cloud = window.fitplanCloud?.snapshot?.();
    if (!cloud?.user?.id || !window.fitplanCloud?.client) throw new Error("Entre na sua conta para sincronizar as fotos.");
    return { client: window.fitplanCloud.client, userId: cloud.user.id };
  }

  async function uploadPhoto(photo, context = cloudContext()) {
    if (!photo?.blob) throw new Error("A foto local está corrompida ou indisponível.");
    const processed = await window.FitPlanImageProcessor.processImage(photo.blob);
    const hash = await window.FitPlanImageProcessor.hashBlob(processed.blob);
    const measuredOn = photo.date || new Date(photo.createdAt || Date.now()).toISOString().slice(0, 10);
    const path = `${context.userId}/${measuredOn}/${hash}.${processed.extension}`;
    const upload = await context.client.storage.from("evolution_photos").upload(path, processed.blob, {
      contentType: processed.mimeType,
      cacheControl: "31536000",
      upsert: false
    });
    if (upload.error && !/already exists|duplicate/i.test(upload.error.message)) throw upload.error;
    const metadata = await context.client.from("user_evolution_photos").upsert({
      user_id: context.userId,
      measured_on: measuredOn,
      weight_kg: weightForPhoto(photo),
      category: normalizeCategory(photo.pose),
      storage_path: path,
      file_hash: hash,
      mime_type: processed.mimeType,
      byte_size: processed.size,
      width_px: processed.width,
      height_px: processed.height,
      local_photo_id: String(photo.id)
    }, { onConflict: "user_id,file_hash" });
    if (metadata.error) {
      if (!upload.error) await context.client.storage.from("evolution_photos").remove([path]).catch(() => {});
      throw metadata.error;
    }
    const synced = { ...photo, cloudSync: { status: "synced", path, hash, syncedAt: new Date().toISOString() } };
    await putPhoto(synced);
    await deleteQueue(photo.id);
    return synced;
  }

  function normalizeCategory(pose) {
    const value = String(pose || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return ({ frente: "front", lateral: "side", costas: "back" })[value] || "other";
  }

  function weightForPhoto(photo) {
    const direct = Number(photo.weightKg || photo.weight);
    if (direct > 0) return direct;
    try {
      const measurements = JSON.parse(localStorage.getItem(`gym-app-profile-${photo.profile}-measurements`) || "[]");
      const sameDay = measurements.filter((item) => item.date === photo.date).at(-1);
      const value = Number(String(sameDay?.weight || "").replace(",", "."));
      return value > 0 ? value : null;
    } catch { return null; }
  }

  async function flushQueue(options = {}) {
    if (flushing || !navigator.onLine) return { synced: 0, pending: (await listQueue()).length };
    flushing = true;
    let synced = 0;
    try {
      const context = cloudContext();
      const queue = await listQueue();
      for (const entry of queue) {
        try {
          const photo = await getPhoto(entry.photoId);
          if (!photo) { await deleteQueue(entry.photoId); continue; }
          await uploadPhoto(photo, context);
          synced += 1;
        } catch (error) {
          await putQueue({ ...entry, attempts: (entry.attempts || 0) + 1, lastError: error.message, lastAttemptAt: new Date().toISOString() });
          if (!options.quiet) throw error;
          break;
        }
      }
      const pending = (await listQueue()).length;
      if (pending) await registerBackgroundSync();
      return { synced, pending };
    } finally {
      flushing = false;
    }
  }

  async function migrateLocalPhotos({ profileKey, onProgress } = {}) {
    const { userId } = cloudContext();
    const photos = await storeRequest(PHOTO_STORE, "readonly", (store) => store.index("profile").getAll(profileKey));
    const pending = photos.filter((photo) => photo.blob && photo.cloudSync?.status !== "synced");
    for (let index = 0; index < pending.length; index += 1) {
      await queuePhoto(pending[index], { defer: true });
      onProgress?.({ phase: "queued", current: index + 1, total: pending.length, photo: pending[index] });
    }
    const result = await flushQueue();
    onProgress?.({ phase: "complete", current: pending.length - result.pending, total: pending.length, ...result, userId });
    return { found: photos.length, queued: pending.length, ...result };
  }

  window.addEventListener("online", () => flushQueue({ quiet: true }));
  navigator.serviceWorker?.addEventListener?.("message", (event) => {
    if (event.data?.type === "FITPLAN_PHOTO_SYNC") flushQueue({ quiet: true });
  });
  window.addEventListener("fitplan:cloud-auth", (event) => {
    if (event.detail?.user?.id && navigator.onLine) flushQueue({ quiet: true });
  });

  window.FitPlanPhotoSync = Object.freeze({ SYNC_TAG, queuePhoto, flushQueue, migrateLocalPhotos, uploadPhoto, registerBackgroundSync });
})();
