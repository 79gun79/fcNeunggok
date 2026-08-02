<div align='center'>

<h1><b>FC 능곡 커뮤니티</b></h1>
<h3><b>2026 능곡인들을 위한 커뮤니티</b></h3>
<h4><b>Created: Jaegeon. Lee.</b></h4>

🔗 [전지훈련 바로가기](https://keen-mochi-fef8ff.netlify.app/)

<img width="800" height="533" alt="전지훈련 공식 배경" src="/public/banner3.jpeg" />

</div>

<br>

## 목차

1. [프로젝트 소개](#1)
2. [주요 기능](#2)
3. [기술 스택](#3)
4. [프로젝트 구조](#4)
5. [시작하기](#5)

<br />

## <span id="1">🚩 프로젝트 소개</span>

**FC 능곡 커뮤니티**는 구성원들의 단합을 도모하고,
꾸준히 소통할 수 있도록 돕는 **공식 커뮤니티**입니다!

<br>
<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br>

## <span id="2">✨ 주요 기능</span>

| 페이지   | 경로         | 설명                                                       |
| -------- | ------------ | ---------------------------------------------------------- |
| 홈       | `/`          | 팀 소개 및 히어로 섹션                                     |
| 갤러리   | `/gallery`   | 팀 사진 갤러리 (Supabase 연동, 구글 로그인 후 업로드 가능) |
| 커뮤니티 | `/community` | 자유 게시판 (Supabase 연동)                                |
| 생일     | `/birthday`  | 멤버 생일 안내 페이지                                      |

- **구글 소셜 로그인**: Supabase Auth 기반 OAuth 로그인으로 게시물/사진 업로드 권한을 제어합니다.
- **실시간 데이터 연동**: TanStack Query로 Supabase 데이터를 페칭/캐싱합니다.

<br>
<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br>

## <span id="3">🛠 기술 스택</span>

### Environment

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

### Config

![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

### Development

![react](https://img.shields.io/badge/react-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![vite](https://img.shields.io/badge/vite-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![tailwindcss](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

![supabase](https://img.shields.io/badge/supabase-3FCF8E.svg?style=for-the-badge&logo=supabase&logoColor=white) ![tanstack](https://img.shields.io/badge/tanstack-FF4154.svg?style=for-the-badge&logo=tanstack&logoColor=white) ![react-router](https://img.shields.io/badge/react%20router-CA4245.svg?style=for-the-badge&logo=reactrouter&logoColor=white) ![zod](https://img.shields.io/badge/zod-3E67B1.svg?style=for-the-badge&logo=zod&logoColor=white)

### Design

![Lovable](https://img.shields.io/badge/lovable-fe4c74.svg?style=for-the-badge&logo=lovable&logoColor=white) ![Radix UI](https://img.shields.io/badge/radixui-161618.svg?style=for-the-badge&logo=radixui&logoColor=white)

### Hosting

![netlify](https://img.shields.io/badge/netlify-00C7B7.svg?style=for-the-badge&logo=netlify&logoColor=white)

<br>
<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br>

## <span id="4">📁 프로젝트 구조</span>

```
src/
├── pages/            # 라우트 단위 페이지 (Index, Gallery, Community, Birthday)
├── components/        # 섹션 컴포넌트 (Hero, Home, Gallery, Community, Birthday, Footer 등)
│   └── ui/            # Radix 기반 공용 UI 컴포넌트
├── contexts/           # AuthContext (Supabase 인증 상태 관리)
├── api/                # Supabase 연동 API (photos, posts)
├── hooks/              # 커스텀 훅 (useScrollReveal, use-toast)
├── types/              # 도메인 타입 정의 (photo, post)
└── App.tsx             # 라우팅 및 프로바이더 설정
```

<br>
<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br>

## <span id="5">🚀 시작하기</span>

### 설치 및 실행

```bash
pnpm install
pnpm dev       # 로컬 개발 서버 실행
pnpm build     # 프로덕션 빌드
pnpm lint      # 린트 검사
```

### 환경 변수

Supabase 연동을 위해 프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 설정해야 합니다.

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

자세한 Supabase 프로젝트 설정(테이블 생성, 구글 OAuth, Storage 정책 등)은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 문서를 참고하세요.

<br>
<!-- Top Button -->
<p style='background: black; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-left: auto;'><a href="#top" style='color: white; '>▲</a></p>

<br>
