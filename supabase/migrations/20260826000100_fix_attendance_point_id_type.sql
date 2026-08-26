-- points.id는 UUID가 아니라 TEXT(slug)이므로 함수 내부 변수 타입을 수정
CREATE OR REPLACE FUNCTION check_in_attendance()
RETURNS TABLE (score INTEGER) AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_point_id TEXT;
  v_new_score INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '인증이 필요합니다.';
  END IF;

  SELECT id INTO v_point_id FROM points WHERE points.user_id = v_user_id;
  IF v_point_id IS NULL THEN
    RAISE EXCEPTION '연동된 포인트 정보를 찾을 수 없습니다.';
  END IF;

  BEGIN
    INSERT INTO attendance (user_id, attendance_date) VALUES (v_user_id, CURRENT_DATE);
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
