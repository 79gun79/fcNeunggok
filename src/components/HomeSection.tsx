import { Loader2, Plus, Trash2, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HomeSection() {
  const storageKey = 'fcneunggok:raffle:participants:v1';
  const [nameInput, setNameInput] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<string[]>([]);
  const lastEnterAtRef = useRef(0);
  const drawTimeoutRef = useRef<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingBalls, setDrawingBalls] = useState<string[]>([]);
  const [drawingHiddenCount, setDrawingHiddenCount] = useState(0);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === 'string')) {
        const cleaned = parsed
          .map((v) => v.trim())
          .filter(Boolean)
          .slice(0, 200);
        setParticipants(cleaned);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(participants));
    } catch {
      // ignore
    }
  }, [participants]);

  useEffect(() => {
    return () => {
      if (drawTimeoutRef.current) {
        window.clearTimeout(drawTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setWinnerCount((current) => {
      const maxAllowed = Math.max(1, participants.length || 1);
      return Math.min(Math.max(1, current), maxAllowed);
    });
  }, [participants.length]);

  const canDraw = participants.length > 0;
  const maxWinners = Math.max(1, participants.length || 1);

  const normalizeName = (value: string) =>
    value
      .normalize('NFC')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim();

  const addParticipantsFromText = (text: string) => {
    const tokens = text
      .split(/[\n,]/g)
      .map((v) => normalizeName(v))
      .filter(Boolean)
      .slice(0, 200);

    if (tokens.length === 0) return;

    setParticipants((prev) => {
      const existing = new Set(prev);
      const next = [...prev];
      for (const token of tokens) {
        if (existing.has(token)) continue;
        next.push(token);
        existing.add(token);
        if (next.length >= 200) break;
      }
      return next;
    });

    setWinners([]);
  };

  const handleAddName = () => {
    const rawValue = nameInput;
    const value = normalizeName(rawValue);
    if (!value) {
      sonnerToast.info('이름을 입력해 주세요.');
      return;
    }

    if (rawValue.includes('\n') || rawValue.includes(',')) {
      addParticipantsFromText(rawValue);
      setNameInput('');
      return;
    }

    setParticipants((prev) => {
      if (prev.includes(value)) {
        sonnerToast.info('이미 추가된 이름입니다.');
        return prev;
      }
      if (prev.length >= 200) {
        sonnerToast.info('참여자는 최대 200명까지 추가할 수 있어요.');
        return prev;
      }
      return [...prev, value];
    });
    setNameInput('');
    setWinners([]);
  };

  const handleRemoveParticipant = (name: string) => {
    setParticipants((prev) => prev.filter((p) => p !== name));
    setWinners((prev) => prev.filter((w) => w !== name));
  };

  const secureRandom = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 0xffffffff;
  };

  const pickWinners = (count: number) => {
    const pool = [...participants];

    // Fisher–Yates shuffle
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(secureRandom() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, count);
  };

  const handleDraw = () => {
    if (isDrawing) return;

    if (!canDraw) {
      sonnerToast.info('참여자를 먼저 추가해 주세요.');
      return;
    }

    const count = Math.min(Math.max(1, winnerCount), participants.length);
    if (count > participants.length) {
      sonnerToast.info('참여자 수보다 많은 인원을 추첨할 수 없어요.');
      return;
    }

    const nextWinners = pickWinners(count);
    const maxBalls = 56;
    const nextBalls =
      participants.length <= maxBalls ? participants : pickWinners(maxBalls);
    const hiddenCount = Math.max(0, participants.length - nextBalls.length);

    setWinners([]);
    setDrawingBalls(nextBalls);
    setDrawingHiddenCount(hiddenCount);
    setIsDrawing(true);

    if (drawTimeoutRef.current) {
      window.clearTimeout(drawTimeoutRef.current);
    }

    drawTimeoutRef.current = window.setTimeout(() => {
      setWinners(nextWinners);
      setIsDrawing(false);
      setDrawingBalls([]);
      setDrawingHiddenCount(0);
      drawTimeoutRef.current = null;
    }, 2400);
  };

  const handleClearAll = () => {
    if (drawTimeoutRef.current) {
      window.clearTimeout(drawTimeoutRef.current);
      drawTimeoutRef.current = null;
    }

    setIsDrawing(false);
    setDrawingBalls([]);
    setDrawingHiddenCount(0);
    setParticipants([]);
    setWinners([]);
    setWinnerCount(1);
    setNameInput('');
    sonnerToast.info('참여자 목록을 비웠습니다.');
  };

  const displayBallText = (value: string) => {
    const trimmed = normalizeName(value);
    if (trimmed.length <= 3) return trimmed;
    return `${trimmed.slice(0, 3)}…`;
  };

  const winnersLabel = useMemo(() => {
    if (winners.length === 0) return '아직 추첨 전입니다.';
    if (winners.length === 1) return '당첨자 1명';
    return `당첨자 ${winners.length}명`;
  }, [winners.length]);

  return (
    <section
      id="home"
      className="relative scroll-mt-24 overflow-hidden px-3 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.18)] backdrop-blur-md sm:p-10 lg:p-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
              EVENT
            </p>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              오늘의 랜덤 추첨
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              이름을 추가하고, 뽑을 인원을 정한 뒤 추첨해 보세요.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-2 lg:items-start">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                  <Label htmlFor="raffle-name" className="text-slate-700">
                    이름 추가
                  </Label>
                  <p className="text-xs text-slate-500">
                    엔터로 추가 가능 · 여러 명은 쉼표/줄바꿈으로 붙여넣기
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-200 bg-white sm:w-auto"
                    onClick={() => setWinners([])}
                    disabled={winners.length === 0}
                  >
                    결과 초기화
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-200 bg-white text-slate-700 hover:text-slate-900 sm:w-auto"
                    onClick={handleClearAll}
                    disabled={participants.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    전체 삭제
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Input
                  id="raffle-name"
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  placeholder="예) 홍길동"
                  className="h-11 border-slate-200 bg-white"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      if ((event.nativeEvent as KeyboardEvent).isComposing) {
                        return;
                      }
                      if (event.repeat) {
                        return;
                      }

                      event.preventDefault();
                      const now = Date.now();
                      if (now - lastEnterAtRef.current < 250) {
                        return;
                      }
                      lastEnterAtRef.current = now;
                      handleAddName();
                    }
                  }}
                  onPaste={(event) => {
                    const text = event.clipboardData.getData('text');
                    if (!text.includes('\n') && !text.includes(',')) return;
                    event.preventDefault();
                    addParticipantsFromText(text);
                    setNameInput('');
                    sonnerToast.info('이름을 여러 명 추가했습니다.');
                  }}
                />
                <Button
                  type="button"
                  className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto"
                  onClick={handleAddName}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  추가
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {participants.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    아직 참여자가 없어요.
                  </p>
                ) : (
                  participants.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleRemoveParticipant(name)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                      aria-label={`${name} 제거`}
                      title="클릭하면 제거됩니다"
                    >
                      <span className="max-w-[14rem] truncate">{name}</span>
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  ))
                )}
              </div>

              <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:p-5">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    추첨 설정
                  </p>
                  <p className="text-xs text-slate-500">
                    현재 참여자 {participants.length}명 · 최대 {maxWinners}
                    명까지
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center justify-between gap-2 sm:justify-start">
                    <Label htmlFor="raffle-count" className="sr-only">
                      추첨 인원
                    </Label>
                    <Input
                      id="raffle-count"
                      type="number"
                      min={1}
                      max={maxWinners}
                      value={winnerCount}
                      onChange={(event) => {
                        const raw = Number(event.target.value);
                        if (Number.isNaN(raw)) return;
                        setWinnerCount(Math.min(Math.max(1, raw), maxWinners));
                      }}
                      className="h-10 w-24 border-slate-200 bg-white text-center"
                    />
                    <span className="text-sm text-slate-600">명</span>
                  </div>

                  <Button
                    type="button"
                    className="h-10 w-full bg-emerald-600 text-white hover:bg-emerald-500 sm:w-auto"
                    onClick={handleDraw}
                    disabled={!canDraw || isDrawing}
                  >
                    {isDrawing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trophy className="mr-2 h-4 w-4" />
                    )}
                    {isDrawing ? '추첨중…' : '추첨'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">결과</p>
                  <p className="text-xs text-slate-500">{winnersLabel}</p>
                </div>
                <p className="text-xs text-slate-500">※ 중복 없이 랜덤</p>
              </div>

              <div className="mt-4">
                <AnimatePresence mode="wait" initial={false}>
                  {isDrawing ? (
                    <motion.div
                      key="lotto"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="relative rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.06),rgba(15,23,42,0.02))] p-4 sm:p-5"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
                        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />
                      </div>

                      <div className="relative flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">
                            드럼통 흔들리는 중
                          </p>
                          <p className="text-xs text-slate-500">잠시만요…</p>
                        </div>

                        <motion.div
                          aria-hidden
                          className="relative mx-auto w-full max-w-2xl rounded-2xl border border-white/55 bg-white/55 p-4 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.35)] backdrop-blur-md sm:p-5"
                          animate={{
                            x: [0, -12, 12, -10, 10, -6, 6, 0],
                            rotate: [0, -3.8, 3.8, -3.2, 3.2, -1.8, 1.8, 0],
                          }}
                          transition={{
                            duration: 0.62,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.14),transparent_55%)]" />
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),transparent)]" />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(0deg,rgba(15,23,42,0.06),transparent)]" />

                          <div className="relative flex flex-wrap justify-center gap-2 pb-5 pt-4 sm:pb-6 sm:pt-5">
                            {(drawingBalls.length ? drawingBalls : participants)
                              .slice(0, 56)
                              .map((name, index) => {
                                const normalized = normalizeName(name);
                                let hash = 0;
                                for (let i = 0; i < normalized.length; i += 1) {
                                  hash =
                                    (hash * 31 + normalized.charCodeAt(i)) %
                                    1000;
                                }
                                const unit = hash / 1000;
                                const duration = 0.55 + unit * 0.45;
                                const delay = (index % 10) * 0.03 + unit * 0.08;
                                const lift = 10 + unit * 14;

                                return (
                                  <motion.div
                                    key={`${normalized}-${index}`}
                                    animate={{
                                      y: [0, -lift, 0],
                                      rotate: [0, 6, -6, 0],
                                      scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                      duration,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                      delay,
                                    }}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-900 shadow-[0_16px_38px_-24px_rgba(15,23,42,0.35)] sm:h-11 sm:w-11"
                                  >
                                    {displayBallText(name)}
                                  </motion.div>
                                );
                              })}
                          </div>

                          {drawingHiddenCount > 0 && (
                            <div className="relative mt-3 text-center text-xs text-slate-500">
                              참여자가 많아 일부만 표시 중 (+
                              {drawingHiddenCount}명)
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : winners.length === 0 ? (
                    <motion.p
                      key="empty"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-sm text-slate-600"
                    >
                      참여자를 추가한 뒤 추첨 버튼을 눌러보세요.
                    </motion.p>
                  ) : (
                    <motion.div
                      key="winners"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="flex flex-wrap gap-2"
                    >
                      {winners.map((winner) => (
                        <motion.span
                          key={winner}
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800"
                        >
                          {winner}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
