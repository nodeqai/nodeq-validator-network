import React, { useState, useEffect } from 'react';
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
  BookOpen,
  Code,
  Command,
  Info,
  BarChart3,
  Gauge,
  Users,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock as ClockIcon,
  Calendar,
  Target,
  Award,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import ValidatorControl from './ValidatorControl';
import ValidatorCommands from '../components/ValidatorCommands';
import ValidatorTerminal from '../components/ValidatorTerminal';
import ValidatorConnectionModal from '../components/ValidatorConnectionModal';

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

interface ValidatorMetrics {
  totalNodes: number;
  activeNodes: number;
  totalStake: number;
  totalRewards: number;
  averageAPY: number;
  uptime: number;
  networkParticipation: number;
  blocksProposed: number;
  blocksMissed: number;
  successRate: number;
}

const ValidatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'control' | 'commands' | 'terminal'>('overview');
  const [selectedNode, setSelectedNode] = useState<DeployedNode | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectedNode, setConnectedNode] = useState<DeployedNode | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const [metrics, setMetrics] = useState<ValidatorMetrics>({
    totalNodes: 12,
    activeNodes: 10,
    totalStake: 384,
    totalRewards: 2.45,
    averageAPY: 5.2,
    uptime: 99.8,
    networkParticipation: 100,
    blocksProposed: 8640,
    blocksMissed: 12,
    successRate: 99.86
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpu: 45,
    memory: 62,
    storage: 35,
    networkIn: 75,
    networkOut: 45,
    uptime: '15d 7h 32m',
    peers: 25,
    syncStatus: 'synced'
  });

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() > 0.5 ? 1 : -1))),
        memory: Math.max(30, Math.min(70, prev.memory + (Math.random() > 0.5 ? 1 : -1))),
        storage: Math.max(25, Math.min(45, prev.storage + (Math.random() > 0.7 ? 1 : -1))),
        networkIn: Math.floor(Math.random() * 100) + 50,
        networkOut: Math.floor(Math.random() * 100) + 30,
        uptime: prev.uptime, // This would be calculated based on actual uptime
        peers: Math.floor(Math.random() * 50) + 20,
        syncStatus: Math.random() > 0.1 ? 'synced' : 'syncing'
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = (node: DeployedNode, connectionConfig: any) => {
    setConnectedNode(node);
    setIsConnected(true);
    setActiveTab('control');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectedNode(null);
    setActiveTab('overview');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'control', name: 'Node Control', icon: Server, disabled: !isConnected },
    { id: 'commands', name: 'Commands', icon: BookOpen },
    { id: 'terminal', name: 'Terminal', icon: Terminal, disabled: !isConnected }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#232427] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Nodes</p>
              <p className="text-2xl font-bold">{metrics.totalNodes}</p>
            </div>
            <Server className="w-8 h-8 text-[#C7FF00]" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">{metrics.activeNodes} Active</span>
          </div>
        </div>

        <div className="bg-[#232427] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Stake</p>
              <p className="text-2xl font-bold">{metrics.totalStake} ETH</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">+{metrics.totalRewards} ETH Rewards</span>
          </div>
        </div>

        <div className="bg-[#232427] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average APY</p>
              <p className="text-2xl font-bold">{metrics.averageAPY}%</p>
            </div>
            <Percent className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <ArrowUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">+0.2% from last week</span>
          </div>
        </div>

        <div className="bg-[#232427] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-2xl font-bold">{metrics.successRate}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">{metrics.blocksProposed} Blocks</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#232427] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C7FF00]" />
            Real-time Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">CPU Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#C7FF00] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${realTimeMetrics.cpu}%` }}
                  ></div>
                </div>
                <span className="text-sm font-mono">{realTimeMetrics.cpu}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Memory Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${realTimeMetrics.memory}%` }}
                  ></div>
                </div>
                <span className="text-sm font-mono">{realTimeMetrics.memory}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${realTimeMetrics.storage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-mono">{realTimeMetrics.storage}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Network Activity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3 text-green-400" />
                  <span className="text-xs">{realTimeMetrics.networkIn} MB/s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Upload className="w-3 h-3 text-blue-400" />
                  <span className="text-xs">{realTimeMetrics.networkOut} MB/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#232427] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C7FF00]" />
            Network Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sync Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  realTimeMetrics.syncStatus === 'synced' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
                }`}></div>
                <span className="text-sm capitalize">{realTimeMetrics.syncStatus}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Connected Peers</span>
              <span className="text-sm font-mono">{realTimeMetrics.peers}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-mono">{realTimeMetrics.uptime}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Network Participation</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#232427] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-[#C7FF00]" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { time: '2 minutes ago', event: 'Block proposed successfully', type: 'success' },
            { time: '5 minutes ago', event: 'Validator service restarted', type: 'info' },
            { time: '12 minutes ago', event: 'New peer connected', type: 'success' },
            { time: '18 minutes ago', event: 'System update completed', type: 'info' },
            { time: '25 minutes ago', event: 'Backup created successfully', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#1A1B1D] rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm">{activity.event}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#232427] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowConnectionModal(true)}
            className="p-4 bg-[#1A1B1D] rounded-lg hover:bg-[#2A2B2E] transition-colors text-center"
          >
            <Server className="w-6 h-6 mx-auto mb-2 text-[#C7FF00]" />
            <span className="text-sm">Connect to Node</span>
          </button>
          
          <button
            onClick={() => setActiveTab('commands')}
            className="p-4 bg-[#1A1B1D] rounded-lg hover:bg-[#2A2B2E] transition-colors text-center"
          >
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-[#C7FF00]" />
            <span className="text-sm">View Commands</span>
          </button>
          
          <button
            onClick={() => setActiveTab('terminal')}
            disabled={!isConnected}
            className="p-4 bg-[#1A1B1D] rounded-lg hover:bg-[#2A2B2E] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Terminal className="w-6 h-6 mx-auto mb-2 text-[#C7FF00]" />
            <span className="text-sm">Open Terminal</span>
          </button>
          
          <button
            className="p-4 bg-[#1A1B1D] rounded-lg hover:bg-[#2A2B2E] transition-colors text-center"
          >
            <Settings className="w-6 h-6 mx-auto mb-2 text-[#C7FF00]" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#18191B] text-white">
      {/* Header */}
      <div className="bg-[#202124] border-b border-[#232427] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#C7FF00]/20 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-[#C7FF00]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Validator Dashboard</h1>
              <p className="text-gray-400 text-sm">
                {isConnected && connectedNode 
                  ? `Connected to ${connectedNode.name} (${connectedNode.ipAddress})`
                  : 'Manage your validator nodes'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isConnected && (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            )}
            
            <button
              onClick={() => setShowConnectionModal(true)}
              className="px-4 py-2 bg-[#C7FF00] text-black rounded-lg hover:bg-[#C7FF00]/90 transition-colors font-semibold"
            >
              Connect Node
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#202124] border-b border-[#232427] px-4">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              disabled={tab.disabled}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#C7FF00] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#232427]'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'control' && isConnected && <ValidatorControl />}
        {activeTab === 'commands' && <ValidatorCommands />}
        {activeTab === 'terminal' && isConnected && <ValidatorTerminal />}
      </div>

      {/* Connection Modal */}
      <ValidatorConnectionModal
        open={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConnect={handleConnect}
        node={selectedNode}
      />
    </div>
  );
};

export default ValidatorDashboard; 