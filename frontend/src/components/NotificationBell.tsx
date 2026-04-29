import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/services/notifications";

const formatNotificationTime = (createdAt: string): string => {
  const createdAtDate = new Date(createdAt);
  const diffInMinutes = Math.floor((Date.now() - createdAtDate.getTime()) / 60000);

  if (diffInMinutes < 1) {
    return "just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  return createdAtDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

const getNotificationDotClass = (notification: AppNotification): string => {
  switch (notification.kind) {
    case "success":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    case "moderation":
      return "bg-rose-500";
    default:
      return "bg-sky-500";
  }
};

function NotificationBell({ accessToken }: { accessToken: string | null }) {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications(accessToken);

  if (!accessToken) {
    return null;
  }

  const handleNotificationClick = (notification: AppNotification) => {
    markAsRead(notification.id);

    if (notification.href) {
      navigate(notification.href);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[24rem] p-0">
        <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                : "You are all caught up"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              aria-label="Mark all notifications as read"
            >
              <CheckCheck className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={clearNotifications}
              disabled={notifications.length === 0}
              aria-label="Clear notifications"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No notifications yet.
            </div>
          )}

          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "w-full border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50",
                notification.readAt === null ? "bg-sky-50/60" : "bg-white"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                    getNotificationDotClass(notification),
                    notification.readAt !== null && "opacity-40"
                  )}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-gray-500">
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    {notification.message}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
