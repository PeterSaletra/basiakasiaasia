import { logEvent as fbLogEvent, type Analytics } from "firebase/analytics";
import { analytics } from "@/config/firebase";

export function logScreenView(screenName: string) {
  if (!analytics) return;
  fbLogEvent(analytics, "screen_view", {
    firebase_screen: screenName,
    firebase_screen_class: screenName,
  });
}

export function logEvent(eventName: string, params?: Record<string, unknown>) {
  if (!analytics) return;
  fbLogEvent(analytics as Analytics, eventName, params);
}
