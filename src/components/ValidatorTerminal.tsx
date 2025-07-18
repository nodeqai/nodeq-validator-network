import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Send, 
  RotateCcw, 
  Download, 
  Upload, 
  Settings,
  History,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Trash2,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  status: 'running' | 'success' | 'error';
  timestamp: Date;
  executionTime?: number;
}

interface TerminalHistory {
  command: string;
  timestamp: Date;
}

const ValidatorTerminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/var/lib/validator');
  const [isConnected, setIsConnected] = useState(true);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
      return () => terminal.removeEventListener('click', handleClick);
    }
  }, []);

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    const commandId = Date.now().toString();
    const startTime = Date.now();

    // Add command to history
    const newHistoryItem: TerminalHistory = {
      command,
      timestamp: new Date()
    };
    setHistory(prev => [...prev, newHistoryItem]);
    setHistoryIndex(-1);

    // Add command to terminal
    const newCommand: TerminalCommand = {
      id: commandId,
      command,
      output: '',
      status: 'running',
      timestamp: new Date()
    };

    setCommands(prev => [...prev, newCommand]);

    // Simulate command execution
    const output = await simulateCommandExecution(command);
    const executionTime = Date.now() - startTime;

    // Update command with output
    setCommands(prev => prev.map(cmd => 
      cmd.id === commandId 
        ? { ...cmd, output, status: output.includes('error') ? 'error' : 'success', executionTime }
        : cmd
    ));

    setInput('');
  };

  const simulateCommandExecution = async (command: string): Promise<string> => {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const cmd = command.toLowerCase();
    
    // Common command responses
    if (cmd.includes('pwd')) {
      return currentDirectory;
    }
    
    if (cmd.includes('ls') || cmd.includes('dir')) {
      return `config.yaml
data/
logs/
keys/
validator
backup/
README.md`;
    }
    
    if (cmd.includes('ps aux')) {
      return `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root      1234  2.1  3.2 1234567 256000 ?        Ssl  Jan15   15:30 /usr/bin/validator --config=/etc/validator/config.yaml
root      1235  0.1  0.5  123456  45000 ?        Ss   Jan15    0:15 /usr/sbin/sshd -D
root      1236  0.0  0.3  123456  25000 ?        Ss   Jan15    0:05 /usr/sbin/cron`;
    }
    
    if (cmd.includes('df -h')) {
      return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       100G   45G   50G  47% /
/dev/sdb1       500G  120G  355G  25% /var/lib/validator
tmpfs           8.0G     0  8.0G   0% /dev/shm`;
    }
    
    if (cmd.includes('free -h')) {
      return `              total        used        free      shared  buff/cache   available
Mem:           8.0G        2.5G        4.2G        256M        1.3G        5.1G
Swap:          2.0G          0B        2.0G`;
    }
    
    if (cmd.includes('top') || cmd.includes('htop')) {
      return `top - 10:30:15 up 15 days, 7:32, 1 user, load average: 0.52, 0.48, 0.45
Tasks: 125 total, 1 running, 124 sleeping, 0 stopped, 0 zombie
%Cpu(s):  2.1 us,  0.8 sy,  0.0 ni, 97.0 id,  0.1 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   8192.0 total,   4200.0 free,   2560.0 used,   1432.0 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5400.0 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1234 root      20   0 1234567 256000  45000 S   2.1   3.2  15:30.45 validator
 1235 root      20   0  123456  45000  12000 S   0.1   0.5   0:15.23 sshd`;
    }
    
    if (cmd.includes('netstat') || cmd.includes('ss')) {
      return `Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1235/sshd
tcp        0      0 0.0.0.0:30303           0.0.0.0:*               LISTEN      1234/validator
tcp        0      0 0.0.0.0:8545            0.0.0.0:*               LISTEN      1234/validator
tcp        0      0 10.0.0.5:30303          10.0.0.10:45678         ESTABLISHED 1234/validator`;
    }
    
    if (cmd.includes('systemctl status')) {
      return `● validator.service - Validator Node Service
   Loaded: loaded (/etc/systemd/system/validator.service; enabled)
   Active: active (running) since Mon 2024-01-15 10:30:15 UTC
   Main PID: 1234 (validator)
   Tasks: 15 (limit: 4915)
   Memory: 256.0M
   CGroup: /system.slice/validator.service
           └─1234 /usr/bin/validator --config=/etc/validator/config.yaml

Jan 15 10:30:15 node-001 validator[1234]: INFO: Validator started successfully
Jan 15 10:30:16 node-001 validator[1234]: INFO: Connected to network peers: 25
Jan 15 10:30:17 node-001 validator[1234]: INFO: Syncing blockchain data...`;
    }
    
    if (cmd.includes('validator-cli status')) {
      return `Validator Node Status
====================
Status: Active
Sync Status: Synced
Block Height: 1,234,567
Latest Block: 0x1234...abcd
Peers Connected: 25
Uptime: 15d 7h 32m
Stake Amount: 32 ETH
Rewards Earned: 0.045 ETH
APY: 5.2%`;
    }
    
    if (cmd.includes('clear')) {
      setCommands([]);
      return '';
    }
    
    if (cmd.includes('help')) {
      return `Available Commands:
==================
pwd                    - Show current directory
ls, dir               - List files and directories
ps aux                - Show running processes
df -h                 - Show disk usage
free -h               - Show memory usage
top, htop             - Show system resources
netstat -tulpn        - Show network connections
systemctl status      - Show service status
validator-cli status  - Show validator status
clear                 - Clear terminal
help                  - Show this help
history               - Show command history

Navigation:
- Use arrow keys to navigate command history
- Ctrl+L to clear screen
- Tab for command completion (coming soon)`;
    }
    
    if (cmd.includes('history')) {
      return history.map((item, index) => 
        `${index + 1}  ${item.timestamp.toLocaleTimeString()}  ${item.command}`
      ).join('\n');
    }
    
    // Default response for unknown commands
    if (Math.random() > 0.8) {
      return `Command not found: ${command.split(' ')[0]}
Try 'help' for available commands.`;
    } else {
      return `Command executed: ${command}
Output: This is a simulated response for demonstration purposes.
Timestamp: ${new Date().toLocaleString()}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion (could be enhanced)
      const suggestions = ['ls', 'pwd', 'ps', 'df', 'top', 'netstat', 'systemctl', 'validator-cli'];
      const currentInput = input.toLowerCase();
      const match = suggestions.find(s => s.startsWith(currentInput));
      if (match) {
        setInput(match);
      }
    }
  };

  const clearTerminal = () => {
    setCommands([]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`bg-[#1A1B1D] text-green-400 font-mono ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Terminal Header */}
      <div className="bg-[#232427] border-b border-[#2A2B2E] p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-semibold">Validator Terminal</span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1 hover:bg-[#2A2B2E] rounded"
            title="Command History"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1 hover:bg-[#2A2B2E] rounded"
            title="Clear Terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-[#2A2B2E] rounded"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1 hover:bg-[#2A2B2E] rounded"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex h-[calc(100%-40px)]">
        {/* Main Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Output */}
          <div 
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="space-y-2">
              {commands.map((cmd) => (
                <div key={cmd.id} className="space-y-1">
                  {/* Command Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">$</span>
                    <span>{cmd.command}</span>
                  </div>
                  
                  {/* Command Output */}
                  {cmd.output && (
                    <div className="ml-4">
                      <pre className="whitespace-pre-wrap text-sm">{cmd.output}</pre>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{cmd.timestamp.toLocaleTimeString()}</span>
                        {cmd.executionTime && (
                          <span>Execution time: {cmd.executionTime}ms</span>
                        )}
                        <div className="flex items-center gap-1">
                          {cmd.status === 'running' && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />}
                          {cmd.status === 'success' && <CheckCircle className="w-3 h-3 text-green-400" />}
                          {cmd.status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
                          <span className="capitalize">{cmd.status}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(cmd.output)}
                          className="hover:text-gray-300"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Current Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-blue-400">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-sm"
                  placeholder="Enter command..."
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>

        {/* Command History Sidebar */}
        {showHistory && (
          <div className="w-80 bg-[#232427] border-l border-[#2A2B2E] flex flex-col">
            <div className="p-3 border-b border-[#2A2B2E]">
              <h3 className="text-sm font-semibold">Command History</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {history.slice().reverse().map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(item.command);
                      setHistoryIndex(history.length - 1 - index);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-[#2A2B2E] text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.command}</span>
                      <span className="text-xs text-gray-500">{item.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorTerminal; 