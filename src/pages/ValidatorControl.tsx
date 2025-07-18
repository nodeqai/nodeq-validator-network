import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Server, 
  Activity, 
  HardDrive, 
  Clock, 
  Zap, 
  Shield, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Database,
  Network,
  Cpu,
  Memory,
  HardDrive as StorageIcon,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Power,
  PowerOff,
  LogOut,
  Key,
  Lock,
  Unlock,
  Trash2
} from 'lucide-react';
import { DeployedNode } from '../contexts/NodeContext';

interface ValidatorCommand {
  id: string;
  name: string;
  description: string;
  command: string;
  category: 'system' | 'validator' | 'monitoring' | 'security' | 'maintenance';
  requiresConfirmation: boolean;
  icon: React.ComponentType<any>;
}

interface CommandResult {
  id: string;
  command: string;
  output: string;
  status: 'success' | 'error' | 'running';
  timestamp: Date;
  executionTime?: number;
}

const VALIDATOR_COMMANDS: ValidatorCommand[] = [
  // System Commands
  {
    id: 'system-status',
    name: 'System Status',
    description: 'Check overall system health and status',
    command: 'systemctl status',
    category: 'system',
    requiresConfirmation: false,
    icon: Activity
  },
  {
    id: 'restart-validator',
    name: 'Restart Validator',
    description: 'Restart the validator service',
    command: 'sudo systemctl restart validator',
    category: 'system',
    requiresConfirmation: true,
    icon: RotateCcw
  },
  {
    id: 'update-system',
    name: 'Update System',
    description: 'Update system packages and security patches',
    command: 'sudo apt update && sudo apt upgrade -y',
    category: 'system',
    requiresConfirmation: true,
    icon: Download
  },
  {
    id: 'check-disk',
    name: 'Check Disk Usage',
    description: 'Check disk space and usage',
    command: 'df -h',
    category: 'system',
    requiresConfirmation: false,
    icon: HardDrive
  },

  // Validator Commands
  {
    id: 'validator-status',
    name: 'Validator Status',
    description: 'Check validator node status and sync',
    command: 'validator-cli status',
    category: 'validator',
    requiresConfirmation: false,
    icon: Server
  },
  {
    id: 'validator-logs',
    name: 'View Logs',
    description: 'View recent validator logs',
    command: 'tail -n 100 /var/log/validator.log',
    category: 'validator',
    requiresConfirmation: false,
    icon: Eye
  },
  {
    id: 'validator-config',
    name: 'Show Config',
    description: 'Display current validator configuration',
    command: 'cat /etc/validator/config.yaml',
    category: 'validator',
    requiresConfirmation: false,
    icon: Settings
  },
  {
    id: 'validator-keys',
    name: 'List Keys',
    description: 'List validator keys and addresses',
    command: 'validator-cli keys list',
    category: 'validator',
    requiresConfirmation: false,
    icon: Key
  },

  // Monitoring Commands
  {
    id: 'monitor-resources',
    name: 'Resource Monitor',
    description: 'Real-time resource usage monitoring',
    command: 'htop',
    category: 'monitoring',
    requiresConfirmation: false,
    icon: Cpu
  },
  {
    id: 'network-status',
    name: 'Network Status',
    description: 'Check network connectivity and peers',
    command: 'netstat -tulpn',
    category: 'monitoring',
    requiresConfirmation: false,
    icon: Network
  },
  {
    id: 'validator-metrics',
    name: 'Validator Metrics',
    description: 'Get detailed validator performance metrics',
    command: 'validator-cli metrics',
    category: 'monitoring',
    requiresConfirmation: false,
    icon: TrendingUp
  },

  // Security Commands
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Run security audit and vulnerability scan',
    command: 'sudo lynis audit system',
    category: 'security',
    requiresConfirmation: true,
    icon: Shield
  },
  {
    id: 'firewall-status',
    name: 'Firewall Status',
    description: 'Check firewall rules and status',
    command: 'sudo ufw status verbose',
    category: 'security',
    requiresConfirmation: false,
    icon: Lock
  },
  {
    id: 'ssl-cert-check',
    name: 'SSL Certificate Check',
    description: 'Check SSL certificate validity',
    command: 'openssl x509 -in /etc/ssl/certs/validator.crt -text -noout',
    category: 'security',
    requiresConfirmation: false,
    icon: Shield
  },

  // Maintenance Commands
  {
    id: 'backup-validator',
    name: 'Backup Validator',
    description: 'Create backup of validator data',
    command: 'tar -czf /backup/validator-$(date +%Y%m%d).tar.gz /var/lib/validator',
    category: 'maintenance',
    requiresConfirmation: true,
    icon: Upload
  },
  {
    id: 'clean-logs',
    name: 'Clean Logs',
    description: 'Clean old log files to free space',
    command: 'sudo journalctl --vacuum-time=7d',
    category: 'maintenance',
    requiresConfirmation: true,
    icon: Trash2
  },
  {
    id: 'optimize-database',
    name: 'Optimize Database',
    description: 'Optimize validator database performance',
    command: 'validator-cli db optimize',
    category: 'maintenance',
    requiresConfirmation: true,
    icon: Database
  }
];

