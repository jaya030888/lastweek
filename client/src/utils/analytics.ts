/**
 * Privacy-Preserving Lightweight Analytics Module
 * 
 * - Fully respects Do Not Track (DNT) header and settings.
 * - Collects zero personally identifiable information (No IP, no cookies, no user tracking).
 * - Records anonymous event tallies for platform improvement.
 */

export interface AnalyticsEvent {
  category: 'navigation' | 'safety' | 'community' | 'ai';
  action: string;
  label?: string;
  value?: number;
}

class PrivacyAnalytics {
  private isDntEnabled(): boolean {
    if (typeof window === 'undefined') return true;
    return (
      navigator.doNotTrack === '1' ||
      (window as any).doNotTrack === '1' ||
      navigator.doNotTrack === 'yes'
    );
  }

  public trackPageView(path: string): void {
    if (this.isDntEnabled()) {
      return;
    }

    try {
      // In development / demo mode, logs locally without transmitting private information
      const logEntry = {
        type: 'pageview',
        path,
        timestamp: new Date().toISOString(),
      };
      
      const views = JSON.parse(localStorage.getItem('hv_anon_analytics_views') || '[]');
      views.push(logEntry);
      if (views.length > 50) views.shift();
      localStorage.setItem('hv_anon_analytics_views', JSON.stringify(views));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  public trackEvent(event: AnalyticsEvent): void {
    if (this.isDntEnabled()) {
      return;
    }

    try {
      const events = JSON.parse(localStorage.getItem('hv_anon_analytics_events') || '[]');
      events.push({
        ...event,
        timestamp: new Date().toISOString(),
      });
      if (events.length > 50) events.shift();
      localStorage.setItem('hv_anon_analytics_events', JSON.stringify(events));
    } catch {
      // Ignore
    }
  }
}

export const analytics = new PrivacyAnalytics();

