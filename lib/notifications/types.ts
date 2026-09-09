export const notificationTypes = [
  "transaction_confirmed",
  "transaction_failed",
  "security_alert",
  "agent_activity",
  "reforestation_update",
  "celoht_announcement",
] as const;

export type NotificationType = (typeof notificationTypes)[number];
export type NotificationPriority = "low" | "normal" | "high" | "critical";
export type DeliveryStatus = "pending" | "delivered" | "failed";

export type NotificationRecord = {
  id: string;
  recipientWalletAddress: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  transactionHash?: string;
  chainId?: number;
  entityId?: string;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  priority: NotificationPriority;
  deliveryStatus: DeliveryStatus;
  deduplicationKey: string;
  createdBy?: string;
  deepLink?: string;
};

export type NotificationPreferences = {
  transaction_confirmed: boolean;
  transaction_failed: boolean;
  security_alert: boolean;
  agent_activity: boolean;
  reforestation_update: boolean;
  celoht_announcement: boolean;
};

export const defaultNotificationPreferences: NotificationPreferences = {
  transaction_confirmed: true,
  transaction_failed: true,
  security_alert: true,
  agent_activity: false,
  reforestation_update: true,
  celoht_announcement: true,
};

export type CreateNotificationInput = Omit<NotificationRecord, "id" | "createdAt" | "readAt" | "deliveryStatus"> & {
  deliveryStatus?: DeliveryStatus;
};