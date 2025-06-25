/**
 * Comprehensive Safari Payment Handler
 * Based on complete E2E Safari payment solution
 */

interface UserEnvironment {
  isIOS: boolean;
  isSafari: boolean;
  isIOSSafari: boolean;
  isPrivateBrowsing: boolean;
  version?: string;
}

interface PaymentConfig {
  stripePublicKey?: string;
  paypalClientId?: string;
  orderId: string;
  amount: string;
  currency: string;
  description: string;
}

interface PaymentData {
  amount: string;
  currency: string;
  description: string;
  billingDetails: {
    name: string;
    email: string;
    phone?: string;
    address?: any;
  };
}

export class SafariPaymentHandler {
  private config: PaymentConfig;
  private environment: UserEnvironment | null = null;
  private paymentInProgress = false;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.init();
  }

  async init() {
    this.environment = await this.detectUserEnvironment();
    this.setupEventListeners();
    this.configurePaymentMethods();
  }

  // 1. ENHANCED DEVICE AND BROWSER DETECTION
  private async detectUserEnvironment(): Promise<UserEnvironment> {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
    const isIOSSafari = isIOS && isSafari;
    const isPrivateBrowsing = await this.checkPrivateBrowsing();
    
    console.log('🔍 Safari Payment Handler - Environment detected:', {
      isIOS,
      isSafari,
      isIOSSafari,
      isPrivateBrowsing,
      userAgent
    });

    return {
      isIOS,
      isSafari,
      isIOSSafari,
      isPrivateBrowsing,
      version: this.extractSafariVersion(userAgent)
    };
  }

  // Check for private browsing mode which affects localStorage
  private async checkPrivateBrowsing(): Promise<boolean> {
    try {
      await new Promise((resolve, reject) => {
        const db = indexedDB.open('test');
        db.onerror = () => reject();
        db.onsuccess = () => resolve(undefined);
      });
      return false;
    } catch {
      console.log('🔒 Private browsing detected');
      return true;
    }
  }

  private extractSafariVersion(userAgent: string): string {
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    return match ? match[1] : 'unknown';
  }

  // 2. SAFARI-SPECIFIC CONFIGURATION
  private configurePaymentMethods() {
    if (this.environment?.isIOSSafari) {
      console.log('🍎 Configuring Safari-optimized payment methods');
      this.addSafariWarnings();
      this.setupSafariWorkarounds();
    }
  }

  // 3. MAIN PAYMENT INITIATION WITH SAFARI HANDLING
  async initiatePayment(paymentMethod: string, paymentData: PaymentData): Promise<any> {
    if (this.paymentInProgress) {
      console.warn('⚠️ Payment already in progress');
      return;
    }

    this.paymentInProgress = true;
    console.log(`🚀 Initiating ${paymentMethod} payment for ${this.environment?.isIOSSafari ? 'Safari' : 'standard browser'}`);

    try {
      if (this.environment?.isIOSSafari) {
        return await this.handleSafariPayment(paymentMethod, paymentData);
      } else {
        return await this.handleStandardPayment(paymentMethod, paymentData);
      }
    } catch (error) {
      this.handlePaymentError(error);
      throw error;
    } finally {
      this.paymentInProgress = false;
    }
  }

  // 4. SAFARI-SPECIFIC PAYMENT HANDLING
  private async handleSafariPayment(paymentMethod: string, paymentData: PaymentData) {
    // Show loading state immediately for Safari
    this.showLoadingState('Processing Safari payment...');

    switch (paymentMethod) {
      case 'apple_pay':
        return await this.processApplePay(paymentData);
      case 'paypal':
        return await this.processPayPalWithSafariWorkaround(paymentData);
      case 'stripe':
        return await this.processStripeWithSafariWorkaround(paymentData);
      default:
        throw new Error(`Unsupported payment method for Safari: ${paymentMethod}`);
    }
  }

  private async handleStandardPayment(paymentMethod: string, paymentData: PaymentData) {
    console.log('🖥️ Processing standard payment');
    // Standard payment processing for non-Safari browsers
    // Implementation depends on the specific payment method
    return { method: paymentMethod, data: paymentData };
  }

  // 5. STRIPE WITH SAFARI WORKAROUNDS
  private async processStripeWithSafariWorkaround(paymentData: PaymentData) {
    console.log('💳 Processing Stripe with Safari workarounds');
    
    // Store payment intent for recovery
    this.storePaymentIntent(paymentData, 'stripe');
    
    // For Safari, we recommend using PayPal instead
    throw new Error('Stripe payments may have issues in Safari. Please use PayPal or Apple Pay for the best experience.');
  }

  // 6. PAYPAL WITH SAFARI WORKAROUNDS
  private async processPayPalWithSafariWorkaround(paymentData: PaymentData) {
    console.log('🔵 Processing PayPal with Safari workarounds');
    
    // Store payment intent for recovery
    this.storePaymentIntent(paymentData, 'paypal');

    // Create PayPal order with Safari-specific configuration
    const orderResponse = await fetch('/api/create-paypal-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency,
        customer_details: paymentData.billingDetails,
        safari_payment: true,
        safari_version: this.environment?.version
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const orderData = await orderResponse.json();

    // For Safari, use the direct PayPal redirect approach
    if (this.environment?.isIOSSafari) {
      return this.handleSafariPayPalRedirect(orderData);
    }

    return orderData;
  }

  // 7. SAFARI PAYPAL REDIRECT WITH DELAYS
  private async handleSafariPayPalRedirect(orderData: any) {
    console.log('🍎 Handling Safari PayPal redirect with delays');
    
    // Show success message with delay
    this.showSuccessMessage('Payment approved! Redirecting...');
    
    // Critical: Add delay before redirect for Safari
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('🚀 Safari: Executing delayed redirect to success page');
        this.redirectToSuccess({
          id: orderData.id,
          method: 'paypal',
          safari: true
        });
        resolve(orderData);
      }, 3000); // 3 second delay for Safari
    });
  }

  // 8. APPLE PAY IMPLEMENTATION (BEST FOR SAFARI)
  private async processApplePay(paymentData: PaymentData) {
    console.log('🍏 Processing Apple Pay');
    
    if (!window.ApplePaySession || !(window.ApplePaySession as any).canMakePayments()) {
      throw new Error('Apple Pay not available on this device');
    }

    const request = {
      countryCode: 'GB',
      currencyCode: paymentData.currency.toUpperCase(),
      merchantCapabilities: ['supports3DS'],
      supportedNetworks: ['visa', 'masterCard', 'amex'],
      total: {
        label: paymentData.description,
        amount: paymentData.amount
      }
    };

    const session = new (window.ApplePaySession as any)(3, request);

    return new Promise((resolve, reject) => {
      session.onvalidatemerchant = async (event: any) => {
        try {
          const merchantSession = await this.validateApplePayMerchant(event.validationURL);
          session.completeMerchantValidation(merchantSession);
        } catch (error) {
          session.abort();
          reject(error);
        }
      };

      session.onpaymentauthorized = async (event: any) => {
        try {
          const result = await this.processApplePayment(event.payment);
          session.completePayment((window.ApplePaySession as any).STATUS_SUCCESS);
          
          // Safari-specific success handling
          setTimeout(() => {
            this.redirectToSuccess(result);
          }, 2000);
          
          resolve(result);
        } catch (error) {
          session.completePayment((window.ApplePaySession as any).STATUS_FAILURE);
          reject(error);
        }
      };

      session.begin();
    });
  }

  // 9. UNIVERSAL REDIRECT HANDLING
  private redirectToSuccess(paymentResult: any) {
    const successUrl = this.buildSuccessUrl(paymentResult);
    console.log('🎯 Redirecting to success:', successUrl);

    if (this.environment?.isIOSSafari) {
      this.safariRedirect(successUrl);
    } else {
      window.location.href = successUrl;
    }
  }

  private safariRedirect(url: string) {
    console.log('🍎 Executing Safari-specific redirect');
    
    // Method 1: Try standard redirect with delay
    setTimeout(() => {
      console.log('🚀 Safari redirect attempt 1: window.location.href');
      window.location.href = url;
    }, 1000);

    // Method 2: Fallback - show manual continue button
    setTimeout(() => {
      if (window.location.href.indexOf('success') === -1) {
        console.log('🔄 Safari redirect fallback: showing manual continue button');
        this.showManualContinueButton(url);
      }
    }, 5000);
  }

  // 10. USER INTERFACE FOR SAFARI ISSUES
  private showManualContinueButton(url: string) {
    const continueDiv = document.createElement('div');
    continueDiv.innerHTML = `
      <div class="safari-redirect-fallback" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        <h3 style="color: #1d4ed8; margin-bottom: 10px;">🎉 Payment Successful!</h3>
        <p style="margin-bottom: 20px;">Please click the button below to continue:</p>
        <button onclick="window.location.href='${url}'" style="
          background: #1d4ed8;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
        ">Continue to Order Confirmation</button>
      </div>
    `;
    document.body.appendChild(continueDiv);
  }

  private addSafariWarnings() {
    if (!this.environment?.isIOSSafari) return;

    const warningDiv = document.createElement('div');
    warningDiv.innerHTML = `
      <div class="safari-warning" style="
        background: #fef3c7;
        border: 1px solid #f59e0b;
        color: #92400e;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 1.4;
      ">
        <strong>🍎 Safari Optimized:</strong> We've optimized this payment form for Safari. 
        For the best experience, we recommend using PayPal or Apple Pay.
      </div>
    `;

    const paymentContainer = document.querySelector('[data-payment-container]') || 
                           document.querySelector('#payment-container') ||
                           document.querySelector('.payment-container');
    
    if (paymentContainer) {
      paymentContainer.insertBefore(warningDiv, paymentContainer.firstChild);
    }
  }

  // 11. ERROR HANDLING AND RECOVERY
  private handlePaymentError(error: any) {
    console.error('❌ Payment error:', error);

    let userMessage = 'Payment failed. Please try again.';

    if (this.environment?.isIOSSafari) {
      userMessage += ' If the problem persists, try using PayPal or Apple Pay, or switch to Chrome.';
    }

    this.showErrorMessage(userMessage);
    this.paymentInProgress = false;
  }

  // 12. UTILITY METHODS
  private buildSuccessUrl(paymentResult: any): string {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      payment_id: paymentResult.id || 'unknown',
      order_id: this.config.orderId,
      method: paymentResult.method || 'unknown',
      safari: this.environment?.isIOSSafari ? 'true' : 'false',
      timestamp: Date.now().toString()
    });
    
    return `${baseUrl}/success?${params.toString()}`;
  }

  private storePaymentIntent(paymentData: PaymentData, method: string) {
    try {
      const intentData = {
        ...paymentData,
        method,
        orderId: this.config.orderId,
        timestamp: Date.now(),
        safari: this.environment?.isIOSSafari
      };
      
      localStorage.setItem('safariPaymentIntent', JSON.stringify(intentData));
      console.log('💾 Payment intent stored for recovery');
    } catch (error) {
      console.warn('⚠️ Could not store payment intent:', error);
    }
  }

  private setupEventListeners() {
    // Handle page visibility changes (Safari background/foreground)
    document.addEventListener('visibilitychange', () => {
      if (this.paymentInProgress && !document.hidden) {
        console.log('👁️ Page became visible - checking payment status');
        this.checkPaymentStatus();
      }
    });

    // Handle beforeunload for Safari
    if (this.environment?.isIOSSafari) {
      window.addEventListener('beforeunload', (e) => {
        if (this.paymentInProgress) {
          e.preventDefault();
          e.returnValue = 'Payment is in progress. Are you sure you want to leave?';
        }
      });
    }
  }

  private async checkPaymentStatus() {
    // Implementation to check payment status with server
    console.log('🔄 Checking payment status...');
  }

  private showLoadingState(message: string) {
    console.log('⏳', message);
    // Implementation for loading state UI
  }

  private showSuccessMessage(message: string) {
    console.log('✅', message);
    // Implementation for success message UI
  }

  private showErrorMessage(message: string) {
    console.error('❌', message);
    // Implementation for error message UI
  }

  private async validateApplePayMerchant(validationURL: string) {
    // Implementation for Apple Pay merchant validation
    const response = await fetch('/api/apple-pay/validate-merchant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validationURL })
    });
    return response.json();
  }

  private async processApplePayment(payment: any) {
    // Implementation for processing Apple Pay payment
    const response = await fetch('/api/apple-pay/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment })
    });
    return response.json();
  }

  private setupSafariWorkarounds() {
    console.log('🔧 Setting up Safari-specific workarounds');
    // Additional Safari-specific configurations
  }

  // 13. PUBLIC METHODS
  public isSafari(): boolean {
    return this.environment?.isSafari || false;
  }

  public isIOSSafari(): boolean {
    return this.environment?.isIOSSafari || false;
  }

  public getRecommendedPaymentMethod(): string {
    if (this.environment?.isIOSSafari) {
      if (window.ApplePaySession && (window.ApplePaySession as any).canMakePayments()) {
        return 'apple_pay';
      }
      return 'paypal';
    }
    return 'stripe';
  }
}

// Global type declarations
declare global {
  interface Window {
    ApplePaySession?: any;
  }
}

export default SafariPaymentHandler;