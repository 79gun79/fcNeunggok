-- points 테이블에 로그인 계정 연동 컬럼 추가
ALTER TABLE points ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE points ADD CONSTRAINT points_user_id_key UNIQUE (user_id);

-- attendance(출석) 테이블 생성
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (user_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS attendance_user_id_idx ON attendance (user_id);

-- Row Level Security (RLS) 설정
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 본인 출석 기록만 조회 가능
CREATE POLICY "Users can view their own attendance"
  ON attendance FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 이름으로만 출석 기록 삽입 가능 (RPC 사용을 권장하지만 직접 삽입 경로도 보호)
CREATE POLICY "Users can insert their own attendance"
  ON attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 출석 체크 + 점수 차감을 하나의 트랜잭션으로 처리하는 RPC 함수
-- SECURITY DEFINER로 실행되어 points UPDATE에 대한 RLS 제약을 우회하되,
-- 함수 내부 로직으로 "본인 계정만, 하루 한 번만" 처리되도록 보장한다.
CREATE OR REPLACE FUNCTION check_in_attendance()
RETURNS TABLE (score INTEGER) AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_point_id UUID;
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

GRANT EXECUTE ON FUNCTION check_in_attendance() TO authenticated;
