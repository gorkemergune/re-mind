import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

let permissionChecked = false;
let hasPermission = false;

async function ensurePermission(): Promise<boolean> {
  if (permissionChecked) return hasPermission;

  hasPermission = await isPermissionGranted();
  if (!hasPermission) {
    const result = await requestPermission();
    hasPermission = result === "granted";
  }
  permissionChecked = true;
  return hasPermission;
}

export async function sendNativeNotification(title: string, body: string) {
  try {
    const granted = await ensurePermission();
    if (!granted) return;
    sendNotification({ title, body });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
}
