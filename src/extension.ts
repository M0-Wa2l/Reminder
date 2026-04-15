import * as vscode from 'vscode';

// ─── الرسالتين اللي هتتبادلا كل 5 دقايق ───────────────────────────────────
const MESSAGES: { text: string; type: 'info'}[] = [
  {
    text: '😌 اطمن على دنيا وسيب البرمجة.. الدنيا مش هتولع',
    type: 'info',
  },
  {
    text: '💪 برمج حلو واوصل.. عشان تكسبها',
    type: 'info',
  },
  {
    text: '💪 كمل يا بطل.. انت قدها',
    type: 'info',
  },
  {
    text: 'اشتغل علي نفسك و شد و قوم اشرب شاي كده حلمك يستاهل',
    type: 'info',
  },
];

const INTERVAL_MS =  5 * 60 * 1000;  // 5 دقايق بالضبط

// ─── State ─────────────────────────────────────────────────────────────────
let reminderTimer: ReturnType<typeof setInterval> | null = null;
let messageIndex = 0;                              // بيتبدل كل مرة بين 0 و 1
let statusBarItem: vscode.StatusBarItem;

// ─── Show the next message ──────────────────────────────────────────────────
function showNextReminder(): void {
  const { text, type } = MESSAGES[messageIndex];

  // بدّل للرسالة التانية المرة الجاية
  messageIndex = (messageIndex + 1) % MESSAGES.length;

  if (type === 'info') {
    vscode.window.showInformationMessage(text);
  } else {
    vscode.window.showInformationMessage(text);
  }
}

// ─── Start ──────────────────────────────────────────────────────────────────
function startReminder(): void {
  if (reminderTimer) {
    clearInterval(reminderTimer);
  }

  messageIndex = 0; // ابدأ من الأول

  reminderTimer = setInterval(() => {
    showNextReminder();
  }, INTERVAL_MS);

  statusBarItem.text  = '$(bell) Reminder: Working';
  statusBarItem.tooltip = 'الريمايندر شغال — كل 5 دقايق';

  vscode.window.showInformationMessage('✅ الريمايندر اشتغل! هتجيلك رسالة كل 5 دقايق 🔔');
}

// ─── Stop ───────────────────────────────────────────────────────────────────
function stopReminder(): void {
  if (reminderTimer) {
    clearInterval(reminderTimer);
    reminderTimer = null;
  }

  statusBarItem.text    = '$(bell-slash) Reminder: Stopped';
  statusBarItem.tooltip = 'الريمايندر واقف — اضغط Start عشان تشغله';

  vscode.window.showInformationMessage('🛑 الريمايندر وقف.');
}

// ─── Activate ───────────────────────────────────────────────────────────────
export function activate(context: vscode.ExtensionContext): void {
  // Status bar
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text    = '$(bell-slash) Reminder: واقف';
  statusBarItem.tooltip = 'الريمايندر واقف';
  statusBarItem.command = 'reminder.start';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('reminder.start', startReminder),
    vscode.commands.registerCommand('reminder.stop',  stopReminder),
  );

  // Start automatically when the extension activates
  startReminder();
}

// ─── Deactivate ─────────────────────────────────────────────────────────────
export function deactivate(): void {
  if (reminderTimer) {
    clearInterval(reminderTimer);
  }
}
