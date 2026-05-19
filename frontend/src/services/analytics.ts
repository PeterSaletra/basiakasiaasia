import { logEvent as fbLogEvent, type Analytics } from "firebase/analytics";
import { analytics } from "@/config/firebase";

export function logPageView(pageTitle: string, pagePath: string) {
  if (!analytics) return;
  fbLogEvent(analytics, "page_view", {
    page_title: pageTitle,
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
  });
}

export function logEvent(eventName: string, params?: Record<string, unknown>) {
  if (!analytics) return;
  fbLogEvent(analytics as Analytics, eventName, params);
}
