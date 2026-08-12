import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LogIn,
  Plus,
  Search,
  Send,
  SquarePen,
  Trash2,
  User,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import {
  createPost,
  deletePost,
  fetchPosts,
  getAvatarUrl,
  getBestDisplayName,
  updatePost,
} from '@/api/posts';
import { createComment, deleteComment, fetchComments } from '@/api/comments';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/types/post';

const safeTrim = (value: string) =>
  value
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

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

const AuthorAvatar = ({
  author,
  avatarUrl,
  className = 'h-6 w-6',
}: {
  author: string;
  avatarUrl: string | null;
  className?: string;
}) => (
  <Avatar className={`${className} border border-slate-200`}>
    <AvatarImage src={avatarUrl ?? undefined} alt={author} />
    <AvatarFallback className="bg-slate-100 text-slate-500">
      <User className="h-3.5 w-3.5" />
    </AvatarFallback>
  </Avatar>
);

export default function CommunitySection() {
  const { user, signInWithGoogle } = useAuth();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [draftComment, setDraftComment] = useState('');
  const [deleteCommentTargetId, setDeleteCommentTargetId] = useState<
    number | null
  >(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 60 * 1000,
  });

  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', selectedPostId],
    queryFn: () => fetchComments(selectedPostId as number),
    enabled: selectedPostId !== null,
    staleTime: 30 * 1000,
  });

  const invalidatePosts = () =>
    queryClient.invalidateQueries({ queryKey: ['posts'] });

  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: ['comments', selectedPostId] });

  const createMutation = useMutation({
    mutationFn: () =>
      createPost({
        title: safeTrim(draftTitle),
        description: safeTrim(draftContent),
      }),
    onSuccess: (result) => {
      if (!result.success) {
        sonnerToast.error(result.error ?? '게시글 작성에 실패했습니다.');
        return;
      }
      invalidatePosts();
      setIsEditorOpen(false);
      sonnerToast.success('게시글을 작성했습니다.');
    },
    onError: () => {
      sonnerToast.error('게시글 작성 중 오류가 발생했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updatePost(editingPostId as number, {
        title: safeTrim(draftTitle),
        description: safeTrim(draftContent),
      }),
    onSuccess: (result) => {
      if (!result.success) {
        sonnerToast.error(result.error ?? '게시글 수정에 실패했습니다.');
        return;
      }
      invalidatePosts();
      setIsEditorOpen(false);
      sonnerToast.success('게시글을 수정했습니다.');
    },
    onError: () => {
      sonnerToast.error('게시글 수정 중 오류가 발생했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: (result, postId) => {
      if (!result.success) {
        sonnerToast.error(result.error ?? '게시글 삭제에 실패했습니다.');
        return;
      }
      invalidatePosts();
      setDeleteTargetId(null);
      if (selectedPostId === postId) {
        setSelectedPostId(null);
      }
      sonnerToast.success('게시글을 삭제했습니다.');
    },
    onError: () => {
      sonnerToast.error('게시글 삭제 중 오류가 발생했습니다.');
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: () =>
      createComment(selectedPostId as number, {
        content: safeTrim(draftComment),
      }),
    onSuccess: (result) => {
      if (!result.success) {
        sonnerToast.error(result.error ?? '댓글 작성에 실패했습니다.');
        return;
      }
      invalidateComments();
      setDraftComment('');
    },
    onError: () => {
      sonnerToast.error('댓글 작성 중 오류가 발생했습니다.');
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: (result) => {
      if (!result.success) {
        sonnerToast.error(result.error ?? '댓글 삭제에 실패했습니다.');
        return;
      }
      invalidateComments();
      setDeleteCommentTargetId(null);
      sonnerToast.success('댓글을 삭제했습니다.');
    },
    onError: () => {
      sonnerToast.error('댓글 삭제 중 오류가 발생했습니다.');
    },
  });

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((post) => post.id === selectedPostId) ?? null;
  }, [posts, selectedPostId]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = safeTrim(query).toLowerCase();
    if (!normalizedQuery) return posts;
    return posts.filter((post) => {
      const haystack =
        `${post.title}\n${post.description}\n${post.author}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [posts, query]);

  const handleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      sonnerToast.error('로그인 중 오류가 발생했습니다.');
    }
  };

  const openCreate = () => {
    if (!user) {
      sonnerToast.info('글쓰기는 로그인 후 이용할 수 있어요.');
      return;
    }
    setEditingPostId(null);
    setDraftTitle('');
    setDraftContent('');
    setIsEditorOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditingPostId(post.id);
    setDraftTitle(post.title);
    setDraftContent(post.description);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const submitDraft = () => {
    const title = safeTrim(draftTitle);
    const content = safeTrim(draftContent);

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

    if (editingPostId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const requestDelete = (postId: number) => {
    setDeleteTargetId(postId);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId);
  };

  const submitComment = () => {
    if (!user) {
      sonnerToast.info('댓글 작성은 로그인 후 이용할 수 있어요.');
      return;
    }
    const content = safeTrim(draftComment);
    if (content.length < 1) {
      sonnerToast.info('댓글 내용을 입력해 주세요.');
      return;
    }
    if (content.length > 1000) {
      sonnerToast.info('댓글은 1000자 이하로 작성해 주세요.');
      return;
    }
    createCommentMutation.mutate();
  };

  const requestDeleteComment = (commentId: number) => {
    setDeleteCommentTargetId(commentId);
  };

  const confirmDeleteComment = () => {
    if (!deleteCommentTargetId) return;
    deleteCommentMutation.mutate(deleteCommentTargetId);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
              FC 능곡 회원들과 소식을 나눠보세요.
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
                {user ? (
                  <Button type="button" onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    글쓰기
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSignIn}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인하고 글쓰기
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70">
              <div className="border-b border-slate-200 bg-white/60 px-4 py-3 sm:px-5">
                <p className="text-sm font-semibold text-slate-900">게시글</p>
              </div>

              {isLoading ? (
                <div className="px-4 py-10 text-center sm:px-5">
                  <p className="text-sm text-slate-500">불러오는 중...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
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
                  {filteredPosts.map((post) => {
                    const canManage = user?.id === post.user_id;
                    return (
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
                              <span className="flex items-center gap-1.5">
                                <AuthorAvatar
                                  author={post.author}
                                  avatarUrl={post.avatar_url}
                                />
                                {post.author}
                              </span>
                              <span>·</span>
                              <span>
                                {formatDateTime(post.updated_at)} 수정
                              </span>
                            </div>
                            <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {post.description}
                            </p>
                          </button>

                          {canManage && (
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
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col overflow-y-auto rounded-t-2xl sm:mx-auto sm:max-w-xl"
        >
          <SheetHeader>
            <SheetTitle className="mb-2 text-left">
              {editingPostId ? '게시글 수정' : '새 게시글 작성'}
            </SheetTitle>
            <SheetDescription className="flex items-center gap-1.5">
              {user && (
                <>
                  <AuthorAvatar
                    author={getBestDisplayName(user)}
                    avatarUrl={getAvatarUrl(user)}
                  />
                  {getBestDisplayName(user)}
                </>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4">
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

          <SheetFooter>
            <Button type="button" variant="outline" onClick={closeEditor}>
              취소
            </Button>
            <Button type="button" onClick={submitDraft} disabled={isSubmitting}>
              {editingPostId ? '수정 저장' : '작성'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={Boolean(selectedPostId)}
        onOpenChange={(open) => {
          setSelectedPostId(open ? selectedPostId : null);
          if (!open) {
            setDraftComment('');
          }
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col overflow-y-auto rounded-t-2xl sm:mx-auto sm:max-w-2xl"
        >
          {selectedPost ? (
            <>
              <SheetHeader>
                <SheetTitle className="mb-2 text-left">
                  {selectedPost.title}
                </SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-1.5 text-left">
                  <AuthorAvatar
                    author={selectedPost.author}
                    avatarUrl={selectedPost.avatar_url}
                  />
                  {selectedPost.author}
                  {' \b · \b '}
                  {formatDateTime(selectedPost.updated_at)} 수정
                </SheetDescription>
              </SheetHeader>
              <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white/60 p-4 text-sm leading-6 text-slate-700">
                {selectedPost.description}
              </div>

              <div className="grid gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  댓글 {comments.length}개
                </p>

                {isCommentsLoading ? (
                  <p className="text-sm text-slate-500">불러오는 중...</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    아직 댓글이 없어요. 첫 댓글을 남겨보세요.
                  </p>
                ) : (
                  <ul className="grid max-h-64 gap-3 overflow-y-auto pr-1">
                    {comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="rounded-lg border border-slate-200 bg-white/60 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <AuthorAvatar
                              author={comment.author}
                              avatarUrl={comment.avatar_url}
                              className="h-5 w-5"
                            />
                            <span className="font-medium text-slate-700">
                              {comment.author}
                            </span>
                            <span>·</span>
                            <span>{formatDateTime(comment.created_at)}</span>
                          </div>
                          {user?.id === comment.user_id && (
                            <button
                              type="button"
                              className="shrink-0 text-xs text-slate-400 hover:text-destructive"
                              onClick={() => requestDeleteComment(comment.id)}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {comment.content}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-start gap-2">
                  <Textarea
                    value={draftComment}
                    onChange={(e) => setDraftComment(e.target.value)}
                    placeholder={
                      user ? '댓글을 입력하세요' : '로그인 후 댓글을 남겨보세요'
                    }
                    className="min-h-[44px] flex-1 resize-none"
                    maxLength={1000}
                    disabled={!user}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={submitComment}
                    disabled={!user || createCommentMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {user?.id === selectedPost.user_id && (
                <SheetFooter>
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
                </SheetFooter>
              )}
            </>
          ) : (
            <div className="py-6">
              <p className="text-sm text-muted-foreground">
                게시글을 찾을 수 없습니다.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => setDeleteTargetId(open ? deleteTargetId : null)}
      >
        <AlertDialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] sm:max-w-lg sm:rounded-2xl">
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

      <AlertDialog
        open={Boolean(deleteCommentTargetId)}
        onOpenChange={(open) =>
          setDeleteCommentTargetId(open ? deleteCommentTargetId : null)
        }
      >
        <AlertDialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] sm:max-w-lg sm:rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>댓글을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제한 댓글은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteComment}
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
