
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MergedProfile } from '../types';
import { PROPOSAL_SECTION_MAP } from '../constants';
import {
  CheckCircle2,
  Zap,
  Info,
  TrendingUp,
  Download,
  Copy,
  Check,
  BookOpen,
  Shield,
  Target,
  Trophy,
  Activity,
  ChevronRight,
  Trash2,
  Maximize2,
  Lock,
  Brain,
  FileSearch,
  Sparkles,
  ShieldCheck,
  Timer,
  ArrowLeftRight,
  Clock
} from 'lucide-react';

interface DataCardProps {
  data: MergedProfile | null;
  loading: boolean;
  proposalId?: string;
  originalContents?: string;
  originalRecord?: Record<string, any>;
  onDelete?: () => void;
  logs?: string[];
  startTime?: number;
  durationMs?: number;
}

// ─── Dynamic Processing Steps ───
const PROCESSING_STEPS = [
  { id: 'init', icon: <Zap size={18} />, label: '엔진 초기화', detail: 'Enhancement Engine Booting...', delay: 0 },
  { id: 'connect', icon: <Lock size={18} />, label: '보안 API 연결', detail: 'Secure Proxy Connection Established', delay: 1200 },
  { id: 'analyze', icon: <FileSearch size={18} />, label: '섹션 컨텍스트 분석', detail: 'Cross-referencing CM Classification', delay: 2800 },
  { id: 'reason', icon: <Brain size={18} />, label: '논리적 전략 추론', detail: 'Reasoning Construction Logic...', delay: 4500 },
  { id: 'generate', icon: <Sparkles size={18} />, label: '콘텐츠 보강 생성', detail: 'Generating Enhanced Strategy', delay: 6500 },
  { id: 'verify', icon: <ShieldCheck size={18} />, label: '키워드 보존 검증', detail: 'Fidelity Verification Running...', delay: 8500 },
];

