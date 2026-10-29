import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function runningInDesktop(): boolean {
  return isTauri();
}

export async function quitDesktopApp(): Promise<void> {
  if (!isTauri()) {
    window.close();
    return;
  }

  await getCurrentWindow().close();
}
