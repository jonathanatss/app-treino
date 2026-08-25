/**
 * Pure logic extracted from stitch-ui.js for unit testing.
 * Must stay in sync with linkedCloudProfileId() in public/stitch-ui.js.
 */

/**
 * Returns the legacy_profile_key if the cloud snapshot has a valid,
 * active, linked profile — otherwise null.
 *
 * @param {object} cloud - snapshot from fitplanCloud
 * @param {object} profiles - map of known local profile IDs
 */
export function linkedCloudProfileId(cloud, profiles) {
  const linkedId = cloud?.profile?.legacy_profile_key;
  if (!cloud?.ready || !cloud?.user || cloud?.profile?.active === false) return null;
  return linkedId && profiles[linkedId] ? linkedId : null;
}
