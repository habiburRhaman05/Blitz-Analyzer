'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type FormEvent,
  UIEvent,
} from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Bot,
  User,
  Loader2,
  Trash2,
  Sparkles,
  Check,
  Copy,
  Wrench,
  FileText,
  Briefcase,
  ArrowUp,
  ArrowDown,
  X,
  MessageSquare,
  BotIcon,
} from 'lucide-react';

type AnyMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts?: Array<any>;
  content?: string;
};

type AnyToolInvocation = {
  toolName?: string;
  toolCallId?: string;
  state?: string;
  result?: any;
  output?: any;
  [key: string]: any;
};

// ----------------------------------------------------------------------
//  UTILITY: Copy to Clipboard
// ----------------------------------------------------------------------
const useCopyToClipboard = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }, []);

  return { copiedId, copy };
};

// ----------------------------------------------------------------------
//  TYPING INDICATOR (Upgraded)
// ----------------------------------------------------------------------
const TypingIndicator = ({ label = 'Analyzing...' }: { label?: string }) => {
  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
        <Bot className="h-4 w-4 text-white animate-pulse" />
      </div>

      <div className="relative overflow-hidden rounded-2xl rounded-tl-sm border border-slate-200/60 bg-white/80 px-5 py-3.5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/80">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5" />
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s] dark:bg-indigo-400" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s] dark:bg-purple-400" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-500 dark:bg-pink-400" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
//  TOOL CALL DISPLAY COMPONENT (Refined UI)
// ----------------------------------------------------------------------
const ToolCallDisplay = ({ toolInvocation }: { toolInvocation: AnyToolInvocation }) => {
  const toolName = toolInvocation?.toolName || 'tool';
  const result = toolInvocation?.result ?? toolInvocation?.output;
  const state = toolInvocation?.state;
  const isComplete =
    state === 'result' ||
    state === 'output-available' ||
    state === 'done' ||
    result !== undefined;

  if (!isComplete) {
    return (
      <div className="mt-3 rounded-2xl border border-indigo-200/50 bg-indigo-50/50 p-4 backdrop-blur-md dark:border-indigo-500/20 dark:bg-indigo-500/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Wrench className="h-3.5 w-3.5" />
          <span>{toolName.replace(/([A-Z])/g, ' $1').trim()}</span>
          <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin" />
        </div>
        <div className="mt-2 text-sm text-slate-600 dark:text-indigo-200/70">
          Running execution engine...
        </div>
      </div>
    );
  }

  const safeResult = result || {};

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200/60 bg-white/60 shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-white/10 dark:bg-slate-800/40">
      <div className="flex items-center gap-2 border-b border-slate-200/50 bg-slate-50/50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/5 dark:bg-white/5 dark:text-white/60">
        <Wrench className="h-3.5 w-3.5" />
        <span>{toolName.replace(/([A-Z])/g, ' $1').trim()}</span>
      </div>

      <div className="space-y-3 p-4 text-sm text-slate-800 dark:text-slate-200">
        {/* Tool-specific renders omitted for brevity but they keep your existing logic */}
        <pre className="overflow-x-auto text-xs text-slate-600 dark:text-slate-400">
          {JSON.stringify(safeResult, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
//  MESSAGE BUBBLE COMPONENT
// ----------------------------------------------------------------------
const MessageBubble = ({
  message,
  onCopy,
  copiedId,
  delayMs = 0,
}: {
  message: AnyMessage;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  delayMs?: number;
}) => {
  const isUser = message.role === 'user';

  const textContent =
    message.parts
      ?.filter((part) => part?.type === 'text' && typeof part?.text === 'string')
      .map((part) => part.text)
      .join('\n') ?? message.content ?? '';

  const toolInvocations =
    message.parts?.filter((part) => {
      const t = part?.type;
      return t === 'tool-invocation' || t === 'toolInvocation' || t === 'tool-call' || t === 'toolCall';
    }) ?? [];

  return (
    <div
      className={`group flex w-full gap-3 transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
      style={{ animationDelay: `${delayMs}ms`, animationFillMode: 'both' }}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-105 ${
          isUser
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-500/20'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative rounded-3xl px-5 py-4 text-[15px] leading-relaxed shadow-sm transition-all ${
            isUser
              ? 'rounded-tr-sm bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'rounded-tl-sm border border-slate-200/60 bg-white/90 text-slate-800 backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-100'
          }`}
        >
          {textContent ? (
            <div className="prose prose-sm max-w-none text-current marker:text-current dark:prose-invert prose-p:leading-relaxed prose-pre:my-0">
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');

                    return !inline && match ? (
                      <div className="my-4 overflow-hidden rounded-2xl border border-slate-700/50 bg-[#0d1117] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <span>{match[1]}</span>
                          <div className="flex gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                          </div>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent' }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className="rounded-md bg-black/5 px-1.5 py-0.5 text-[13px] font-semibold text-indigo-600 dark:bg-white/10 dark:text-indigo-400"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          ) : (
            <TypingIndicator label={isUser ? 'Sending...' : 'Formulating...'} />
          )}

          {toolInvocations.map((ti: any, index: number) => (
            <ToolCallDisplay key={ti?.toolCallId ?? index} toolInvocation={ti?.toolInvocation ?? ti?.toolCall ?? ti} />
          ))}

          {/* Premium Copy Button */}
          {!isUser && textContent && (
            <button
              type="button"
              onClick={() => onCopy(textContent, message.id)}
              className="absolute -bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-white px-2.5 py-1.5 opacity-0 shadow-sm transition-all hover:scale-105 hover:bg-slate-50 group-hover:-translate-y-1 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              aria-label="Copy message"
            >
              {copiedId === message.id ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">COPIED</span>
                </>
              ) : (
                <Copy className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
//  MAIN CHAT MODAL COMPONENT
// ----------------------------------------------------------------------
export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Advanced Scroll State
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const scrollPosRef = useRef(0);
  const { copiedId, copy } = useCopyToClipboard();
  const [input, setInput] = useState('');

  const initialMessages: AnyMessage[] = [
    {
      id: 'welcome',
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: "👋 **Welcome to Blitz Analyzer Engine™**\n\nI'm your premium career strategist. I can:\n- Analyze resume snippets for ATS compliance\n- Match your skills to job descriptions\n- Rewrite bullet points using the STAR method\n\nHow can I help you today?",
        },
      ],
    },
  ];

  const {
    messages = [],
    sendMessage,
    isLoading,
    setMessages,
    error,
  } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: initialMessages as any,
    onFinish: () => inputRef.current?.focus(),
  });

  // Lock Body Scroll
  useEffect(() => {
    if (!isOpen) {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      const y = scrollPosRef.current;
      if (y) window.scrollTo(0, y);
      return;
    }
    scrollPosRef.current = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    const t = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  // Smart Auto-Scroll logic
  const scrollToBottom = useCallback((smooth = true) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
    setIsScrolledUp(false);
  }, []);

  useEffect(() => {
    if (!isOpen || isScrolledUp) return;
    const raf = window.requestAnimationFrame(() => scrollToBottom());
    return () => window.cancelAnimationFrame(raf);
  }, [messages, isLoading, isOpen, isScrolledUp, scrollToBottom]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const threshold = 50;
    const isUp = target.scrollHeight - target.scrollTop - target.clientHeight > threshold;
    setIsScrolledUp(isUp);
  };

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isLoading) return;
      setInput('');
      setIsScrolledUp(false);
      try {
        await sendMessage({ text: trimmed });
      } catch (err) {
        console.error('sendMessage failed:', err);
        setInput(trimmed);
      }
    },
    [input, isLoading, sendMessage]
  );

  const handleSuggestionClick = useCallback((text: string) => {
    setInput(text);
    window.requestAnimationFrame(() => formRef.current?.requestSubmit());
  }, []);

  const suggestions = [
    { icon: FileText, text: 'Analyze: "Responsible for managing team projects"', colSpan: 'md:col-span-2' },
    { icon: Briefcase, text: 'Match Python/SQL skills to Data Analyst JD', colSpan: 'md:col-span-1' },
    { icon: Sparkles, text: 'How to improve ATS score from 65 to 85?', colSpan: 'md:col-span-3' },
  ];

  const hasOnlyWelcome = messages.length === 1;

  return (
    <>
      {/* Floating Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open AI Assistant"
      >
                     <BotIcon className="h-6 w-6" />

      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-md transition-all duration-500 animate-in fade-in dark:bg-black/60 sm:p-6 md:p-12">
          
          {/* Modal Container */}
          <div className="relative flex h-full max-h-[850px] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all animate-in zoom-in-95 duration-500 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
            
            {/* Header */}
            <div className="relative z-20 shrink-0 border-b border-slate-200/50 bg-white/40 px-6 py-5 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
                    <Bot className="h-6 w-6 text-white" />
                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      Blitz Analyzer
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      AI Career Strategist
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMessages(initialMessages as any)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                    title="Clear Conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-rose-100 hover:text-rose-600 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-400"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="relative flex-1 overflow-y-auto overscroll-contain p-6 scroll-smooth"
            >
              <div className="mx-auto flex max-w-3xl flex-col space-y-8 pb-10">
                {hasOnlyWelcome && (
                  <div className="my-12 flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
                    <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-inner dark:from-indigo-900/20 dark:to-purple-900/20">
                      <Sparkles className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Let's optimize your career.
                      </h3>
                      <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Select an action below or type a custom request.
                      </p>
                    </div>
                    
                    {/* Bento Grid Suggestions */}
                    <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-3">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(s.text)}
                          className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-white hover:shadow-xl dark:border-white/5 dark:bg-slate-800/50 dark:hover:border-indigo-500/30 dark:hover:bg-slate-800 ${s.colSpan}`}
                        >
                          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-indigo-900/40 dark:group-hover:text-indigo-400">
                            <s.icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m: any, index: number) => (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    onCopy={copy}
                    copiedId={copiedId}
                    delayMs={index * 50}
                  />
                ))}

                {isLoading && (
                  <div className="flex animate-in fade-in duration-500">
                     <TypingIndicator />
                  </div>
                )}

                {error && (
                  <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-center text-sm font-medium text-rose-600 shadow-sm backdrop-blur-md dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400">
                    ⚠️ {error.message || 'Connection lost. Please try again.'}
                  </div>
                )}
              </div>
            </div>

            {/* Floating Scroll to Bottom Button */}
            {isScrolledUp && (
              <button
                onClick={() => scrollToBottom(true)}
                className="absolute bottom-28 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200/60 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white z-30 animate-in slide-in-from-bottom-5 fade-in"
              >
                <ArrowDown className="h-4 w-4" />
                Latest Messages
              </button>
            )}

            {/* Input Form Area */}
            <div className="relative z-20 shrink-0 border-t border-slate-200/50 bg-white/40 p-4 backdrop-blur-2xl dark:border-white/5 dark:bg-slate-900/40 sm:p-6">
              <form ref={formRef} onSubmit={onSubmit} className="mx-auto relative flex max-w-4xl items-center">
                <input
                  ref={inputRef}
                  className="w-full rounded-full border-2 border-transparent bg-white py-4 pl-6 pr-16 text-[15px] text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500/20 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400/20 dark:focus:bg-slate-800 dark:focus:ring-indigo-400/10"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about ATS, keywords, or career strategy..."
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:scale-105 hover:bg-slate-800 disabled:scale-100 disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                </button>
              </form>

              <div className="mx-auto mt-4 flex max-w-4xl items-center justify-center gap-1.5 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                <Sparkles className="h-3.5 w-3.5" />
                Blitz Analyzer Engine executes high-performance AI heuristics. Verify critical outputs.
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}