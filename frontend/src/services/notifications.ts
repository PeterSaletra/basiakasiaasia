import {
  NOTIFICATIONS_STORAGE_KEY,
  NOTIFICATIONS_UPDATED_EVENT,
} from "@/config/storage";

export type NotificationKind = "success" | "info" | "warning" | "moderation";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  href?: string;
  createdAt: string;
  readAt: string | null;
};

export type NewNotification = {
  title: string;
  message: string;
  kind: NotificationKind;
  href?: string;
};

type NotificationsStore = Record<string, AppNotification[]>;

const readNotificationsStore = (): NotificationsStore => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawStore = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (!rawStore) {
    return {};
  }

  try {
    return JSON.parse(rawStore) as NotificationsStore;
  } catch {
    return {};
  }
};

const writeNotificationsStore = (store: NotificationsStore): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(store));
};

const emitNotificationsUpdated = (userId: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(NOTIFICATIONS_UPDATED_EVENT, {
      detail: { userId },
    })
  );
};

const createNotificationId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `notification-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const sortNotifications = (notifications: AppNotification[]): AppNotification[] =>
  [...notifications].sort((left, right) => right.createdAt.localeCompare(left.createdAt));

export function getNotifications(userId: string): AppNotification[] {
  const store = readNotificationsStore();
  return sortNotifications(store[userId] ?? []);
}

export function addNotification(
  userId: string,
  notification: NewNotification
): AppNotification {
  const store = readNotificationsStore();
  const nextNotification: AppNotification = {
    id: createNotificationId(),
    title: notification.title,
    message: notification.message,
    kind: notification.kind,
    href: notification.href,
    createdAt: new Date().toISOString(),
    readAt: null,
  };

  store[userId] = sortNotifications([nextNotification, ...(store[userId] ?? [])]);
  writeNotificationsStore(store);
  emitNotificationsUpdated(userId);

  return nextNotification;
}

export function markAsRead(userId: string, notificationId: string): AppNotification[] {
  const store = readNotificationsStore();
  const notifications = store[userId] ?? [];
  const nextNotifications = notifications.map((notification) =>
    notification.id === notificationId && notification.readAt === null
      ? { ...notification, readAt: new Date().toISOString() }
      : notification
  );

  store[userId] = sortNotifications(nextNotifications);
  writeNotificationsStore(store);
  emitNotificationsUpdated(userId);

  return store[userId];
}

export function markAllAsRead(userId: string): AppNotification[] {
  const store = readNotificationsStore();
  const notifications = store[userId] ?? [];
  const timestamp = new Date().toISOString();
  const nextNotifications = notifications.map((notification) =>
    notification.readAt === null
      ? { ...notification, readAt: timestamp }
      : notification
  );

  store[userId] = sortNotifications(nextNotifications);
  writeNotificationsStore(store);
  emitNotificationsUpdated(userId);

  return store[userId];
}

export function clearNotifications(userId: string): void {
  const store = readNotificationsStore();
  delete store[userId];
  writeNotificationsStore(store);
  emitNotificationsUpdated(userId);
}
