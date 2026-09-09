"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, CheckCheck, ExternalLink, ShieldAlert, Sprout, Users, WalletCards, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useNotifications } from "@/lib/notifications/hooks";
import type { NotificationRecord, NotificationType } from "@/lib/notifications/types";

export function NotificationCenter({ walletAddress }: { walletAddress?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const { records, unreadCount, markRead, markAllRead } = useNotifications(walletAddress);

  const labelFor = (type: NotificationType) => ({
    transaction_confirmed: t("notifications.transactionConfirmed"), transaction_failed: t("notifications.transactionFailed"),
    security_alert: t("notifications.securityAlert"), agent_activity: t("notifications.agentActivity"),
    reforestation_update: t("notifications.reforestationUpdate"), celoht_announcement: t("notifications.announcement"),
  })[type];
  const iconFor = (type: NotificationType) => type.startsWith("transaction") ? <WalletCards size={16} aria-hidden="true" /> : type === "security_alert" ? <ShieldAlert size={16} aria-hidden="true" /> : type === "agent_activity" ? <Users size={16} aria-hidden="true" /> : type === "reforestation_update" ? <Sprout size={16} aria-hidden="true" /> : <Bell size={16} aria-hidden="true" />;

  return <div className="relative"><button type="button" className="notification-trigger" aria-label={`${t("notifications.title")}${unreadCount ? `, ${t("notifications.unread", { count: unreadCount })}` : ""}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><Bell size={17} aria-hidden="true" />{unreadCount > 0 && <span className="notification-count" aria-hidden="true">{unreadCount > 99 ? "99+" : unreadCount}</span>}</button>{open && <><button type="button" className="fixed inset-0 z-40 cursor-default" aria-label={t("common.close")} onClick={() => setOpen(false)} /><section className="notification-panel absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--celoht-radius-lg)] border border-white/12 bg-[#101d31] shadow-[0_2rem_6rem_rgba(1,5,12,0.42)]" aria-label={t("notifications.title")}><header className="flex items-center justify-between gap-3 border-b border-white/10 p-4"><div><p className="section-kicker">CeloHT</p><h2 className="font-display text-lg font-semibold text-white">{t("notifications.title")}</h2></div><div className="flex items-center gap-1">{unreadCount > 0 && <button type="button" className="notification-action" onClick={() => void markAllRead()}><CheckCheck size={14} aria-hidden="true" /> {t("notifications.markAllRead")}</button>}<button type="button" className="notification-action" aria-label={t("common.close")} onClick={() => setOpen(false)}><X size={16} aria-hidden="true" /></button></div></header>{!walletAddress ? <p className="p-5 text-sm leading-6 text-parchment-100/60">{t("notifications.connectWallet")}</p> : records.length === 0 ? <div className="p-7 text-center"><Bell className="mx-auto text-gold-300" size={22} aria-hidden="true" /><p className="mt-3 text-sm text-parchment-100/65">{t("notifications.empty")}</p></div> : <ul className="max-h-[min(28rem,70vh)] overflow-y-auto">{records.slice(0, 20).map((record) => <NotificationItem key={record.id} record={record} label={labelFor(record.type)} icon={iconFor(record.type)} onRead={() => void markRead(record.id)} />)}</ul>}<footer className="border-t border-white/10 p-3"><Link href="/notifications" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 text-xs font-semibold text-gold-300">{t("notifications.viewAll")} <ExternalLink size={13} aria-hidden="true" /></Link></footer></section></>}</div>;
}

function NotificationItem({ record, label, icon, onRead }: { record: NotificationRecord; label: string; icon: React.ReactNode; onRead: () => void }) {
  return <li className={`notification-item ${record.readAt ? "" : "notification-unread"}`}><div className="notification-item-icon">{icon}</div><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-300/80">{label}</p><p className="mt-1 text-sm font-semibold text-white">{record.title}</p><p className="mt-1 text-xs leading-5 text-parchment-100/58">{record.message}</p><time className="mt-2 block text-[10px] text-parchment-100/38">{new Date(record.createdAt).toLocaleString()}</time></div>{!record.readAt && <button type="button" className="notification-read" onClick={onRead} aria-label="Mark notification as read"><span className="sr-only">Mark notification as read</span><span aria-hidden="true" /></button>}</li>;
}