const ProcessingAnimation: React.FC<{ logs: string[], startTime: number }> = ({ logs, startTime }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timers = PROCESSING_STEPS.map((step, idx) => {
      if (idx === 0) return null;
      return setTimeout(() => setActiveStep(idx), step.delay);
    });
    const elapsedTimer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => { timers.forEach(t => t && clearTimeout(t)); clearInterval(elapsedTimer); };
  }, [startTime]);

  return (
    <div className="w-full bg-[#0A0A0A] rounded-sm border border-[#222] overflow-hidden relative shadow-2xl">
      <div className="bg-[#0D0D0D] px-8 py-4 flex justify-between items-center border-b border-[#222]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#8AB4F8] shadow-[0_0_10px_#8AB4F8] animate-pulse"></div>
          <span className="text-[#8AB4F8] font-black tracking-[0.2em] text-[9px] uppercase">Enhancement In Progress</span>
        </div>
        <div className="flex items-center gap-2 text-[#555]">
          <Timer size={12} />
          <span className="text-[11px] font-mono tabular-nums">{elapsed}s</span>
        </div>
      </div>

      <div className="p-10">
        <div className="space-y-1">
          {PROCESSING_STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            const isDone = idx < activeStep;
            const isPending = idx > activeStep;
            return (
              <div key={step.id} className="flex items-stretch gap-5">
                <div className="flex flex-col items-center w-10 shrink-0">
                  <div className={`
                    w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-700 shrink-0
                    ${isDone ? 'bg-[#8AB4F8]/20 text-[#8AB4F8] border border-[#8AB4F8]/40' : ''}
                    ${isActive ? 'bg-[#8AB4F8] text-[#001D35] shadow-[0_0_20px_rgba(138,180,248,0.3)] scale-110' : ''}
                    ${isPending ? 'bg-[#111] text-[#333] border border-[#1A1A1A]' : ''}
                  `}>
                    {isDone ? <Check size={16} /> : step.icon}
                  </div>
                  {idx < PROCESSING_STEPS.length - 1 && (
                    <div className={`w-[1px] flex-1 min-h-[24px] transition-all duration-500 ${isDone ? 'bg-[#8AB4F8]/40' : 'bg-[#1A1A1A]'}`}></div>
                  )}
                </div>
                <div className={`pt-2 pb-6 transition-all duration-500 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-[13px] font-bold transition-colors duration-500 ${isActive ? 'text-white' : isDone ? 'text-[#8AB4F8]' : 'text-[#444]'}`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1 h-1 bg-[#8AB4F8] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></span>
                        ))}
                      </span>
                    )}
                    {isDone && <span className="text-[8px] font-black text-[#8AB4F8]/50 uppercase tracking-widest">Complete</span>}
                  </div>
                  <p className={`text-[10px] mt-1 font-mono tracking-wide ${isActive ? 'text-[#666]' : 'text-[#333]'}`}>{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {logs.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[#1A1A1A]">
            <div className="text-[8px] font-black text-[#333] uppercase tracking-[0.3em] mb-3">Live Feed</div>
            <div className="space-y-1.5 max-h-[80px] overflow-y-auto custom-scrollbar">
              {logs.slice(-4).map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[8px] text-[#333] font-mono mt-0.5 shrink-0">{'>'}</span>
                  <span className="text-[10px] text-[#555] font-mono leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="w-full bg-[#111] rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8AB4F8]/50 to-[#8AB4F8] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(((activeStep + 1) / PROCESSING_STEPS.length) * 100, 95)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── Before/After Comparison Component ───
const ComparisonView: React.FC<{
  original: Record<string, any>,
  enhanced: Record<string, any>
}> = ({ original, enhanced }) => {
  const compareKeys = ['contents', 'inferred_issues', 'core_strategy', 'tactical_differentiator', 'expected_outcome'];
  const keysToShow = compareKeys.filter(k => original[k] && enhanced[k]);

  if (keysToShow.length === 0) return <div className="text-[#444] text-sm p-8 text-center">비교 가능한 필드가 없습니다.</div>;

  return (
    <div className="space-y-6">
      {keysToShow.map(key => (
        <div key={key} className="border border-[#1A1A1A] rounded-sm overflow-hidden">
          <div className="bg-[#0A0A0A] px-6 py-3 border-b border-[#1A1A1A] flex items-center gap-2">
            <ArrowLeftRight size={12} className="text-[#8AB4F8]" />
            <span className="text-[9px] font-black text-[#8AB4F8] uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-[#1A1A1A]">
            {/* Original */}
            <div className="p-6">
              <div className="text-[8px] font-black text-red-400/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500/30 rounded-full"></span> 원본 (Before)
              </div>
              <p className="text-[11px] text-[#666] leading-relaxed">{String(original[key])}</p>
            </div>
            {/* Enhanced */}
            <div className="p-6 bg-[#0A0A0A]">
              <div className="text-[8px] font-black text-emerald-400/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500/30 rounded-full"></span> 보강 (After)
              </div>
              <p className="text-[11px] text-[#CCC] leading-relaxed font-medium">{String(enhanced[key])}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


// Visual Proof of Preservation
const HighlightedText: React.FC<{ text: string, keywords: string }> = ({ text, keywords }) => {
  const wordsToHighlight = useMemo(() => {
    if (!keywords) return [];
    return keywords.split(/[,\s.()]+/).filter(w => w.length > 1).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  }, [keywords]);
  if (wordsToHighlight.length === 0) return <span>{text}</span>;
  const regex = new RegExp(`(${wordsToHighlight.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-[#8AB4F8]/15 text-[#8AB4F8] px-1 rounded-sm border-b border-[#8AB4F8]/40 font-semibold underline decoration-dotted underline-offset-4">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};


export const DataCard: React.FC<DataCardProps> = ({
  data, loading, proposalId, originalContents, originalRecord,
  onDelete, logs = [], startTime = Date.now(), durationMs = 0
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyAllStatus, setCopyAllStatus] = useState(false);
  const [activeSectionExplorer, setActiveSectionExplorer] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevLoadingRef = useRef(loading);

  // ─── Success Animation: detect transition from loading→loaded ───
  useEffect(() => {
    if (prevLoadingRef.current === true && loading === false && data !== null) {
      setShowSuccessFlash(true);
      setTimeout(() => setShowSuccessFlash(false), 2000);
    }
    prevLoadingRef.current = loading;
  }, [loading, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveSectionExplorer(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAll = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data.resolved_data, null, 2));
    setCopyAllStatus(true);
    setTimeout(() => setCopyAllStatus(false), 2000);
  };

  const handleDownload = () => {
    if (!data) return;
    const fileName = `reinforced_${proposalId || 'data'}.json`;
    const jsonStr = JSON.stringify(data.resolved_data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = fileName;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return <ProcessingAnimation logs={logs} startTime={startTime} />;
  }

  if (!data) return null;

  const isUpdated = (field: string) => data.updates_applied.some(f => f.toLowerCase().includes(field.toLowerCase()));
  const currentLibraryId = data.resolved_data?.library_id || "";
  const currentSectionCode = currentLibraryId.split('_')[0];
  const durationSec = (durationMs / 1000).toFixed(1);

  const strategySteps = [
    { key: 'core_strategy', phase: '01', label: 'Core Strategy', tagline: 'Strategic Foundation', icon: <Shield size={22} />, value: data.resolved_data.core_strategy },
    { key: 'tactical_differentiator', phase: '02', label: 'Tactical Differentiator', tagline: 'Technical Advantage', icon: <Target size={22} />, value: data.resolved_data.tactical_differentiator },
    { key: 'expected_outcome', phase: '03', label: 'Expected Outcome', tagline: 'Project Success', icon: <Trophy size={22} />, value: data.resolved_data.expected_outcome }
  ].filter(s => s.value);

  return (
    <div className={`w-full bg-[#111] rounded-sm overflow-hidden border shadow-3xl group/card relative transition-all duration-700 ${showSuccessFlash ? 'border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : 'border-[#222]'}`}>

      {/* ─── Success Flash Overlay ─── */}
      {showSuccessFlash && (
        <div className="absolute inset-0 z-50 pointer-events-none animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent animate-out fade-out duration-2000 fill-mode-forwards"></div>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/40 px-6 py-3 rounded-sm backdrop-blur-sm animate-in slide-in-from-top-4 zoom-in-95 duration-500">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-[11px] font-black text-emerald-300 uppercase tracking-widest">Enhancement Complete</span>
            <span className="text-[10px] text-emerald-400/60 font-mono">{durationSec}s</span>
          </div>
        </div>
      )}

      {/* ─── Blueprint Top Bar ─── */}
      <div className="bg-[#0D0D0D] px-8 py-4 flex justify-between items-center border-b border-[#222]">
        <div className="flex items-center gap-4">
          <div className={`w-2.5 h-2.5 shadow-[0_0_10px] ${showSuccessFlash ? 'bg-emerald-400 shadow-emerald-400' : 'bg-[#8AB4F8] shadow-[#8AB4F8]'} transition-colors duration-700`}></div>
          <div className="flex flex-col">
            <span className="text-[#8AB4F8] font-black tracking-[0.2em] text-[9px] uppercase">Architectural Result</span>
            <span className="text-[#444] text-[8px] font-mono">{proposalId} // REINFORCED_v2</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* ─── Duration Badge (#2: 소요 시간 표시) ─── */}
          {durationMs > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0A0A] border border-[#222] rounded-sm mr-2">
              <Clock size={10} className="text-[#555]" />
              <span className="text-[10px] font-mono text-[#888] tabular-nums">{durationSec}s</span>
            </div>
          )}

          {/* ─── Before/After Toggle (#6) ─── */}
          {originalRecord && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-3 py-1.5 rounded-sm text-[9px] font-black uppercase transition-all border flex items-center gap-1.5 ${showComparison
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-white/5 hover:bg-amber-500/10 text-white/50 hover:text-amber-300 border-white/5 hover:border-amber-500/20'
                }`}
            >
              <ArrowLeftRight size={11} /> Diff
            </button>
          )}

          <button onClick={handleCopyAll} className="px-3 py-1.5 bg-white/5 hover:bg-[#8AB4F8]/10 text-white/50 hover:text-[#8AB4F8] rounded-sm text-[9px] font-black uppercase transition-all border border-white/5">
            {copyAllStatus ? <Check size={12} /> : <Copy size={12} />}
          </button>
          <button onClick={handleDownload} className="px-3 py-1.5 bg-[#8AB4F8]/10 hover:bg-[#8AB4F8]/20 text-[#8AB4F8] rounded-sm text-[9px] font-black uppercase transition-all border border-[#8AB4F8]/20">
            <Download size={12} />
          </button>
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 text-[#333] hover:text-red-500 rounded-sm transition-all border border-transparent hover:border-red-500/20 ml-2">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="p-10 space-y-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#1A1A1A_1px,transparent_1px)] [background-size:30px_30px] opacity-10 pointer-events-none"></div>

        {/* ─── Before/After Comparison View (#6) ─── */}
        {showComparison && originalRecord && (
          <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-8 border-b border-[#222] pb-4">
              <ArrowLeftRight size={16} className="text-amber-400/50" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/70">Before ↔ After Comparison</h3>
            </div>
            <ComparisonView original={originalRecord} enhanced={data.resolved_data} />
          </div>
        )}

        {/* Strategic Flowchart */}
        {strategySteps.length > 0 && (
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10 border-b border-[#222] pb-4">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-[#8AB4F8]/50" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">Logic Process Roadmap</h3>
              </div>
              <div className="text-[8px] font-mono text-[#333]">ENGINEERING_FLOW_VERIFIED</div>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[1px] bg-[#222] z-0"></div>
              {strategySteps.map((step, idx) => (
                <div key={step.key} className="relative flex flex-col items-center px-6 mb-12 md:mb-0">
                  <div className="relative z-10 mb-8 w-20 h-20 bg-black border border-[#222] rounded-sm flex items-center justify-center text-[#8AB4F8] group-hover:border-[#8AB4F8]/50 transition-all shadow-inner">
                    <div className="absolute inset-1 bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111),linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111)] bg-[length:4px_4px] opacity-20"></div>
                    {step.icon}
                    <div className="absolute -top-2 -right-2 bg-[#8AB4F8] text-[#001D35] text-[9px] font-black w-7 h-7 flex items-center justify-center rounded-sm shadow-xl">{step.phase}</div>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-[#8AB4F8] uppercase tracking-[0.1em]">{step.label}</div>
                      <div className="text-[8px] text-[#444] font-medium uppercase tracking-[0.2em]">{step.tagline}</div>
                    </div>
                    <div className="p-6 bg-[#0A0A0A] border border-[#1A1A1A] rounded-sm text-xs text-[#999] leading-relaxed italic min-h-[100px] flex items-center justify-center group-hover:border-[#333] transition-colors">
                      "{step.value}"
                    </div>
                  </div>
                  {idx < strategySteps.length - 1 && (
                    <div className="hidden md:flex absolute top-[44px] -right-3 translate-x-1/2 -translate-y-1/2 bg-[#111] p-1.5 border border-[#222] z-20">
                      <ChevronRight size={14} className="text-[#444]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Data Specification */}
        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
            <Maximize2 size={16} className="text-[#8AB4F8]/50" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#555]">Reinforced Technical Specification</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(data.resolved_data).map(([key, value]) => {
              const updated = isUpdated(key);
              const valStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
              return (
                <div key={key} className={`group p-8 border transition-all duration-500 rounded-sm ${updated ? 'bg-black border-[#2D2D2D] hover:border-[#8AB4F8]/30' : 'bg-[#0A0A0A] border-[#1A1A1A]'}`}>
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-3 ${updated ? 'bg-[#8AB4F8]' : 'bg-[#222]'}`}></div>
                        <label className={`text-[9px] font-black uppercase tracking-[0.3em] ${updated ? 'text-[#8AB4F8]' : 'text-[#444]'}`}>
                          {key.replace(/_/g, ' ')}
                        </label>
                      </div>
                      {updated && (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#8AB4F8]/5 text-[#8AB4F8] text-[9px] font-black rounded-sm border border-[#8AB4F8]/20">
                            <Zap size={10} fill="currentColor" /> PRO-REASONED
                          </span>
                          <button
                            onClick={() => setActiveSectionExplorer(activeSectionExplorer === key ? null : key)}
                            className={`p-1.5 rounded-sm transition-all ${activeSectionExplorer === key ? 'bg-[#8AB4F8] text-black shadow-[0_0_15px_#8AB4F8]' : 'text-[#333] hover:text-[#8AB4F8] bg-[#1A1A1A]'}`}
                            title="View Classification Context"
                          >
                            <BookOpen size={12} />
                          </button>
                          <button onClick={() => handleCopy(key, valStr)} className="p-1.5 text-[#333] hover:text-white transition-all bg-[#1A1A1A] rounded-sm">
                            <Copy size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={`text-base leading-relaxed ${updated ? 'text-[#DDD]' : 'text-[#666]'} font-light`}>
                      {updated ? <HighlightedText text={valStr} keywords={originalContents || ""} /> : valStr}
                    </div>

                    {updated && activeSectionExplorer === key && (
                      <div className="mt-4 p-6 bg-[#0D0D0D] border border-[#222] animate-in fade-in slide-in-from-top-2">
                        <div className="text-[9px] text-[#444] font-black mb-3 uppercase tracking-widest">Library Context Mapping</div>
                        <div className="flex items-center gap-4">
                          <div className="text-[11px] text-[#8AB4F8] font-mono font-bold bg-[#8AB4F8]/10 px-2 py-1 border border-[#8AB4F8]/20">{currentLibraryId}</div>
                          <div className="text-[11px] text-[#999] uppercase tracking-tight font-medium">{PROPOSAL_SECTION_MAP[currentSectionCode]}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 relative z-10 border-t border-[#222] pt-12">
          <div className="p-6 text-center bg-black/20 rounded-sm">
            <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.3em] mb-3">Logical Intent</div>
            <div className="text-[10px] text-white font-mono uppercase tracking-widest">{data.identified_intent}</div>
          </div>
          <div className="p-6 text-center border-x border-[#222] bg-black/20 rounded-sm">
            <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.3em] mb-3">Technical Fidelity</div>
            <div className="text-sm text-[#8AB4F8] font-black font-mono">{(data.confidence_score * 100).toFixed(1)}%</div>
          </div>
          <div className="p-6 text-center bg-black/20 rounded-sm">
            <div className="text-[8px] font-black text-[#444] uppercase tracking-[0.3em] mb-3">Sentiment Tone</div>
            <div className="text-[10px] text-white font-mono uppercase tracking-widest">{data.latest_sentiment}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
