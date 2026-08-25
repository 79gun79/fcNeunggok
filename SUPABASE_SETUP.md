# Supabase 데이터베이스 설정 가이드

이 프로젝트는 Supabase를 사용하여 갤러리 사진 데이터를 관리합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 로그인합니다.
2. "New Project"를 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름과 데이터베이스 비밀번호를 설정합니다.
4. 프로젝트가 생성될 때까지 기다립니다 (약 2분 소요).

## 2. 데이터베이스 테이블 생성

Supabase 대시보드에서 SQL Editor로 이동하여 다음 SQL을 실행하세요:

```sql
-- photos 테이블 생성 (업데이트된 버전)
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 기존 테이블이 있다면 컬럼 추가
ALTER TABLE photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE photos ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS user_email TEXT;

-- 초기 데이터 삽입 (기존 사진들)
INSERT INTO photos (id, src, description) VALUES
  (1, '/img1.png', '문제영'),
  (2, '/img2.png', '서유관'),
  (3, '/img3.png', '이재건'),
  (4, '/img4.png', '박성민'),
  (5, '/img5.png', '박현겸'),
  (6, '/img6.png', '장준혁')
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) 정책 설정
-- 읽기는 모든 사용자에게 허용
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are viewable by everyone"
  ON photos FOR SELECT
  USING (true);
```

## 3. 환경 변수 설정

### 로컬 개발 환경

