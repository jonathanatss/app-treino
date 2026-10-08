export function linkedCloudProfileId(cloud, profiles) {
  const linkedId = cloud?.profile?.legacy_profile_key;
  if (!cloud?.ready || !cloud?.user || cloud?.profile?.active === false) return null;
  return linkedId && profiles[linkedId] ? linkedId : null;
}

export function shouldShowRecovery(cloud) {
  return cloud?.state === "recovering_password" || cloud?.state === "updating_password";
}
