import { Plus, RefreshCcw, Search, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type CommunityPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

const storageKey = 'fcneunggok:community:posts:v1';

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `post_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const nowIso = () => new Date().toISOString();

const safeTrim = (value: string) =>
  value
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

const buildSeedPosts = (): CommunityPost[] => {
  const createdAt = nowIso();
  return [
    {
      id: createId(),
      title: '공지: FC 능곡 커뮤니티 게시판 오픈(가짜 데이터)',
      content:
        '이 게시판은 현재 가짜 데이터로 동작합니다.\n\n- 글쓰기/수정/삭제가 가능해요\n- 새로고침해도 localStorage에 저장됩니다\n\n추후 Supabase로 실제 DB 연동 예정입니다.',
      author: '운영진',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: createId(),
      title: '오늘 풋살 인원 체크!',
      content:
        '오늘 8시 풋살 참여하실 분 댓글(이라고 치고 글) 남겨주세요.\n\n예) 홍길동 참석',
      author: '총무',
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: createId(),
      title: '유니폼 사이즈 추천 부탁드립니다',
      content: '키 175 / 72인데 L 갈까요 M 갈까요?\n경험 공유 부탁!',
      author: '익명',
      createdAt,
      updatedAt: createdAt,
    },
  ];
};

const isCommunityPostArray = (value: unknown): value is CommunityPost[] => {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const post = item as Record<string, unknown>;
    return (
      typeof post.id === 'string' &&
      typeof post.title === 'string' &&
      typeof post.content === 'string' &&
      typeof post.author === 'string' &&
      typeof post.createdAt === 'string' &&
      typeof post.updatedAt === 'string'
    );
  });
};

const formatDateTime = (iso: string) => {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return iso;
  }
};

const getBestDisplayName = (
  user?: {
    email?: string | null;
    user_metadata?: Record<string, unknown> | null;
  } | null,
) => {
  const meta = user?.user_metadata ?? {};
  const fromMeta =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name);
  if (fromMeta) return fromMeta;
  const email = user?.email ?? '';
  if (email.includes('@')) return email.split('@')[0];
  return '익명';
};

export default function CommunitySection() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [query, setQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftAuthor, setDraftAuthor] = useState('');
  const [draftContent, setDraftContent] = useState('');

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        const seeded = buildSeedPosts();
        setPosts(seeded);
        return;
      }
      const parsed = JSON.parse(saved);
      if (isCommunityPostArray(parsed)) {
        const cleaned = parsed
          .map((post) => ({
            ...post,
            title: safeTrim(post.title).slice(0, 120),
            author: safeTrim(post.author).slice(0, 40) || '익명',
            content: safeTrim(post.content).slice(0, 5000),
          }))
          .filter((post) => post.title.length > 0);
        setPosts(cleaned);
        return;
      }
      setPosts(buildSeedPosts());
    } catch {
      setPosts(buildSeedPosts());
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  useEffect(() => {
    if (!isEditorOpen) return;
    if (editingPostId) return;
    setDraftAuthor((current) => safeTrim(current) || getBestDisplayName(user));
  }, [editingPostId, isEditorOpen, user]);

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((post) => post.id === selectedPostId) ?? null;
  }, [posts, selectedPostId]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = safeTrim(query).toLowerCase();
    const base = [...posts].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
    if (!normalizedQuery) return base;
    return base.filter((post) => {
      const haystack =
        `${post.title}\n${post.content}\n${post.author}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [posts, query]);

  const openCreate = () => {
    setEditingPostId(null);
    setDraftTitle('');
    setDraftContent('');
    setDraftAuthor(getBestDisplayName(user));
    setIsEditorOpen(true);
  };

  const openEdit = (post: CommunityPost) => {
    setEditingPostId(post.id);
    setDraftTitle(post.title);
    setDraftContent(post.content);
    setDraftAuthor(post.author);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const upsertPostFromDraft = () => {
    const title = safeTrim(draftTitle);
    const content = safeTrim(draftContent);
    const author = safeTrim(draftAuthor) || '익명';

    if (title.length < 2) {
      sonnerToast.info('제목은 2글자 이상 입력해 주세요.');
      return;
    }
    if (title.length > 120) {
      sonnerToast.info('제목은 120자 이하로 작성해 주세요.');
      return;
    }
    if (content.length < 2) {
      sonnerToast.info('내용은 2글자 이상 입력해 주세요.');
      return;
    }
    if (content.length > 5000) {
      sonnerToast.info('내용은 5000자 이하로 작성해 주세요.');
      return;
    }

    const timestamp = nowIso();

    if (!editingPostId) {
      const createdAt = timestamp;
      const next: CommunityPost = {
        id: createId(),
        title,
        content,
        author: author.slice(0, 40),
        createdAt,
        updatedAt: createdAt,
      };
      setPosts((prev) => [next, ...prev].slice(0, 200));
      closeEditor();
      sonnerToast.success('게시글을 작성했습니다.');
      return;
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== editingPostId) return post;
        return {
          ...post,
          title,
          content,
          author: author.slice(0, 40),
          updatedAt: timestamp,
        };
      }),
    );
    closeEditor();
    sonnerToast.success('게시글을 수정했습니다.');
  };

  const requestDelete = (postId: string) => {
    setDeleteTargetId(postId);
  };

  const confirmDelete = () => {
    const targetId = deleteTargetId;
    if (!targetId) return;
    setPosts((prev) => prev.filter((post) => post.id !== targetId));
    setDeleteTargetId(null);
    if (selectedPostId === targetId) {
      setSelectedPostId(null);
    }
    sonnerToast.success('게시글을 삭제했습니다.');
  };

  const resetToDummy = () => {
    const seeded = buildSeedPosts();
    setPosts(seeded);
    setSelectedPostId(null);
    setQuery('');
    sonnerToast.info('더미 게시글로 초기화했습니다.');
  };

  return (
    <section
      id="community"
      className="relative scroll-mt-24 overflow-hidden px-3 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_70px_-44px_rgba(15,23,42,0.18)] backdrop-blur-md sm:p-10 lg:p-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
              COMMUNITY
            </p>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              커뮤니티 게시판
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              더미 데이터로 구성된 게시판입니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex w-full flex-col gap-2 sm:max-w-md">
                <Label htmlFor="community-search" className="text-slate-700">
                  검색
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="community-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="제목/내용/작성자 검색"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  총 {posts.length}개 · 검색 결과 {filteredPosts.length}개
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-200 bg-white"
                  onClick={resetToDummy}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  더미로 초기화
                </Button>
                <Button type="button" onClick={openCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  글쓰기
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70">
              <div className="border-b border-slate-200 bg-white/60 px-4 py-3 sm:px-5">
                <p className="text-sm font-semibold text-slate-900">게시글</p>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="px-4 py-10 text-center sm:px-5">
                  <p className="text-sm font-medium text-slate-900">
                    표시할 게시글이 없어요.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    검색어를 지우거나, 새 글을 작성해 보세요.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {filteredPosts.map((post) => (
                    <li key={post.id} className="px-4 py-4 sm:px-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => setSelectedPostId(post.id)}
                        >
                          <p className="text-base font-semibold text-slate-950">
                            {post.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span>작성자 {post.author}</span>
                            <span>·</span>
                            <span>수정 {formatDateTime(post.updatedAt)}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {post.content}
                          </p>
                        </button>

                        <div className="flex shrink-0 items-center gap-2 sm:pt-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-slate-200 bg-white"
                            onClick={() => openEdit(post)}
                          >
                            <SquarePen className="mr-2 h-4 w-4" />
                            수정
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => requestDelete(post.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingPostId ? '게시글 수정' : '새 게시글 작성'}
            </DialogTitle>
            <DialogDescription>
              더미 게시판입니다. 저장은 이 브라우저에만 반영됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="community-author">작성자</Label>
              <Input
                id="community-author"
                value={draftAuthor}
                onChange={(e) => setDraftAuthor(e.target.value)}
                placeholder="예) 홍길동"
                maxLength={40}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="community-title">제목</Label>
              <Input
                id="community-title"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                maxLength={120}
              />
              <p className="text-xs text-muted-foreground">
                {safeTrim(draftTitle).length}/120
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="community-content">내용</Label>
              <Textarea
                id="community-content"
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="min-h-[180px]"
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground">
                {safeTrim(draftContent).length}/5000
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditorOpen(false)}
            >
              취소
            </Button>
            <Button type="button" onClick={upsertPostFromDraft}>
              {editingPostId ? '수정 저장' : '작성'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedPostId)}
        onOpenChange={(open) => setSelectedPostId(open ? selectedPostId : null)}
      >
        <DialogContent className="sm:max-w-2xl">
          {selectedPost ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">
                  {selectedPost.title}
                </DialogTitle>
                <DialogDescription className="text-left">
                  작성자 {selectedPost.author} · 작성{' '}
                  {formatDateTime(selectedPost.createdAt)}
                  {' · '}수정 {formatDateTime(selectedPost.updatedAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white/60 p-4 text-sm leading-6 text-slate-700">
                {selectedPost.content}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedPostId(null);
                    openEdit(selectedPost);
                  }}
                >
                  <SquarePen className="mr-2 h-4 w-4" />
                  수정
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => requestDelete(selectedPost.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-6">
              <p className="text-sm text-muted-foreground">
                게시글을 찾을 수 없습니다.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => setDeleteTargetId(open ? deleteTargetId : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제한 게시글은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
