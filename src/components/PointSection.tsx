import { useState } from 'react';
import { SquarePen, Trophy } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from 'sonner';
import { fetchPoints, updatePointScore } from '@/api/points';
import type { Point } from '@/types/point';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const ADMIN_EMAIL = '79gun79@gmail.com';

const PointSection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const { data: points = [], isLoading } = useQuery({
    queryKey: ['points'],
    queryFn: fetchPoints,
  });

  const [editingMember, setEditingMember] = useState<Point | null>(null);
  const [draftScore, setDraftScore] = useState('');

  const scoreMutation = useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) =>
      updatePointScore(id, score),
    onSuccess: (result) => {
      if (!result.success) {
        sonnerToast.error(result.error ?? '점수 수정에 실패했습니다.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['points'] });
      setEditingMember(null);
      sonnerToast.success('점수를 수정했습니다.');
    },
    onError: () => {
      sonnerToast.error('점수 수정 중 오류가 발생했습니다.');
    },
  });

  const openEdit = (member: Point) => {
    setEditingMember(member);
    setDraftScore(String(member.score));
  };

  const submitScore = () => {
    if (!editingMember) return;
    const score = Number(draftScore);
    if (!Number.isInteger(score)) {
      sonnerToast.info('점수는 정수로 입력해 주세요.');
      return;
    }
    scoreMutation.mutate({ id: editingMember.id, score });
  };

  const sortedMembers = [...points].sort((a, b) => b.score - a.score);

  return (
    <section
      id="point"
      className="relative scroll-mt-24 overflow-hidden px-3 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.18)] backdrop-blur-md sm:p-10 lg:p-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
              POINT
            </p>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              FC 능곡 멤버 순위
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              멤버들의 미친 짓을 가만보고 있지 않고,
              <br />
              포인트를 부여하여 순위를 매겼습니다. <br />
            </p>
          </div>

          {isLoading ? (
            <p className="mt-8 text-sm text-slate-500 sm:mt-10">
              불러오는 중...
            </p>
          ) : (
            <div className="mt-8 flex flex-col gap-3 sm:mt-10">
              {sortedMembers.map((member, index) => {
                const rank = index + 1;
                const isTop = rank === 1;
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)] sm:p-5"
                  >
                    <span className="flex w-8 shrink-0 items-center justify-center text-lg font-bold text-slate-400">
                      {rank}
                    </span>

                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${member.color} text-lg font-bold text-white`}
                      >
                        {member.name.slice(0, 1)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-950">
                        {member.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                      {isTop && <Trophy className="h-4 w-4 text-amber-500" />}
                      <span className="text-sm font-semibold text-slate-900">
                        {member.score}점
                      </span>
                    </div>

                    {isAdmin && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 border-slate-200 bg-white"
                        onClick={() => openEdit(member)}
                        aria-label={`${member.name} 점수 수정`}
                      >
                        <SquarePen className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Sheet
        open={Boolean(editingMember)}
        onOpenChange={(open) => !open && setEditingMember(null)}
      >
        <SheetContent side="bottom" className="mx-auto max-w-md">
          <SheetHeader>
            <SheetTitle>{editingMember?.name} 점수 수정</SheetTitle>
            <SheetDescription>
              새 점수를 입력하고 저장을 눌러주세요.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-2 py-4">
            <Label htmlFor="point-score">점수</Label>
            <Input
              id="point-score"
              type="number"
              inputMode="numeric"
              value={draftScore}
              onChange={(e) => setDraftScore(e.target.value)}
            />
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingMember(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={submitScore}
              disabled={scoreMutation.isPending}
            >
              저장
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default PointSection;
