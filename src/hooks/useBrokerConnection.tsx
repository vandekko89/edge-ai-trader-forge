import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface BrokerConfig {
  name: string;
  apiKey?: string;
  secret?: string;
  appId?: string;
  token?: string;
  email?: string;
  password?: string;
  login?: string;
  server?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  broker: string;
  balance?: number;
  error?: string;
  lastUpdate?: Date;
}

export const useBrokerConnection = () => {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    broker: 'Nenhuma'
  });

  const [brokerConfig, setBrokerConfig] = useState<BrokerConfig>({
    name: 'bybit'
  });

  // Simulação de conexão (substitua pela lógica real da API)
  const connectToBroker = async (config: BrokerConfig) => {
    try {
      setConnectionStatus(prev => ({ ...prev, isConnected: false, error: undefined }));
      
      // Simular delay de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validação básica
      if (config.name === 'bybit' && (!config.apiKey || !config.secret)) {
        throw new Error('API Key e Secret são obrigatórios para Bybit');
      }
      
      if (config.name === 'deriv' && (!config.appId || !config.token)) {
        throw new Error('App ID e Token são obrigatórios para Deriv');
      }

      if (config.name === 'iqoption' && (!config.email || !config.password)) {
        throw new Error('Email e senha são obrigatórios para IQ Option');
      }

      // Simular sucesso na conexão
      const mockBalance = Math.random() * 10000 + 1000;
      
      setConnectionStatus({
        isConnected: true,
        broker: getBrokerDisplayName(config.name),
        balance: mockBalance,
        lastUpdate: new Date()
      });

      setBrokerConfig(config);
      
      // Salvar no localStorage
      localStorage.setItem('broker_config', JSON.stringify(config));
      localStorage.setItem('connection_status', JSON.stringify({
        isConnected: true,
        broker: getBrokerDisplayName(config.name),
        balance: mockBalance
      }));

      toast({
        title: "Conexão Estabelecida",
        description: `Conectado com sucesso à ${getBrokerDisplayName(config.name)}`,
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido na conexão';
      
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: false,
        error: errorMessage
      }));

      toast({
        title: "Erro na Conexão",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const disconnectBroker = () => {
    setConnectionStatus({
      isConnected: false,
      broker: 'Nenhuma'
    });
    
    localStorage.removeItem('broker_config');
    localStorage.removeItem('connection_status');
    
    toast({
      title: "Desconectado",
      description: "Conexão com a corretora foi encerrada",
    });
  };

  const getBrokerDisplayName = (brokerName: string): string => {
    const names: Record<string, string> = {
      'bybit': 'Bybit',
      'binance': 'Binance', 
      'deriv': 'Deriv',
      'iqoption': 'IQ Option',
      'metatrader': 'MetaTrader'
    };
    return names[brokerName] || brokerName;
  };

  // Carregar configuração salva ao inicializar
  useEffect(() => {
    const savedConfig = localStorage.getItem('broker_config');
    const savedStatus = localStorage.getItem('connection_status');
    
    if (savedConfig && savedStatus) {
      try {
        setBrokerConfig(JSON.parse(savedConfig));
        setConnectionStatus(JSON.parse(savedStatus));
      } catch (error) {
        console.error('Erro ao carregar configurações salvas:', error);
      }
    }
  }, []);

  return {
    connectionStatus,
    brokerConfig,
    connectToBroker,
    disconnectBroker,
    getBrokerDisplayName
  };
};