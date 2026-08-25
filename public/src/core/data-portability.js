// Data export/import utilities.
// Depends on: globals EXPORT_VERSION, todayKey

function collectStoredData() {
  const values = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("gym-app-")) values[key] = localStorage.getItem(key);
  }
  return {
    app: "FitPlan",
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    values
  };
}

function exportData() {
  const payload = collectStoredData();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fitplan-backup-${todayKey}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(String(reader.result || "{}"));
      if (!payload.values || typeof payload.values !== "object") {
        throw new Error("Formato inválido");
      }
      const ok = window.confirm("Importar este backup vai substituir os dados locais do FitPlan neste aparelho. Continuar?");
      if (!ok) return;
      Object.entries(payload.values).forEach(([key, value]) => {
        if (key.startsWith("gym-app-")) localStorage.setItem(key, String(value));
      });
      window.location.reload();
    } catch {
      window.alert("Não foi possível importar o arquivo. Verifique se ele é um backup válido do FitPlan.");
    }
  });
  reader.readAsText(file);
}