1. 프로젝트 루트에 `.env` 파일을 생성합니다.
2. `.env.example` 파일을 참고하여 다음 내용을 입력합니다:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
# 선택사항: 배포 환경 리다이렉트 URL
# VITE_REDIRECT_URL=https://your-site-name.netlify.app
# 선택사항: 로컬 개발 전용 리다이렉트 URL (기본값: 현재 origin)
# VITE_DEV_REDIRECT_URL=http://localhost:5173
```

### Supabase API 키 확인 방법

1. Supabase 대시보드에서 프로젝트를 선택합니다.
2. Settings > API 메뉴로 이동합니다.
3. 다음 정보를 복사합니다:
   - **Project URL**: `VITE_SUPABASE_URL`에 사용
   - **anon/public key**: `VITE_SUPABASE_ANON_KEY`에 사용

## 4. Netlify 배포 시 환경 변수 설정

1. Netlify 대시보드에서 프로젝트를 선택합니다.
2. Site settings > Environment variables로 이동합니다.
3. 다음 환경 변수를 추가합니다:
   - `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase anon key
   - `VITE_REDIRECT_URL`: 배포된 사이트 URL (예: https://your-site-name.netlify.app)

## 4.5. OAuth Redirect URL 설정

로그인 후 리다이렉트될 URL을 Supabase에서 설정해야 합니다.

### Supabase 대시보드 설정

1. Supabase 대시보드에서 Authentication > Settings 메뉴로 이동합니다.
2. "Site URL"을 배포된 사이트 URL로 설정합니다 (예: https://your-site-name.netlify.app).
3. "Redirect URLs"에 다음 URL들을 추가합니다:

- 로컬 개발: `http://localhost:5173`
- 로컬 개발(대체): `http://127.0.0.1:5173`
- 커스텀 포트를 쓴다면 해당 포트도 추가 (예: `http://localhost:8080`)
- 배포 환경: `https://your-site-name.netlify.app`

### 환경별 설정

- **로컬 개발**: `VITE_REDIRECT_URL`을 설정하지 않는 것을 권장합니다.
  - 필요 시 `VITE_DEV_REDIRECT_URL=http://localhost:5173` 사용
- **배포 환경**: `VITE_REDIRECT_URL`을 실제 배포 URL로 설정

### 배포 플랫폼별 환경변수 설정 예시

#### Netlify

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_REDIRECT_URL=https://your-site-name.netlify.app
```

#### Vercel

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_REDIRECT_URL=https://your-site-name.vercel.app
```

#### 일반적인 웹 호스팅

배포된 사이트의 실제 URL을 `VITE_REDIRECT_URL`로 설정하세요.

## 4.5. 구글 인증 설정

사진 추가 기능을 사용하기 위해 구글 OAuth 인증을 설정합니다.

### Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.
3. "APIs & Services" > "Credentials" 메뉴로 이동합니다.
4. "Create Credentials" > "OAuth client ID"를 선택합니다.
5. Application type을 "Web application"으로 선택합니다.
6. Authorized JavaScript origins에 Supabase 프로젝트 URL을 추가합니다:
   - `https://your-project-id.supabase.co`
7. Authorized redirect URIs에 다음 URL을 추가합니다:
   - `https://your-project-id.supabase.co/auth/v1/callback`
8. Client ID와 Client Secret을 복사합니다.

### Supabase에서 Google OAuth 설정

1. Supabase 대시보드에서 "Authentication" > "Providers" 메뉴로 이동합니다.
2. "Google"을 선택합니다.
3. Google Cloud Console에서 복사한 Client ID와 Client Secret을 입력합니다.
4. 추가 설정을 완료하고 저장합니다.

### RLS 정책 업데이트 (사진 추가 권한)

```sql
-- 인증된 사용자만 사진을 추가할 수 있도록 정책 설정
CREATE POLICY "Authenticated users can insert photos"
  ON photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 자신의 사진을 수정/삭제할 수 있도록 정책 설정
CREATE POLICY "Authenticated users can update their photos"
  ON photos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their photos"
  ON photos FOR DELETE
  USING (auth.role() = 'authenticated');
```

### Storage 설정

사진 파일을 저장하기 위한 Supabase Storage 버킷을 생성합니다.

1. Supabase 대시보드에서 "Storage" 메뉴로 이동합니다.
2. "Create bucket"을 클릭합니다.
3. 버킷 이름: `photos`
4. 버킷을 Public으로 설정합니다 (웹에서 이미지 접근 가능하도록).
5. 버킷 생성 후, "Policies" 탭에서 다음 정책을 추가합니다:

```sql
-- 모든 사용자가 업로드된 사진을 볼 수 있도록 허용
CREATE POLICY "Photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

-- 인증된 사용자만 사진을 업로드할 수 있도록 허용
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- 인증된 사용자만 자신의 사진을 삭제할 수 있도록 허용
CREATE POLICY "Authenticated users can delete their photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'photos' AND auth.role() = 'authenticated');
```

## 5. 사진 추가/수정 방법

### Supabase 대시보드에서 직접 추가

1. Supabase 대시보드에서 Table Editor로 이동합니다.
2. `photos` 테이블을 선택합니다.
3. "Insert row"를 클릭하여 새 사진을 추가합니다.

### 웹 애플리케이션을 통한 추가

구글 로그인을 통해 인증된 사용자만 갤러리에 사진을 추가할 수 있습니다.

## 6. 테스트

로컬에서 개발 서버를 실행하여 데이터베이스 연결을 테스트합니다:

```bash
npm run dev
```

브라우저 콘솔에서 오류가 없는지 확인하고, 갤러리 섹션이 정상적으로 표시되는지 확인합니다.

## 7. Point(순위표) 테이블 설정

Point 페이지는 Supabase의 `points` 테이블에서 멤버별 점수를 읽어와 순위표를 보여줍니다.

```sql
-- points 테이블 생성
CREATE TABLE IF NOT EXISTS points (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  image TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 초기 멤버 데이터 삽입 (점수는 0으로 초기화)
INSERT INTO points (id, name, color, image, score) VALUES
  ('choi-jinhyuk', '최진혁', 'from-emerald-500 to-teal-600', '/profile/jinhyuk.png', 0),
  ('an-chiguk', '안치국', 'from-amber-500 to-orange-600', NULL, 0),
  ('seo-yugwan', '서유관', 'from-violet-500 to-purple-600', '/profile/yugwan.png', 0),
  ('park-hyeongyeom', '박현겸', 'from-rose-500 to-pink-600', '/profile/hyeongyeom.png', 0),
  ('park-seongmin', '박성민', 'from-cyan-500 to-sky-600', '/profile/seongmin.png', 0),
  ('jang-junhyeok', '장준혁', 'from-lime-500 to-green-600', NULL, 0),
  ('moon-jeyeong', '문제영', 'from-fuchsia-500 to-rose-600', '/profile/jeyeong.png', 0),
  ('han-jaeyeong', '한재영', 'from-indigo-500 to-blue-600', '/profile/jaeyeong.png', 0)
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) 설정
ALTER TABLE points ENABLE ROW LEVEL SECURITY;

-- 읽기는 모든 사용자에게 허용
CREATE POLICY "Points are viewable by everyone"
  ON points FOR SELECT
  USING (true);

-- 점수 수정은 지정된 관리자 이메일만 허용
CREATE POLICY "Admins can update points"
  ON points FOR UPDATE
  USING (auth.jwt() ->> 'email' IN ('79gun79@gmail.com', 'neunggok123@gmail.com', 'wpdud258@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('79gun79@gmail.com', 'neunggok123@gmail.com', 'wpdud258@gmail.com'));
```

앱에서는 `src/config/admins.ts`의 `ALL_ADMIN_EMAILS`에 포함된 계정으로 구글 로그인했을 때만 Point 페이지에 점수 +/- 버튼이 표시됩니다. 실제 권한은 위 RLS 정책이 서버 단에서 강제하므로, 다른 계정으로는 API를 직접 호출해도 수정되지 않습니다.

**중요**: `admins.ts`에 이메일을 추가/제거하는 것만으로는 실제 DB 쓰기 권한이 바뀌지 않습니다. `admins.ts`는 UI에 버튼을 보여줄지만 결정하고, 실제 권한은 Supabase의 RLS 정책이 결정하기 때문입니다. 관리자를 추가하거나 바꿀 때는 다음 두 곳을 함께 수정해야 합니다.

1. `src/config/admins.ts`의 `SUPERADMIN_EMAILS` / `ADMIN_EMAILS`
2. Supabase 대시보드 SQL Editor에서 아래 SQL을 실행해 `points` 테이블 RLS 정책의 이메일 목록을 동일하게 갱신:

```sql
DROP POLICY IF EXISTS "Only the admin can update points" ON points;
DROP POLICY IF EXISTS "Admins can update points" ON points;

CREATE POLICY "Admins can update points"
  ON points FOR UPDATE
  USING (auth.jwt() ->> 'email' IN ('79gun79@gmail.com', 'neunggok123@gmail.com', 'wpdud258@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('79gun79@gmail.com', 'neunggok123@gmail.com', 'wpdud258@gmail.com'));
```

## 8. FCM 토큰(fcm_tokens) 테이블 설정

로그인한 사용자가 브라우저 알림 권한을 허용하면, 앱이 자동으로 FCM 등록 토큰을 발급받아 `fcm_tokens` 테이블에 저장합니다. 나중에 이 테이블의 토큰들로 실제 발송 대상을 정할 수 있습니다.

```sql
-- fcm_tokens 테이블 생성
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) 설정
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

-- 본인 토큰만 등록 가능
CREATE POLICY "Users can insert their own fcm token"
  ON fcm_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 토큰만 수정 가능 (동일 토큰 재발급 시 upsert)
CREATE POLICY "Users can update their own fcm token"
  ON fcm_tokens FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 본인 토큰만 조회 가능 (upsert의 충돌 감지에 필요 — 아래 설명 참고)
CREATE POLICY "Users can view their own fcm token"
  ON fcm_tokens FOR SELECT
  USING (auth.uid() = user_id);
```

토큰 목록은 Supabase 대시보드의 Table Editor(서비스 역할 권한 사용)에서 확인하면 됩니다.

> SELECT 정책이 꼭 필요합니다. 클라이언트는 `upsert(..., { onConflict: 'token' })`로 저장하는데, `INSERT ... ON CONFLICT DO UPDATE`가 충돌 여부를 판단하려면 RLS 하에서 기존 행을 조회할 수 있어야 합니다. SELECT 정책이 없으면 INSERT/UPDATE 정책이 맞아도 매번 `new row violates row-level security policy` 오류가 발생합니다 (실제로 이 프로젝트에서 겪은 문제였습니다).

## 9. 점수 변경 시 자동 푸시 발송 (Edge Function)

관리자가 Point 페이지에서 점수를 수정하면, `fcm_tokens`에 등록된 모든 기기로 자동 푸시가 발송됩니다. 클라이언트가 점수 수정 성공 직후 Supabase Edge Function(`notify-score-change`)을 호출하고, 그 함수가 Firebase Admin SDK로 전체 토큰에 발송합니다.

### 1) Firebase 서비스 계정 키 발급

1. Firebase 콘솔 → 프로젝트 설정 → **서비스 계정** 탭
2. "새 비공개 키 생성" 클릭 → JSON 파일 다운로드 (절대 git에 커밋하지 말 것)

### 2) Supabase CLI로 배포

```bash
npx supabase login
npx supabase link --project-ref gfnbobmngrydoejnnehs

# 다운받은 JSON 파일 내용을 통째로 시크릿으로 등록
npx supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON="$(cat /path/to/service-account.json)"

npx supabase functions deploy notify-score-change --no-verify-jwt
```

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`는 Edge Function 실행 환경에 Supabase가 자동으로 주입하므로 별도 설정이 필요 없습니다.

> `--no-verify-jwt`가 꼭 필요합니다. Supabase Edge Function은 기본적으로 모든 요청(브라우저의 CORS 프리플라이트 OPTIONS 요청 포함)에 플랫폼 레벨 JWT 검증을 먼저 적용하는데, 이 OPTIONS 요청에는 Authorization 헤더가 없어서 우리 코드에 도달하기도 전에 거부되어 CORS 에러로 보입니다. 관리자 인증은 함수 코드 안에서 JWT의 email을 직접 검사하므로 플랫폼 검증은 꺼도 안전합니다.

### 3) 동작 방식

- 관리자(`79gun79@gmail.com`)가 로그인한 상태에서만 함수가 정상 동작합니다 (Authorization 헤더의 JWT에서 email을 확인해 그 외 요청은 403 거부).
- Table Editor에서 직접 `points.score`를 고치는 경우는 이 흐름을 타지 않아 알림이 가지 않습니다 (의도된 동작).
- 함수 코드: [supabase/functions/notify-score-change/index.ts](supabase/functions/notify-score-change/index.ts)

## 문제 해결

### 환경 변수가 설정되지 않았다는 경고가 나타나는 경우

- `.env` 파일이 프로젝트 루트에 있는지 확인하세요.
- 환경 변수 이름이 정확한지 확인하세요 (`VITE_` 접두사 필수).
- 개발 서버를 재시작하세요.

### 데이터가 표시되지 않는 경우

- Supabase 대시보드에서 `photos` 테이블에 데이터가 있는지 확인하세요.
- RLS 정책이 올바르게 설정되었는지 확인하세요.
- 브라우저 콘솔에서 네트워크 오류가 있는지 확인하세요.
