import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type AppNotification,
  clearNotifications as clearStoredNotifications,
  getNotifications,
  markAllAsRead as markAllStoredNotifications,
  markAsRead as markStoredNotificationAsRead,
} from "@/services/notifications";
import { readMockSessionUser } from "@/services/mockSession";
import {
  MOCK_SESSION_USER_STORAGE_KEY,
  NOTIFICATIONS_STORAGE_KEY,
  NOTIFICATIONS_UPDATED_EVENT,
} from "@/config/storage";

type NotificationsSnapshot = {
  currentUserId: number | null;
  notifications: AppNotification[];
};

const readSnapshot = (accessToken: string | null): NotificationsSnapshot => {
  if (!accessToken) {
    return {
      currentUserId: null,
      notifications: [],
    };
  }

  const currentUser = readMockSessionUser();
  if (!currentUser) {
    return {
      currentUserId: null,
      notifications: [],
    };
  }

  return {
    currentUserId: currentUser.user_id,
    notifications: getNotifications(currentUser.user_id),
  };
};

export function useNotifications(accessToken: string | null) {
  const [snapshot, setSnapshot] = useState<NotificationsSnapshot>(() =>
    readSnapshot(accessToken)
  );

  const syncNotifications = useCallback(() => {
    setSnapshot(readSnapshot(accessToken));
  }, [accessToken]);

  useEffect(() => {
    syncNotifications();
  }, [syncNotifications]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === NOTIFICATIONS_STORAGE_KEY ||
        event.key === MOCK_SESSION_USER_STORAGE_KEY
      ) {
        syncNotifications();
      }
    };

    const handleNotificationsUpdated = () => {
      syncNotifications();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      handleNotificationsUpdated as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
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
