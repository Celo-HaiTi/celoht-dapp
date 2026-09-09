"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { NOTIFICATION_EVENT } from "./config";
import { getNotificationPreferences, listNotifications, markAllNotificationsRead, markNotificationRead, saveNotificationPreferences } from "./service";
import { defaultNotificationPreferences, type NotificationPreferences, type NotificationRecord } from "./types";

const cache = new Map<string, NotificationRecord[]>();
let preferencesCache: NotificationPreferences = defaultNotificationPreferences;

export function useNotificationPreferences() {
  const preferences = useSyncExternalStore(subscribe, () => preferencesCache, () => defaultNotificationPreferences);
  const refresh = useCallback(async () => {
    preferencesCache = await getNotificationPreferences();
    window.dispatchEvent(new Event(NOTIFICATION_EVENT));
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const updatePreference = useCallback(async (key: keyof NotificationPreferences) => {
    preferencesCache = { ...preferencesCache, [key]: !preferencesCache[key] };
    window.dispatchEvent(new Event(NOTIFICATION_EVENT));
    await saveNotificationPreferences(preferencesCache);
  }, []);
  return { preferences, updatePreference, refresh };
}

function getRecordsSnapshot(key: string) {
  if (!cache.has(key)) {
    cache.set(key, []);
  }

  return cache.get(key)!;
}

export function useNotifications(walletAddress?: string) {
  const key = walletAddress?.toLowerCase() ?? "guest";
  const records = useSyncExternalStore(subscribe, () => getRecordsSnapshot(key), () => []);

  const refresh = useCallback(async () => {
    if (!walletAddress) return;
    cache.set(key, await listNotifications(walletAddress));
    window.dispatchEvent(new Event(NOTIFICATION_EVENT));
  }, [key, walletAddress]);

  useEffect(() => { void refresh(); }, [refresh]);

  const markRead = useCallback(async (id: string) => {
    await markNotificationRead(id);
    await refresh();
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    if (!walletAddress) return;
    await markAllNotificationsRead(walletAddress);
    await refresh();
  }, [refresh, walletAddress]);

  return { records, unreadCount: records.filter((item) => !item.readAt).length, refresh, markRead, markAllRead };
}

function subscribe(onChange: () => void) {
  window.addEventListener(NOTIFICATION_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(NOTIFICATION_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}