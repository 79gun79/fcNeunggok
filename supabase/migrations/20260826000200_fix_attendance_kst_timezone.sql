-- 출석 기준 날짜를 UTC 자정이 아닌 한국시간(Asia/Seoul) 자정 기준으로 통일
ALTER TABLE attendance ALTER COLUMN attendance_date SET DEFAULT (NOW() AT TIME ZONE 'Asia/Seoul')::date;

CREATE OR REPLACE FUNCTION check_in_attendance()
RETURNS TABLE (score INTEGER) AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_point_id TEXT;
  v_new_score INTEGER;
  v_today DATE := (NOW() AT TIME ZONE 'Asia/Seoul')::date;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증이 필요합니다.';
  END IF;

  SELECT id INTO v_point_id FROM points WHERE points.user_id = v_user_id;
  IF v_point_id IS NULL THEN
    RAISE EXCEPTION '연동된 포인트 정보를 찾을 수 없습니다.';
  END IF;

  BEGIN
    INSERT INTO attendance (user_id, attendance_date) VALUES (v_user_id, v_today);
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION '오늘 이미 출석했습니다.';
  END;

  UPDATE points
  SET score = points.score - 50, updated_at = TIMEZONE('utc'::text, NOW())
  WHERE points.id = v_point_id
  RETURNING points.score INTO v_new_score;

  RETURN QUERY SELECT v_new_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
