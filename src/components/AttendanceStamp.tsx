import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Stamp } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { checkInAttendance, fetchTodayAttendance } from '@/api/attendance';
import { useAuth } from '@/contexts/AuthContext';

const AttendanceStamp = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: hasCheckedInToday = false } = useQuery({
    queryKey: ['attendance', 'today', user?.id],
    queryFn: fetchTodayAttendance,
    enabled: Boolean(user),
  });

  const checkInMutation = useMutation({
    mutationFn: checkInAttendance,
    onSuccess: (result) => {
      if (!result.success) {
        sonnerToast.error(result.error ?? '출석 체크에 실패했습니다.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['points'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', 'today'] });
      sonnerToast.success('출석 체크 완료! 점수가 50점 감소했습니다.');
    },
    onError: () => {
      sonnerToast.error('출석 체크 중 오류가 발생했습니다.');
    },
  });

  if (!user) return null;

  const isDisabled = hasCheckedInToday || checkInMutation.isPending;

  return (
    <button
      type="button"
      onClick={() => checkInMutation.mutate()}
      disabled={isDisabled}
      className={`mb-8 flex w-full items-center gap-4 rounded-2xl border border-dashed p-4 text-left transition-colors sm:mb-10 sm:gap-5 sm:p-5 ${
        hasCheckedInToday
          ? 'border-red-200 bg-red-50/60'
          : 'border-slate-300 bg-white/60 hover:border-red-300 hover:bg-red-50/40 disabled:cursor-not-allowed'
      }`}
    >
      <motion.div
        key={hasCheckedInToday ? 'stamped' : 'blank'}
        initial={hasCheckedInToday ? { scale: 0.8, rotate: -8 } : false}
        animate={{ scale: 1, rotate: hasCheckedInToday ? -8 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 sm:h-16 sm:w-16 ${
          hasCheckedInToday
            ? 'border-red-600 bg-red-600/10 text-red-600'
            : 'border-dashed border-slate-300 text-slate-300'
        }`}
      >
        <Stamp className="h-6 w-6 sm:h-7 sm:w-7" />
      </motion.div>
      <div className="min-w-0">
        <p
          className={`mb-1 text-sm font-bold sm:text-base ${
            hasCheckedInToday ? 'text-red-600' : 'text-slate-900'
          }`}
        >
          {hasCheckedInToday
            ? '오늘은 이미 출석했어요 👍'
            : '오늘 출석하면 50점 감면이야!'}
        </p>
        <p className="text-xs text-slate-500 sm:text-sm">
          {hasCheckedInToday ? (
            '내일 또 도장 찍으러 오세요!'
          ) : (
            <>
              출석하는 사람이 진짜 FC 능곡 멤버죠!
              <br />
              가짜들 다 나가라!
            </>
          )}
        </p>
      </div>
    </button>
  );
};

export default AttendanceStamp;
