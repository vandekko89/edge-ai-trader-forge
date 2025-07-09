import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';

export interface DerivConnection {
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (request: any) => Promise<any>;
  send: (request: any) => Promise<any>;
  isConnected: boolean;
}

export interface TradeParams {
  symbol: string;
  amount: number;
  duration: number;
  durationType: 'seconds' | 'minutes' | 'hours';
  prediction: 'CALL' | 'PUT';
}

class DerivApiService {
  private api: DerivAPIBasic | null = null;
  private appId: number = 1089; // Test app ID
  private wsUrl: string = 'wss://ws.derivws.com/websockets/v3';
  private isConnected: boolean = false;
  private subscribers: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.disconnect();
      });
    }
  }

  async connect(appId?: number): Promise<void> {
    try {
      if (appId) {
        this.appId = appId;
      }

      this.api = new DerivAPIBasic({
        app_id: this.appId,
        websocket: WebSocket,
        lang: 'EN',
        brand: 'binary'
      });

      await this.api.connect();
      this.isConnected = true;
      
      // Log connection success
      this.logEvent('info', 'system', 'Connected to Deriv API successfully', `App ID: ${this.appId}`);
      
      return Promise.resolve();
    } catch (error) {
      this.isConnected = false;
      this.logEvent('error', 'system', 'Failed to connect to Deriv API', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  disconnect(): void {
    if (this.api) {
      this.api.disconnect();
      this.isConnected = false;
      this.subscribers.clear();
      this.logEvent('info', 'system', 'Disconnected from Deriv API', 'Connection closed successfully');
    }
  }

  async authorize(token: string): Promise<any> {
    if (!this.isConnected || !this.api) {
      throw new Error('Not connected to Deriv API');
    }

    try {
      const response = await this.api.authorize(token);
      this.logEvent('success', 'api', 'Successfully authorized', `Account: ${response.authorize?.loginid}`);
      return response;
    } catch (error) {
      this.logEvent('error', 'api', 'Authorization failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getAccountBalance(): Promise<any> {
    if (!this.isConnected || !this.api) {
      throw new Error('Not connected to Deriv API');
    }

    try {
      const response = await this.api.balance();
      this.logEvent('info', 'trading', 'Balance retrieved', `Balance: ${response.balance?.balance} ${response.balance?.currency}`);
      return response;
    } catch (error) {
      this.logEvent('error', 'api', 'Failed to get balance', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getActiveSymbols(): Promise<any> {
    if (!this.isConnected || !this.api) {
      throw new Error('Not connected to Deriv API');
    }

    try {
      const response = await this.api.activeSymbols('brief');
      this.logEvent('info', 'api', 'Active symbols retrieved', `Found ${response.active_symbols?.length} symbols`);
      return response;
    } catch (error) {
      this.logEvent('error', 'api', 'Failed to get active symbols', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async subscribeTicks(symbol: string, callback: (data: any) => void): Promise<void> {
    if (!this.isConnected || !this.api) {
      throw new Error('Not connected to Deriv API');
    }

    try {
      const tickStream = await this.api.subscribe({ ticks: symbol });
      
      tickStream.onmessage = (data: any) => {
        if (data.tick) {
          callback(data.tick);
          this.logEvent('info', 'trading', `Tick received for ${symbol}`, `Price: ${data.tick.quote}`);
        }
      };

      this.subscribers.set(symbol, callback);
      this.logEvent('success', 'api', `Subscribed to ticks for ${symbol}`, 'Tick stream started');
    } catch (error) {
      this.logEvent('error', 'api', `Failed to subscribe to ${symbol}`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async unsubscribeTicks(symbol: string): Promise<void> {
    if (!this.isConnected || !this.api) {
      return;
    }

    try {
      await this.api.unsubscribe({ forget_all: 'ticks' });
      this.subscribers.delete(symbol);
      this.logEvent('info', 'api', `Unsubscribed from ${symbol}`, 'Tick stream stopped');
    } catch (error) {
      this.logEvent('warning', 'api', `Failed to unsubscribe from ${symbol}`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async placeTrade(params: TradeParams): Promise<any> {
    if (!this.isConnected || !this.api) {
      throw new Error('Not connected to Deriv API');
    }

    try {
      const buyRequest = {
        buy: 1,
        parameters: {
          contract_type: params.prediction === 'CALL' ? 'CALL' : 'PUT',
          symbol: params.symbol,
          amount: params.amount,
          duration: params.duration,
          duration_unit: params.durationType.charAt(0).toLowerCase(), // 's', 'm', 'h'
          basis: 'stake'
        }
      };

      const response = await this.api.buy(buyRequest);
      
      if (response.buy) {
        this.logEvent('success', 'trading', 'Trade placed successfully', 
          `Contract: ${response.buy.contract_id}, Amount: ${params.amount}`);
      }
      
      return response;
    } catch (error) {
      this.logEvent('error', 'trading', 'Failed to place trade', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getContractStatus(contractId: string): Promise<any> {
    if (!this.isConnected || !this.api) {
      throw new Error('Not connected to Deriv API');
    }

    try {
      const response = await this.api.proposalOpenContract({ contract_id: contractId });
      return response;
    } catch (error) {
      this.logEvent('error', 'api', 'Failed to get contract status', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getServerStatus(): Promise<any> {
    if (!this.isConnected || !this.api) {
      throw new Error('Not connected to Deriv API');
    }

    try {
      const response = await this.api.websiteStatus();
      return response;
    } catch (error) {
      this.logEvent('error', 'api', 'Failed to get server status', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private logEvent(type: 'info' | 'warning' | 'error' | 'success', category: 'trading' | 'system' | 'api' | 'strategy', message: string, details?: string) {
    // This would integrate with your logging system
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type,
      category,
      message,
      details
    };

    // Emit to event system or store in local storage for LogsMonitor component
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('derivApiLog', { detail: logEntry });
      window.dispatchEvent(event);
    }

    console.log(`[${type.toUpperCase()}] ${category}: ${message}`, details || '');
  }

  // Getter for connection status
  get connected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const derivApi = new DerivApiService();
export default derivApi;