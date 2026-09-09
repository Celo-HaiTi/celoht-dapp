import { isAddress } from "viem";
import { MAX_LOCAL_NOTIFICATIONS, NOTIFICATION_PREFERENCES_KEY, NOTIFICATION_RECORDS_KEY } from "./config";
import { defaultNotificationPreferences, type NotificationPreferences, type NotificationRecord } from "./types";

export function normalizeWalletAddress(address: string): string {
  return isAddress(address) ? address.toLowerCase() : address.trim().toLowerCase();
}

export function readLocalPreferences(storage: Storage | undefined): NotificationPreferences {
  if (!storage) return defaultNotificationPreferences;
  try {
    const raw = storage.getItem(NOTIFICATION_PREFERENCES_KEY);
    if (!raw) return defaultNotificationPreferences;
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return { ...defaultNotificationPreferences, ...parsed };
  } catch {
    return defaultNotificationPreferences;
  }
}

export function writeLocalPreferences(storage: Storage | undefined, preferences: NotificationPreferences) {
  storage?.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(preferences));
}

export function readLocalNotifications(storage: Storage | undefined, walletAddress: string): NotificationRecord[] {
  return readAllLocalNotifications(storage).filter((item) => normalizeWalletAddress(item.recipientWalletAddress) === normalizeWalletAddress(walletAddress)).slice(0, MAX_LOCAL_NOTIFICATIONS);
}

export function readAllLocalNotifications(storage: Storage | undefined): NotificationRecord[] {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(NOTIFICATION_RECORDS_KEY) ?? "[]") as NotificationRecord[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_LOCAL_NOTIFICATIONS) : [];
  } catch {
    return [];
  }
}

export function writeLocalNotifications(storage: Storage | undefined, records: NotificationRecord[]) {
  storage?.setItem(NOTIFICATION_RECORDS_KEY, JSON.stringify(records.slice(0, MAX_LOCAL_NOTIFICATIONS)));
}