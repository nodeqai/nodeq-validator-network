import React, { useState } from 'react';
import { 
  X, 
  Server, 
  Key, 
  Eye, 
  EyeOff, 
  Wifi, 
  WifiOff, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Terminal,
  Database,
  Settings,
  Lock,
  Unlock
} from 'lucide-react';

interface DeployedNode {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'error' | 'stopped';
  ipAddress: string;
  createdAt: Date;
  chain: string;
  region: string;
  specs: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

interface ValidatorConnectionModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: (node: DeployedNode, connectionConfig: ConnectionConfig) => void;
  node: DeployedNode | null;
}

interface ConnectionConfig {
  method: 'ssh' | 'api' | 'rpc';
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  apiKey?: string;
  useSSL: boolean;
  timeout: number;
}

const ValidatorConnectionModal: React.FC<ValidatorConnectionModalProps> = ({
  open,
  onClose,
  onConnect,
  node
}) => {
  const [connectionMethod, setConnectionMethod] = useState<'ssh' | 'api' | 'rpc'>('ssh');
  const [showPassword, setShowPassword] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const [config, setConfig] = useState<ConnectionConfig>({
    method: 'ssh',
    host: node?.ipAddress || '',
    port: 22,
    username: 'root',
    password: '',
    privateKey: '',
    apiKey: '',
    useSSL: true,
    timeout: 30
  });

  const handleConnect = async () => {
    if (!node) return;
    
    setIsConnecting(true);
    setConnectionStatus('testing');
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate connection success/failure
    const success = Math.random() > 0.2;
    setConnectionStatus(success ? 'success' : 'error');
    
    if (success) {
      setTimeout(() => {
        onConnect(node, config);
        onClose();
      }, 1000);
    }
    
    setIsConnecting(false);
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.3;
    setConnectionStatus(success ? 'success' : 'error');
  };

  const generateSSHKey = () => {
    const key = `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC${Math.random().toString(36).substring(2, 50)}`;
    setConfig(prev => ({ ...prev, privateKey: key }));
  };

  if (!open || !node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#202124] border border-[#232427] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#232427]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C7FF00]/20 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-[#C7FF00]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Connect to Validator</h2>
              <p className="text-gray-400 text-sm">{node.name} • {node.ipAddress}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#232427] rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Connection Method Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connection Method</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'ssh', name: 'SSH', icon: Terminal, description: 'Secure shell access' },
                { id: 'api', name: 'API', icon: Database, description: 'REST API access' },
                { id: 'rpc', name: 'RPC', icon: Settings, description: 'JSON-RPC access' }
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => {
                    setConnectionMethod(method.id as any);
                    setConfig(prev => ({ 
                      ...prev, 
                      method: method.id as any,
                      port: method.id === 'ssh' ? 22 : method.id === 'api' ? 8080 : 8545
                    }));
                  }}
                  className={`p-4 rounded-lg border transition-all ${
                    connectionMethod === method.id
                      ? 'border-[#C7FF00] bg-[#C7FF00]/10'
                      : 'border-[#232427] hover:border-[#2A2B2E]'
                  }`}
                >
                  <method.icon className="w-6 h-6 mb-2 text-[#C7FF00]" />
                  <div className="text-sm font-semibold">{method.name}</div>
                  <div className="text-xs text-gray-400">{method.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Connection Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connection Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Host/IP Address</label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                  className="w-full bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 text-sm"
                  placeholder="192.168.1.100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Port</label>
                <input
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                  className="w-full bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 text-sm"
                  placeholder="22"
                />
              </div>
            </div>

            {connectionMethod === 'ssh' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={config.username}
                    onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 text-sm"
                    placeholder="root"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="password-auth"
                      checked={!config.privateKey}
                      onChange={() => setConfig(prev => ({ ...prev, privateKey: '' }))}
                      className="text-[#C7FF00]"
                    />
                    <label htmlFor="password-auth" className="text-sm">Password Authentication</label>
                  </div>
                  
                  {!config.privateKey && (
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={config.password}
                          onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 pr-10 text-sm"
                          placeholder="Enter password"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="key-auth"
                      checked={!!config.privateKey}
                      onChange={() => setConfig(prev => ({ ...prev, password: '' }))}
                      className="text-[#C7FF00]"
                    />
                    <label htmlFor="key-auth" className="text-sm">SSH Key Authentication</label>
                  </div>
                  
                  {config.privateKey && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Private Key</label>
                        <button
                          onClick={generateSSHKey}
                          className="text-xs text-[#C7FF00] hover:underline"
                        >
                          Generate Key
                        </button>
                      </div>
                      <div className="relative">
                        <textarea
                          value={config.privateKey}
                          onChange={(e) => setConfig(prev => ({ ...prev, privateKey: e.target.value }))}
                          className="w-full bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 text-sm font-mono"
                          rows={4}
                          placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
                        />
                        <button
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="absolute top-2 right-2"
                        >
                          {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {connectionMethod === 'api' && (
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="w-full bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter API key"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="use-ssl"
                  checked={config.useSSL}
                  onChange={(e) => setConfig(prev => ({ ...prev, useSSL: e.target.checked }))}
                  className="text-[#C7FF00]"
                />
                <label htmlFor="use-ssl" className="text-sm">Use SSL/TLS</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Timeout (seconds)</label>
                <input
                  type="number"
                  value={config.timeout}
                  onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                  className="w-20 bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 text-sm"
                  min="5"
                  max="300"
                />
              </div>
            </div>
          </div>

          {/* Connection Status */}
          {connectionStatus !== 'idle' && (
            <div className={`p-4 rounded-lg border ${
              connectionStatus === 'success' 
                ? 'border-green-500 bg-green-500/10' 
                : connectionStatus === 'error'
                ? 'border-red-500 bg-red-500/10'
                : 'border-yellow-500 bg-yellow-500/10'
            }`}>
              <div className="flex items-center gap-2">
                {connectionStatus === 'testing' && <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />}
                {connectionStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                {connectionStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                <span className="text-sm font-medium">
                  {connectionStatus === 'testing' && 'Testing connection...'}
                  {connectionStatus === 'success' && 'Connection successful!'}
                  {connectionStatus === 'error' && 'Connection failed. Please check your settings.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#232427] bg-[#232427]/50">
          <button
            onClick={testConnection}
            disabled={isConnecting}
            className="px-4 py-2 bg-[#232427] text-white rounded-lg hover:bg-[#2A2B2E] transition-colors disabled:opacity-50"
          >
            Test Connection
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#232427] text-white rounded-lg hover:bg-[#2A2B2E] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={isConnecting || !config.host}
              className="px-6 py-2 bg-[#C7FF00] text-black rounded-lg hover:bg-[#C7FF00]/90 transition-colors disabled:opacity-50 font-semibold"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorConnectionModal; 