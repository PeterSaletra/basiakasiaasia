import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type AppNotification,
  clearNotifications as clearStoredNotifications,
  getNotifications,
  markAllAsRead as markAllStoredNotifications,
  markAsRead as markStoredNotificationAsRead,
} from "@/services/notifications";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/config/storage";

type NotificationsSnapshot = {
  currentUserId: string | null;
  notifications: AppNotification[];
};

const readSnapshot = (userId: string | null): NotificationsSnapshot => {
  if (!userId) {
    return {
      currentUserId: null,
      notifications: [],
    };
  }

  return {
    currentUserId: userId,
    notifications: getNotifications(userId),
  };
};

export function useNotifications(userId: string | null) {
  const [snapshot, setSnapshot] = useState<NotificationsSnapshot>(() =>
    readSnapshot(userId)
  );

  const syncNotifications = useCallback(() => {
    setSnapshot(readSnapshot(userId));
  }, [userId]);

  useEffect(() => {
    syncNotifications();
  }, [syncNotifications]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleNotificationsUpdated = () => {
      syncNotifications();
    };

    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      handleNotificationsUpdated as EventListener
    );

    return () => {
      window.removeEventListener(
        NOTIFICATIONS_UPDATED_EVENT,
        handleNotificationsUpdated as EventListener
      );
    };
  }, [syncNotifications]);

  const unreadCount = useMemo(
    () =>
      snapshot.notifications.filter((notification) => notification.readAt === null).length,
    [snapshot.notifications]
  );

  const markAsRead = useCallback(
    (notificationId: string) => {
      if (snapshot.currentUserId === null) {
        return;
      }

      markStoredNotificationAsRead(snapshot.currentUserId, notificationId);
      syncNotifications();
    },
    [snapshot.currentUserId, syncNotifications]
  );

  const markAllAsRead = useCallback(() => {
    if (snapshot.currentUserId === null) {
      return;
    }

    markAllStoredNotifications(snapshot.currentUserId);
    syncNotifications();
  }, [snapshot.currentUserId, syncNotifications]);

  const clearNotifications = useCallback(() => {
    if (snapshot.currentUserId === null) {
      return;
    }

    clearStoredNotifications(snapshot.currentUserId);
    syncNotifications();
  }, [snapshot.currentUserId, syncNotifications]);

  return {
    notifications: snapshot.notifications,
    unreadCount,
    currentUserId: snapshot.currentUserId,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refreshNotifications: syncNotifications,
  };
}
