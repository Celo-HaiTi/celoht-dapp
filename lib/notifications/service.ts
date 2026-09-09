import { getBackendNotificationPreferences, getBackendNotifications, markBackendNotificationRead, markBackendNotificationsRead, saveBackendNotificationPreferences, isBackendConfigured } from "@/lib/backend";
import { NOTIFICATION_EVENT } from "./config";
import { readAllLocalNotifications, readLocalNotifications, readLocalPreferences, normalizeWalletAddress, writeLocalNotifications, writeLocalPreferences } from "./storage";
import { defaultNotificationPreferences, type CreateNotificationInput, type NotificationPreferences, type NotificationRecord } from "./types";

function notifyChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(NOTIFICATION_EVENT));
}

function localId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const local = readLocalPreferences(typeof window === "undefined" ? undefined : window.localStorage);
  if (!isBackendConfigured()) return local;
  try {
    const remote = await getBackendNotificationPreferences();
    const preferences = { ...defaultNotificationPreferences, ...remote };
    writeLocalPreferences(window.localStorage, preferences);
    return preferences;
  } catch {
    return local;
  }
}

export async function saveNotificationPreferences(preferences: NotificationPreferences) {
  writeLocalPreferences(typeof window === "undefined" ? undefined : window.localStorage, preferences);
  notifyChanged();
  if (!isBackendConfigured()) return { persisted: false };
  try {
    await saveBackendNotificationPreferences(preferences);
    return { persisted: true };
  } catch {
    return { persisted: false };
  }
}

export async function listNotifications(walletAddress: string): Promise<NotificationRecord[]> {
  const normalized = normalizeWalletAddress(walletAddress);
  const local = readLocalNotifications(typeof window === "undefined" ? undefined : window.localStorage, normalized);
  if (!isBackendConfigured()) return local;
  try {
    const remote = await getBackendNotifications();
    writeLocalNotifications(window.localStorage, remote);
    return remote;
  } catch {
    return local;
  }
}

export async function createNotification(input: CreateNotificationInput): Promise<NotificationRecord | null> {
  const record: NotificationRecord = { ...input, id: localId(), createdAt: new Date().toISOString(), deliveryStatus: input.deliveryStatus ?? "delivered" };
  const storage = typeof window === "undefined" ? undefined : window.localStorage;
  const allRecords = readAllLocalNotifications(storage);
  if (allRecords.some((item) => item.deduplicationKey === record.deduplicationKey)) return allRecords.find((item) => item.deduplicationKey === record.deduplicationKey) ?? null;
  // Notification creation is intentionally local on the static client. Durable
  // records must be created by an authenticated backend worker, never by a
  // browser request that could be manipulated by the user.
  writeLocalNotifications(storage, [record, ...allRecords]);
  notifyChanged();
  return record;
}

export async function markNotificationRead(id: string) {
  if (isBackendConfigured()) {
    try { await markBackendNotificationRead(id); } catch { /* local fallback below */ }
  }
  updateLocalRecords((records) => records.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
}

export async function markAllNotificationsRead(walletAddress: string) {
  if (isBackendConfigured()) {
    try { await markBackendNotificationsRead(); } catch { /* local fallback below */ }
  }
  const now = new Date().toISOString();
  updateLocalRecords((records) => records.map((item) => normalizeWalletAddress(item.recipientWalletAddress) === normalizeWalletAddress(walletAddress) ? { ...item, readAt: item.readAt ?? now } : item));
}

function updateLocalRecords(transform: (records: NotificationRecord[]) => NotificationRecord[]) {
  if (typeof window === "undefined") return;
  let records: NotificationRecord[] = [];
  try { records = JSON.parse(window.localStorage.getItem("celoht.notifications") ?? "[]") as NotificationRecord[]; } catch { records = []; }
  writeLocalNotifications(window.localStorage, transform(records));
  notifyChanged();
}
