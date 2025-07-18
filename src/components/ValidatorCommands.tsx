import React, { useState } from 'react';
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
  BookOpen,
  Code,
  Command,
  Info
} from 'lucide-react';

interface ValidatorCommand {
  id: string;
  name: string;
  description: string;
  command: string;
  category: 'system' | 'validator' | 'monitoring' | 'security' | 'maintenance' | 'advanced';
  requiresConfirmation: boolean;
  icon: React.ComponentType<any>;
  usage: string;
  examples: string[];
  parameters?: {
    name: string;
    description: string;
    required: boolean;
    type: 'string' | 'number' | 'boolean';
    default?: any;
  }[];
  output?: string;
  risks?: string[];
  tips?: string[];
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
    icon: Activity,
    usage: 'systemctl status [service_name]',
    examples: [
      'systemctl status validator',
      'systemctl status --no-pager',
      'systemctl status -l'
    ],
    output: `● validator.service - Validator Node Service
   Loaded: loaded (/etc/systemd/system/validator.service; enabled)
   Active: active (running) since Mon 2024-01-15 10:30:15 UTC
   Main PID: 1234 (validator)
   Tasks: 15 (limit: 4915)
   Memory: 256.0M
   CGroup: /system.slice/validator.service
           └─1234 /usr/bin/validator --config=/etc/validator/config.yaml`,
    tips: [
      'Use --no-pager for non-interactive output',
      'Add -l flag for full log lines',
      'Check specific services by adding service name'
    ]
  },
  {
    id: 'restart-validator',
    name: 'Restart Validator',
    description: 'Restart the validator service',
    command: 'sudo systemctl restart validator',
    category: 'system',
    requiresConfirmation: true,
    icon: RotateCcw,
    usage: 'sudo systemctl restart [service_name]',
    examples: [
      'sudo systemctl restart validator',
      'sudo systemctl restart validator && systemctl status validator'
    ],
    risks: [
      'Will temporarily stop validator operations',
      'May cause missed block proposals',
      'Ensure you have proper monitoring in place'
    ],
    tips: [
      'Check service status after restart',
      'Monitor logs for any errors',
      'Consider restarting during low-activity periods'
    ]
  },
  {
    id: 'update-system',
    name: 'Update System',
    description: 'Update system packages and security patches',
    command: 'sudo apt update && sudo apt upgrade -y',
    category: 'system',
    requiresConfirmation: true,
    icon: Download,
    usage: 'sudo apt update && sudo apt upgrade [-y]',
    examples: [
      'sudo apt update && sudo apt upgrade -y',
      'sudo apt update && sudo apt upgrade --dry-run',
      'sudo apt list --upgradable'
    ],
    risks: [
      'May require system restart',
      'Could break existing services',
      'Always backup before major updates'
    ],
    tips: [
      'Use --dry-run to preview changes',
      'Update during maintenance windows',
      'Test updates in staging environment first'
    ]
  },

  // Validator Commands
  {
    id: 'validator-status',
    name: 'Validator Status',
    description: 'Check validator node status and sync',
    command: 'validator-cli status',
    category: 'validator',
    requiresConfirmation: false,
    icon: Server,
    usage: 'validator-cli status [options]',
    examples: [
      'validator-cli status',
      'validator-cli status --json',
      'validator-cli status --verbose'
    ],
    parameters: [
      {
        name: '--json',
        description: 'Output in JSON format',
        required: false,
        type: 'boolean'
      },
      {
        name: '--verbose',
        description: 'Show detailed information',
        required: false,
        type: 'boolean'
      }
    ],
    output: `Validator Node Status
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
    tips: [
      'Check sync status regularly',
      'Monitor peer count for network health',
      'Track rewards and APY performance'
    ]
  },
  {
    id: 'validator-logs',
    name: 'View Logs',
    description: 'View recent validator logs',
    command: 'tail -n 100 /var/log/validator.log',
    category: 'validator',
    requiresConfirmation: false,
    icon: Eye,
    usage: 'tail -n [lines] [log_file]',
    examples: [
      'tail -n 100 /var/log/validator.log',
      'tail -f /var/log/validator.log',
      'grep ERROR /var/log/validator.log'
    ],
    parameters: [
      {
        name: '-n',
        description: 'Number of lines to show',
        required: false,
        type: 'number',
        default: 100
      },
      {
        name: '-f',
        description: 'Follow log file in real-time',
        required: false,
        type: 'boolean'
      }
    ],
    tips: [
      'Use -f flag for real-time monitoring',
      'Combine with grep for filtering',
      'Check for ERROR and WARN messages'
    ]
  },
  {
    id: 'validator-config',
    name: 'Show Config',
    description: 'Display current validator configuration',
    command: 'cat /etc/validator/config.yaml',
    category: 'validator',
    requiresConfirmation: false,
    icon: Settings,
    usage: 'cat [config_file]',
    examples: [
      'cat /etc/validator/config.yaml',
      'grep -n "port" /etc/validator/config.yaml',
      'diff config.yaml config.yaml.backup'
    ],
    tips: [
      'Always backup config before changes',
      'Validate YAML syntax before applying',
      'Use diff to compare configurations'
    ]
  },

  // Monitoring Commands
  {
    id: 'monitor-resources',
    name: 'Resource Monitor',
    description: 'Real-time resource usage monitoring',
    command: 'htop',
    category: 'monitoring',
    requiresConfirmation: false,
    icon: Cpu,
    usage: 'htop [options]',
    examples: [
      'htop',
      'htop -d 2',
      'htop -u validator'
    ],
    parameters: [
      {
        name: '-d',
        description: 'Update delay in seconds',
        required: false,
        type: 'number',
        default: 1
      },
      {
        name: '-u',
        description: 'Show only processes for user',
        required: false,
        type: 'string'
      }
    ],
    tips: [
      'Press F1 for help in htop',
      'Use F5 for tree view',
      'Press q to quit'
    ]
  },
  {
    id: 'network-status',
    name: 'Network Status',
    description: 'Check network connectivity and peers',
    command: 'netstat -tulpn',
    category: 'monitoring',
    requiresConfirmation: false,
    icon: Network,
    usage: 'netstat [options]',
    examples: [
      'netstat -tulpn',
      'netstat -i',
      'ss -tulpn'
    ],
    output: `Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd
tcp        0      0 0.0.0.0:30303           0.0.0.0:*               LISTEN      1234/validator
tcp        0      0 0.0.0.0:8545            0.0.0.0:*               LISTEN      1234/validator`,
    tips: [
      'Use ss command for modern systems',
      'Check for open ports and services',
      'Monitor established connections'
    ]
  },

  // Security Commands
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Run security audit and vulnerability scan',
    command: 'sudo lynis audit system',
    category: 'security',
    requiresConfirmation: true,
    icon: Shield,
    usage: 'sudo lynis audit [target]',
    examples: [
      'sudo lynis audit system',
      'sudo lynis audit system --quick',
      'sudo lynis audit system --report-file audit.log'
    ],
    parameters: [
      {
        name: '--quick',
        description: 'Quick audit mode',
        required: false,
        type: 'boolean'
      },
      {
        name: '--report-file',
        description: 'Save report to file',
        required: false,
        type: 'string'
      }
    ],
    risks: [
      'May take significant time to complete',
      'Could generate false positives',
      'Review findings carefully before acting'
    ],
    tips: [
      'Run during low-activity periods',
      'Review and address high-priority findings',
      'Keep audit reports for compliance'
    ]
  },
  {
    id: 'firewall-status',
    name: 'Firewall Status',
    description: 'Check firewall rules and status',
    command: 'sudo ufw status verbose',
    category: 'security',
    requiresConfirmation: false,
    icon: Lock,
    usage: 'sudo ufw status [options]',
    examples: [
      'sudo ufw status verbose',
      'sudo ufw status numbered',
      'sudo iptables -L'
    ],
    output: `Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
30303/tcp                  ALLOW IN    Anywhere
8545/tcp                   ALLOW IN    Anywhere
22/tcp (v6)                ALLOW IN    Anywhere (v6)
30303/tcp (v6)             ALLOW IN    Anywhere (v6)
8545/tcp (v6)              ALLOW IN    Anywhere (v6)`,
    tips: [
      'Regularly review firewall rules',
      'Only allow necessary ports',
      'Monitor for unauthorized access attempts'
    ]
  },

  // Advanced Commands
  {
    id: 'validator-metrics',
    name: 'Validator Metrics',
    description: 'Get detailed validator performance metrics',
    command: 'validator-cli metrics',
    category: 'advanced',
    requiresConfirmation: false,
    icon: TrendingUp,
    usage: 'validator-cli metrics [options]',
    examples: [
      'validator-cli metrics',
      'validator-cli metrics --format=json',
      'validator-cli metrics --period=24h'
    ],
    parameters: [
      {
        name: '--format',
        description: 'Output format (text, json, prometheus)',
        required: false,
        type: 'string',
        default: 'text'
      },
      {
        name: '--period',
        description: 'Time period for metrics',
        required: false,
        type: 'string',
        default: '1h'
      }
    ],
    output: `Validator Metrics (Last 24h)
===============================
Blocks Proposed: 720
Blocks Missed: 2
Success Rate: 99.72%
Average Block Time: 12.1s
Network Participation: 100%
Rewards Earned: 0.045 ETH
Gas Used: 15,234,567
Peers Connected: 25 (avg)`,
    tips: [
      'Monitor success rate closely',
      'Track missed blocks and reasons',
      'Use metrics for performance optimization'
    ]
  },
  {
    id: 'backup-validator',
    name: 'Backup Validator',
    description: 'Create backup of validator data',
    command: 'tar -czf /backup/validator-$(date +%Y%m%d).tar.gz /var/lib/validator',
    category: 'maintenance',
    requiresConfirmation: true,
    icon: Upload,
    usage: 'tar -czf [backup_file] [source_directory]',
    examples: [
      'tar -czf /backup/validator-$(date +%Y%m%d).tar.gz /var/lib/validator',
      'rsync -av /var/lib/validator/ /backup/validator/',
      'tar -czf backup.tar.gz --exclude=*.log /var/lib/validator'
    ],
    risks: [
      'May impact validator performance during backup',
      'Ensure sufficient disk space',
      'Verify backup integrity after creation'
    ],
    tips: [
      'Schedule backups during low-activity periods',
      'Test backup restoration procedures',
      'Store backups in multiple locations'
    ]
  }
];

const ValidatorCommands: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<ValidatorCommand | null>(null);

  const categories = [
    { id: 'all', name: 'All Commands', icon: Command },
    { id: 'system', name: 'System', icon: Settings },
    { id: 'validator', name: 'Validator', icon: Server },
    { id: 'monitoring', name: 'Monitoring', icon: Activity },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'maintenance', name: 'Maintenance', icon: RefreshCw },
    { id: 'advanced', name: 'Advanced', icon: Code }
  ];

  const filteredCommands = VALIDATOR_COMMANDS.filter(cmd => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cmd.command.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
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
            <BookOpen className="w-8 h-8 text-[#C7FF00]" />
            <div>
              <h1 className="text-xl font-bold">Validator Commands Reference</h1>
              <p className="text-gray-400 text-sm">Complete guide to validator node management commands</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Categories */}
        <div className="w-80 bg-[#202124] border-r border-[#232427] p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search commands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#232427] border border-[#2A2B2E] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-[#C7FF00] text-black'
                      : 'bg-[#232427] hover:bg-[#2A2B2E] text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-4 h-4" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Command List */}
          <div className="w-1/2 p-4 overflow-y-auto">
            <div className="space-y-3">
              {filteredCommands.map(command => (
                <div
                  key={command.id}
                  onClick={() => setSelectedCommand(command)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCommand?.id === command.id
                      ? 'border-[#C7FF00] bg-[#C7FF00]/10'
                      : 'border-[#232427] hover:border-[#2A2B2E] bg-[#232427]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <command.icon className="w-5 h-5 text-[#C7FF00]" />
                    <h3 className="font-semibold">{command.name}</h3>
                    {command.requiresConfirmation && (
                      <Shield className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{command.description}</p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs bg-[#1A1B1D] px-2 py-1 rounded">
                      {command.command}
                    </code>
                    <span className="text-xs text-gray-500 capitalize">{command.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Command Details */}
          <div className="w-1/2 p-4 overflow-y-auto border-l border-[#232427]">
            {selectedCommand ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <selectedCommand.icon className="w-8 h-8 text-[#C7FF00]" />
                    <div>
                      <h2 className="text-xl font-bold">{selectedCommand.name}</h2>
                      <p className="text-gray-400">{selectedCommand.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Command</h3>
                    <div className="bg-[#1A1B1D] p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm">{selectedCommand.command}</code>
                        <button
                          onClick={() => copyToClipboard(selectedCommand.command)}
                          className="p-1 hover:bg-[#232427] rounded"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Usage</h3>
                    <code className="bg-[#1A1B1D] p-2 rounded text-sm block">
                      {selectedCommand.usage}
                    </code>
                  </div>

                  {selectedCommand.examples && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Examples</h3>
                      <div className="space-y-2">
                        {selectedCommand.examples.map((example, index) => (
                          <div key={index} className="bg-[#1A1B1D] p-2 rounded">
                            <code className="text-sm">{example}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCommand.parameters && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Parameters</h3>
                      <div className="space-y-2">
                        {selectedCommand.parameters.map(param => (
                          <div key={param.name} className="bg-[#1A1B1D] p-3 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <code className="text-sm font-semibold">{param.name}</code>
                              <span className={`text-xs px-2 py-1 rounded ${
                                param.required ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {param.required ? 'Required' : 'Optional'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-1">{param.description}</p>
                            <div className="text-xs text-gray-500">
                              Type: {param.type}
                              {param.default && ` • Default: ${param.default}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCommand.output && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sample Output</h3>
                      <pre className="bg-[#1A1B1D] p-3 rounded text-sm overflow-x-auto">
                        {selectedCommand.output}
                      </pre>
                    </div>
                  )}

                  {selectedCommand.risks && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        Risks & Warnings
                      </h3>
                      <ul className="space-y-2">
                        {selectedCommand.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCommand.tips && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        Tips & Best Practices
                      </h3>
                      <ul className="space-y-2">
                        {selectedCommand.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4" />
                <p>Select a command from the list to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorCommands; 