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
# 선택사항: 커스텀 리다이렉트 URL (기본값: 현재 도메인)
# VITE_REDIRECT_URL=http://localhost:3000
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
   - 로컬 개발: `http://localhost:3000`
   - 배포 환경: `https://your-site-name.netlify.app`

### 환경별 설정

- **로컬 개발**: `VITE_REDIRECT_URL`을 설정하지 않거나 `http://localhost:3000`으로 설정
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

## 문제 해결

### 환경 변수가 설정되지 않았다는 경고가 나타나는 경우

- `.env` 파일이 프로젝트 루트에 있는지 확인하세요.
- 환경 변수 이름이 정확한지 확인하세요 (`VITE_` 접두사 필수).
- 개발 서버를 재시작하세요.

### 데이터가 표시되지 않는 경우

- Supabase 대시보드에서 `photos` 테이블에 데이터가 있는지 확인하세요.
- RLS 정책이 올바르게 설정되었는지 확인하세요.
- 브라우저 콘솔에서 네트워크 오류가 있는지 확인하세요.
