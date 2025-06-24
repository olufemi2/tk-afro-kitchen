/**
 * Safari-specific navigation utilities
 * Bypasses Next.js router for reliable Safari payment flows
 */

export interface OrderData {
  orderId: string;
  amount: string;
  timestamp: string;
  customerInfo?: any;
}

export class SafariNavigation {
  private static isSafari(): boolean {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent;
    return /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
  }

  private static isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  static shouldUseSafariNavigation(): boolean {
    return this.isSafari() || this.isIOS();
  }

  /**
   * Store order data for Safari navigation
   */
  static storeOrderData(orderData: OrderData): void {
    try {
      // Multiple storage strategies for reliability
      const dataString = JSON.stringify(orderData);
      
      localStorage.setItem('safariOrderData', dataString);
      localStorage.setItem('lastOrderDetails', dataString);
      localStorage.setItem('orderBackup', dataString);
      
      // Set timestamp for cleanup
      localStorage.setItem('safariNavigationTime', Date.now().toString());
      
      console.log('🍎 Safari order data stored:', orderData.orderId);
    } catch (error) {
      console.error('Failed to store Safari order data:', error);
    }
  }

  /**
   * Navigate to success page using Safari-compatible method
   */
  static navigateToSuccess(orderData: OrderData): void {
    console.log('🍎 Starting Safari navigation to success page');
    
    // Store data first
    this.storeOrderData(orderData);
    
    // Build success URL with complete order data
    const params = new URLSearchParams({
      orderId: orderData.orderId,
      amount: orderData.amount,
      timestamp: orderData.timestamp,
      safari: 'true',
      static: 'true',
      nav: 'safari'
    });
    
    const successUrl = `${window.location.origin}/success?${params.toString()}`;
    
    // Use immediate navigation for Safari - no delays
    console.log('🚀 Safari: Immediate static navigation to:', successUrl);
    
    // Force static navigation that bypasses Next.js router completely
    window.location.replace(successUrl);
  }

  /**
   * Retrieve order data on success page
   */
  static retrieveOrderData(): OrderData | null {
    try {
      // Try multiple storage keys
      const sources = ['safariOrderData', 'lastOrderDetails', 'orderBackup'];
      
      for (const source of sources) {
        const stored = localStorage.getItem(source);
        if (stored) {
          const data = JSON.parse(stored);
          console.log('🍎 Safari order data retrieved from:', source);
          return data;
        }
      }
      
      // Fallback to URL parameters
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('orderId');
      const amount = params.get('amount');
      const timestamp = params.get('timestamp');
      
      if (orderId && amount && timestamp) {
        const urlData = { orderId, amount, timestamp };
        console.log('🍎 Safari order data from URL params:', urlData);
        return urlData;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to retrieve Safari order data:', error);
      return null;
    }
  }

  /**
   * Clean up Safari navigation data
   */
  static cleanup(): void {
    try {
      localStorage.removeItem('safariOrderData');
      localStorage.removeItem('safariNavigationTime');
      // Keep lastOrderDetails for other components
      console.log('🍎 Safari navigation data cleaned up');
    } catch (error) {
      console.error('Failed to cleanup Safari data:', error);
    }
  }

  /**
   * Navigate to menu page (Safari-compatible)
   */
  static navigateToMenu(): void {
    if (this.shouldUseSafariNavigation()) {
      window.location.replace(`${window.location.origin}/menu`);
    } else {
      // Let calling code handle router navigation
      return;
    }
  }

  /**
   * Navigate to home page (Safari-compatible)
   */
  static navigateToHome(): void {
    if (this.shouldUseSafariNavigation()) {
      window.location.replace(window.location.origin);
    } else {
      // Let calling code handle router navigation
      return;
    }
  }
}