const ValidatorControl = () => {
  const [selectedNode, setSelectedNode] = useState<DeployedNode | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [commandResults, setCommandResults] = useState<CommandResult[]>([]);
  const [executingCommand, setExecutingCommand] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpu: 0,
    memory: 0,
    storage: 0,
    networkIn: 0,
    networkOut: 0,
    uptime: '0d 0h 0m',
    peers: 0,
    syncStatus: 'syncing'
  });

  // Simulate connection to validator node
  const connectToNode = async (node: DeployedNode) => {
    setConnectionStatus('connecting');
    setSelectedNode(node);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (node.status === 'active') {
      setIsConnected(true);
      setConnectionStatus('connected');
      startRealTimeMonitoring();
    } else {
      setConnectionStatus('error');
      setIsConnected(false);
    }
  };

  // Real-time monitoring simulation
  const startRealTimeMonitoring = () => {
    const interval = setInterval(() => {
      if (isConnected && selectedNode) {
        setRealTimeMetrics(prev => ({
          cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() > 0.5 ? 1 : -1))),
          memory: Math.max(30, Math.min(70, prev.memory + (Math.random() > 0.5 ? 1 : -1))),
          storage: Math.max(25, Math.min(45, prev.storage + (Math.random() > 0.7 ? 1 : -1))),
          networkIn: Math.floor(Math.random() * 100) + 50,
          networkOut: Math.floor(Math.random() * 100) + 30,
          uptime: calculateUptime(selectedNode.createdAt),
          peers: Math.floor(Math.random() * 50) + 20,
          syncStatus: Math.random() > 0.1 ? 'synced' : 'syncing'
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const calculateUptime = (createdAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Execute command
  const executeCommand = async (command: ValidatorCommand) => {
    if (!isConnected) return;

    setExecutingCommand(command.id);
    
    // Simulate command execution
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const result: CommandResult = {
      id: Date.now().toString(),
      command: command.command,
      output: generateCommandOutput(command),
      status: Math.random() > 0.1 ? 'success' : 'error',
      timestamp: new Date(),
      executionTime: Date.now() - startTime
    };

    setCommandResults(prev => [result, ...prev.slice(0, 9)]);
    setExecutingCommand(null);
  };

  // Generate realistic command output
  const generateCommandOutput = (command: ValidatorCommand): string => {
    const outputs: { [key: string]: string } = {
      'system-status': `● validator.service - Validator Node Service
   Loaded: loaded (/etc/systemd/system/validator.service; enabled)
   Active: active (running) since ${new Date().toLocaleString()}
   Main PID: 1234 (validator)
   Tasks: 15 (limit: 4915)
   Memory: 256.0M
   CGroup: /system.slice/validator.service
           └─1234 /usr/bin/validator --config=/etc/validator/config.yaml

Jan 15 10:30:15 node-001 validator[1234]: INFO: Validator started successfully
Jan 15 10:30:16 node-001 validator[1234]: INFO: Connected to network peers: 25
Jan 15 10:30:17 node-001 validator[1234]: INFO: Syncing blockchain data...`,
      
      'validator-status': `Validator Node Status
====================
Status: Active
Sync Status: Synced
Block Height: 1,234,567
Latest Block: 0x1234...abcd
Peers Connected: 25
Uptime: 15d 7h 32m
Stake Amount: 32 ETH
Rewards Earned: 0.045 ETH
APY: 5.2%`,
      
      'check-disk': `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       100G   45G   50G  47% /
/dev/sdb1       500G  120G  355G  25% /var/lib/validator
tmpfs           8.0G     0  8.0G   0% /dev/shm`,
      
      'network-status': `Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd
tcp        0      0 0.0.0.0:30303           0.0.0.0:*               LISTEN      1234/validator
tcp        0      0 0.0.0.0:8545            0.0.0.0:*               LISTEN      1234/validator
tcp        0      0 10.0.0.5:30303          10.0.0.10:45678         ESTABLISHED 1234/validator`
    };

    return outputs[command.id] || `Command executed successfully: ${command.command}`;
  };

  // Terminal command execution
  const executeTerminalCommand = async (command: string) => {
    if (!command.trim()) return;

    setTerminalHistory(prev => [...prev, `$ ${command}`]);
    setTerminalInput('');

    // Simulate command execution
    const output = generateTerminalOutput(command);
    setTerminalHistory(prev => [...prev, output]);
  };

  const generateTerminalOutput = (command: string): string => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('ls')) return 'config.yaml  data/  logs/  keys/  validator';
    if (cmd.includes('ps')) return 'PID TTY TIME CMD\n1234 pts/0 00:00:00 validator\n1235 pts/0 00:00:00 sshd';
    if (cmd.includes('top')) return 'top - 10:30:15 up 15 days, 7:32, 1 user, load average: 0.52, 0.48, 0.45';
    if (cmd.includes('df')) return 'Filesystem 1K-blocks Used Available Use% Mounted on\n/dev/sda1 104857600 47185920 52428800 47% /';
    
    return `Command not found: ${command}`;
  };

  // Copy command output
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#18191B] text-white">
      {/* Header */}
      <div className="bg-[#202124] border-b border-[#232427] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Terminal className="w-8 h-8 text-[#C7FF00]" />
            <div>
              <h1 className="text-xl font-bold">Validator Control Panel</h1>
              <p className="text-gray-400 text-sm">Manage and monitor your validator nodes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedNode && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#232427] rounded-lg">
                <Server className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{selectedNode.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
            )}
            
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                showTerminal ? 'bg-[#C7FF00] text-black' : 'bg-[#232427] text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Terminal
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Command Categories */}
        <div className="w-80 bg-[#202124] border-r border-[#232427] p-4 overflow-y-auto">
          <div className="space-y-4">
            {['system', 'validator', 'monitoring', 'security', 'maintenance'].map(category => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {category} Commands
                </h3>
                <div className="space-y-1">
                  {VALIDATOR_COMMANDS
                    .filter(cmd => cmd.category === category)
                    .map(command => (
                      <button
                        key={command.id}
                        onClick={() => executeCommand(command)}
                        disabled={!isConnected || executingCommand === command.id}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          executingCommand === command.id
                            ? 'bg-[#C7FF00] text-black'
                            : 'bg-[#232427] hover:bg-[#2A2B2E] text-white'
                        } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <command.icon className="w-4 h-4" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{command.name}</div>
                            <div className="text-xs text-gray-400">{command.description}</div>
                          </div>
                          {command.requiresConfirmation && (
                            <Shield className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Real-time Metrics */}
          <div className="bg-[#202124] border-b border-[#232427] p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">CPU</span>
                </div>
                <div className="text-lg font-semibold">{realTimeMetrics.cpu}%</div>
              </div>
              
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Memory className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Memory</span>
                </div>
                <div className="text-lg font-semibold">{realTimeMetrics.memory}%</div>
              </div>
              
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <StorageIcon className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Storage</span>
                </div>
                <div className="text-lg font-semibold">{realTimeMetrics.storage}%</div>
              </div>
              
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-400">Network</span>
                </div>
                <div className="text-lg font-semibold">{realTimeMetrics.networkIn} MB/s</div>
              </div>
              
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Uptime</span>
                </div>
                <div className="text-lg font-semibold">{realTimeMetrics.uptime}</div>
              </div>
              
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Peers</span>
                </div>
                <div className="text-lg font-semibold">{realTimeMetrics.peers}</div>
              </div>
              
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Sync</span>
                </div>
                <div className="text-lg font-semibold capitalize">{realTimeMetrics.syncStatus}</div>
              </div>
              
              <div className="bg-[#232427] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-[#C7FF00]" />
                  <span className="text-xs text-gray-400">Status</span>
                </div>
                <div className="text-lg font-semibold text-green-400">Active</div>
              </div>
            </div>
          </div>

          {/* Command Results and Terminal */}
          <div className="flex-1 flex">
            {/* Command Results */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Command Results</h3>
                {commandResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Terminal className="w-12 h-12 mx-auto mb-4" />
                    <p>No commands executed yet. Select a command from the sidebar to get started.</p>
                  </div>
                ) : (
                  commandResults.map(result => (
                    <div key={result.id} className="bg-[#232427] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {result.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="font-mono text-sm">{result.command}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                          {result.executionTime && (
                            <span className="text-xs text-gray-400">
                              {result.executionTime}ms
                            </span>
                          )}
                          <button
                            onClick={() => copyToClipboard(result.output)}
                            className="p-1 hover:bg-[#2A2B2E] rounded"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <pre className="bg-[#1A1B1D] p-3 rounded text-sm overflow-x-auto">
                        {result.output}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Terminal */}
            {showTerminal && (
              <div className="w-96 bg-[#1A1B1D] border-l border-[#232427] flex flex-col">
                <div className="bg-[#232427] p-3 border-b border-[#2A2B2E]">
                  <h3 className="text-sm font-semibold">Terminal</h3>
                </div>
                
                <div className="flex-1 p-3 overflow-y-auto">
                  <div className="space-y-2 font-mono text-sm">
                    {terminalHistory.map((line, index) => (
                      <div key={index} className="whitespace-pre-wrap">{line}</div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 border-t border-[#2A2B2E]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C7FF00]">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && executeTerminalCommand(terminalInput)}
                      placeholder="Enter command..."
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorControl; 