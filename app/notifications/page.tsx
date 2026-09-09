"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useAccount } from "wagmi";
import { useI18n } from "@/lib/i18n/context";
import { useNotifications } from "@/lib/notifications/hooks";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function NotificationsPage() {
  const { address } = useAccount();
  const { t } = useI18n();
  const { records, unreadCount, markRead, markAllRead } = useNotifications(address);
  return <div className="notifications-shell min-h-[calc(100dvh-64px)] px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:py-10"><div className="mx-auto max-w-4xl"><header className="notifications-header"><div><p className="section-kicker">CeloHT</p><h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("notifications.title")}</h1><p className="mt-2 text-sm text-parchment-100/60">{unreadCount ? t("notifications.unread", { count: unreadCount }) : t("notifications.empty")}</p></div><div className="flex items-center gap-2"><NotificationCenter walletAddress={address} />{unreadCount > 0 && <button type="button" className="notification-action" onClick={() => void markAllRead()}><CheckCheck size={15} aria-hidden="true" /> {t("notifications.markAllRead")}</button>}</div></header>{!address ? <section className="notification-history-empty"><Bell size={22} className="text-gold-300" aria-hidden="true" /><p className="mt-3 text-sm text-parchment-100/65">{t("notifications.connectWallet")}</p></section> : records.length === 0 ? <section className="notification-history-empty"><Bell size={22} className="text-gold-300" aria-hidden="true" /><p className="mt-3 text-sm text-parchment-100/65">{t("notifications.empty")}</p></section> : <ul className="notification-history-list">{records.map((record) => <li key={record.id} className={`notification-history-item ${record.readAt ? "" : "notification-unread"}`}><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-300/80">{record.type.replaceAll("_", " ")}</p><h2 className="mt-1 text-sm font-semibold text-white">{record.title}</h2><p className="mt-1 text-sm leading-6 text-parchment-100/60">{record.message}</p><time className="mt-2 block text-xs text-parchment-100/40">{new Date(record.createdAt).toLocaleString()}</time></div>{!record.readAt && <button type="button" className="notification-action" onClick={() => void markRead(record.id)}>{t("notifications.markRead")}</button>}</li>)}</ul>}</div></div>;
}