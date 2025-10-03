import type { AnalyticsClient, AnalyticsConfig, AnalyticsEvent, AnalyticsPageView } from './types';

export function createAnalyticsClient(config: AnalyticsConfig): AnalyticsClient {
  const { trackingId, debug = false, anonymizeIp = true } = config;

  // Support for multiple analytics providers
  const gtag =
    typeof window !== 'undefined'
      ? (window as { gtag?: (...args: unknown[]) => void }).gtag
      : undefined;

  function sendToGoogleAnalytics(eventName: string, params: Record<string, unknown>): void {
    if (gtag) {
      gtag('event', eventName, params);
    } else if (debug) {
      console.log('Analytics event:', eventName, params);
    }
  }

  return {
    pageView(page: AnalyticsPageView): void {
      if (debug) {
        console.log('Page view:', page);
      }

      sendToGoogleAnalytics('page_view', {
        page_path: page.path,
        page_title: page.title,
        page_referrer: page.referrer,
      });
    },

    event(event: AnalyticsEvent): void {
      if (debug) {
        console.log('Event:', event);
      }

      sendToGoogleAnalytics(event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction,
      });
    },

    setUser(userId: string): void {
      if (debug) {
        console.log('Set user:', userId);
      }

      if (gtag) {
        gtag('config', trackingId, {
          user_id: userId,
          anonymize_ip: anonymizeIp,
        });
      }
    },

    setProperty(name: string, value: string | number | boolean): void {
      if (debug) {
        console.log('Set property:', name, value);
      }

      if (gtag) {
        gtag('set', 'user_properties', {
          [name]: value,
        });
      }
    },
  };
}
