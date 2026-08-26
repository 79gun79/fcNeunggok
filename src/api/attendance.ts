import { supabase } from '@/lib/supabase';
import { AttendanceCheckInResult } from '@/types/attendance';

export const checkInAttendance = async (): Promise<AttendanceCheckInResult> => {
  try {
    const { data, error } = await supabase.rpc('check_in_attendance');

    if (error) {
      console.error('출석 체크 오류:', error);
      return {
        success: false,
        error: error.message || '출석 체크에 실패했습니다.',
      };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { success: true, score: row?.score };
  } catch (error) {
    console.error('출석 체크 실패:', error);
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

export const fetchTodayAttendance = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const today = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Seoul',
    });
    const { data, error } = await supabase
      .from('attendance')
      .select('id')
      .eq('user_id', user.id)
      .eq('attendance_date', today)
      .maybeSingle();

    if (error) {
      console.error('출석 조회 오류:', error);
      return false;
    }

    return Boolean(data);
  } catch (error) {
    console.error('출석 조회 실패:', error);
    return false;
  }
};
