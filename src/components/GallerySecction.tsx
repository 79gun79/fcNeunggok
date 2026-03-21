import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Plus, Trash2, Upload, X } from 'lucide-react';
import { fetchPhotos, uploadPhoto, deletePhoto } from '@/api/photos';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useToast } from '@/hooks/use-toast';
import { Photo } from '@/types/photo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const GallerySection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos,
    staleTime: 5 * 60 * 1000,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, description }: { file: File; description: string }) =>
      uploadPhoto(file, description),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: '사진 업로드 성공',
          description: '갤러리에 사진이 추가되었습니다.',
        });
        queryClient.invalidateQueries({ queryKey: ['photos'] });
        setIsUploadDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: '업로드 실패',
          description: result.error || '알 수 없는 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: '업로드 실패',
        description: '네트워크 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Upload error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      photoId,
      photoSrc,
    }: {
      photoId: number;
      photoSrc: string;
    }) => deletePhoto(photoId, photoSrc),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: '사진 삭제 성공',
          description: '사진이 삭제되었습니다.',
        });
        queryClient.invalidateQueries({ queryKey: ['photos'] });
        setIsPhotoModalOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedPhoto(null);
      } else {
        toast({
          title: '삭제 실패',
          description: result.error || '알 수 없는 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: '삭제 실패',
        description: '네트워크 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Delete error:', error);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !description.trim()) {
      toast({
        title: '입력 오류',
        description: '파일과 설명을 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    uploadMutation.mutate({
      file: selectedFile,
      description: description.trim(),
    });
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDescription('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsPhotoModalOpen(true);
  };

  const handleDialogClose = () => {
    setIsUploadDialogOpen(false);
    resetForm();
  };

  const photoCountLabel = `${photos.length.toString().padStart(2, '0')} Photos`;

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden px-3 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07111f_0%,#0b1728_45%,#101928_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.14),transparent_24%),radial-gradient(circle_at_bottom,rgba(120,53,15,0.12),transparent_30%)]" />
      <div className="container mx-auto">
        <div
          className={`mb-8 mt-4 transition-all duration-700 sm:mb-10 sm:mt-6 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mb-4 flex flex-col items-start gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium tracking-wide text-slate-700 backdrop-blur-md sm:px-4 sm:text-sm">
              <Camera className="h-4 w-4" />
              Gallery
            </div>
            <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-500 backdrop-blur-md sm:px-4 sm:text-sm">
              {photoCountLabel}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-slate-950 sm:mb-4 sm:text-4xl md:text-5xl">
                순간 포착
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-lg sm:leading-7">
                멤버들의 순간을 함께하세요!
              </p>
            </div>
            <div className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs leading-5 text-slate-600 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.12)] backdrop-blur-md sm:px-5 sm:py-4 sm:text-sm">
              {user
                ? '지금 이 순간도 새로운 기록으로 남겨보세요.'
                : '로그인 후 업로드와 삭제 기능을 사용할 수 있습니다.'}
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 transition-all delay-200 duration-700 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {isLoading ? (
            <div className="col-span-full rounded-[1.5rem] border border-white/10 bg-white/[0.08] py-12 text-center !text-sm !text-white/60 backdrop-blur-xl sm:rounded-[1.75rem] sm:py-16 sm:!text-base">
              사진을 불러오는 중...
            </div>
          ) : photos.length === 0 ? (
            <div className="col-span-full rounded-[1.5rem] border border-white/10 bg-white/[0.08] px-5 py-12 text-center backdrop-blur-xl sm:rounded-[1.75rem] sm:px-6 sm:py-16">
              <p className="!text-base font-semibold !text-white sm:!text-lg">
                아직 등록된 사진이 없습니다.
              </p>
              <p className="mt-3 !text-sm !text-white/60 sm:!text-base">
                첫 번째 장면을 업로드해 커뮤니티 아카이브를 시작해보세요.
              </p>
            </div>
          ) : (
            <>
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`group relative aspect-[0.92] cursor-pointer overflow-hidden rounded-[1.35rem] border border-white/[0.12] bg-white/[0.06] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)] transition-all duration-500 sm:aspect-[0.95] sm:rounded-[1.75rem] ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.description}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 !text-white sm:p-5">
                    <p className="max-h-12 overflow-hidden !text-base font-semibold leading-6 sm:max-h-14 sm:!text-lg sm:leading-7">
                      {photo.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3 !text-xs !text-white/80 sm:mt-3 sm:!text-sm">
                      <span className="truncate">
                        {photo.user_name || 'FC 능곡 멤버'}
                      </span>
                      {photo.created_at && (
                        <span>
                          {new Date(photo.created_at).toLocaleDateString(
                            'ko-KR',
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {user && (
                <Dialog
                  open={isUploadDialogOpen}
                  onOpenChange={setIsUploadDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="group flex aspect-[0.92] cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.35rem] border border-dashed border-white/[0.24] bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.68))] px-5 text-center !text-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/[0.36] hover:bg-[linear-gradient(180deg,rgba(30,41,59,0.88),rgba(15,23,42,0.78))] hover:shadow-[0_22px_48px_-22px_rgba(0,0,0,0.52)] sm:aspect-[0.95] sm:gap-4 sm:rounded-[1.75rem] sm:px-6">
                      <div className="!pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.14] shadow-[0_10px_25px_-12px_rgba(148,163,184,0.55)] transition-transform group-hover:scale-110 group-hover:bg-white/[0.18] sm:h-16 sm:w-16">
                        <Plus className="h-8 w-8 !text-white" />
                      </div>
                      <div className="space-y-1">
                        <span className="block !text-sm font-semibold !text-white sm:!text-base">
                          사진 업로드
                        </span>
                        <span className="block !text-xs leading-5 !text-white/75 sm:!text-sm">
                          새로운 순간을 아카이브에 추가하세요.
                        </span>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.94))] p-4 !text-white shadow-2xl backdrop-blur-2xl sm:max-w-md sm:rounded-[1.75rem] sm:p-6">
                    <DialogHeader>
                      <DialogTitle>새 사진 추가</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="file">사진 파일</Label>
                        <Input
                          id="file"
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="mt-1 border-white/[0.12] bg-white/[0.08] !text-white file:!font-medium file:!text-white"
                        />
                      </div>

                      {previewUrl && (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="미리보기"
                            className="h-48 w-full rounded-xl object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute right-2 top-2"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="description">사진 설명</Label>
                        <Textarea
                          id="description"
                          placeholder="사진에 대한 설명을 입력하세요..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 min-h-28 border-white/[0.12] bg-white/[0.08] !text-white placeholder:!text-white/[0.35]"
                        />
                      </div>

                      <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                        <Button
                          onClick={handleDialogClose}
                          variant="outline"
                          className="flex-1 border-white/[0.12] bg-white/[0.08] !text-white hover:bg-white/[0.12] hover:!text-white"
                        >
                          취소
                        </Button>
                        <Button
                          onClick={handleUpload}
                          disabled={
                            uploadMutation.isPending ||
                            !selectedFile ||
                            !description.trim()
                          }
                          className="flex-1 bg-white text-slate-950 hover:bg-white/90"
                        >
                          {uploadMutation.isPending ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              업로드 중...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              업로드
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Dialog
                open={isPhotoModalOpen}
                onOpenChange={setIsPhotoModalOpen}
              >
                <DialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.94))] !text-white shadow-2xl backdrop-blur-2xl sm:max-w-xl sm:rounded-[1.75rem]">
                  <DialogHeader>
                    <DialogTitle>사진 상세</DialogTitle>
                  </DialogHeader>
                  {selectedPhoto && (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex w-full justify-center overflow-hidden rounded-[1rem] bg-white/[0.06] sm:rounded-2xl">
                        <img
                          src={selectedPhoto.src}
                          alt={selectedPhoto.description}
                          className="max-h-[60vh] max-w-full object-contain"
                        />
                      </div>
                      <div className="w-full space-y-2">
                        <div className="flex items-center gap-2 !text-xs !text-white/60 sm:!text-sm">
                          <span className="font-medium !text-white/75">
                            작성자:
                          </span>
                          <span>
                            {selectedPhoto.user_name ||
                              (selectedPhoto.user_id === user?.id
                                ? '나'
                                : '알 수 없음')}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 !text-xs sm:!text-sm">
                          <span className="font-medium !text-white/75">
                            설명:
                          </span>
                          <span className="flex-1">
                            {selectedPhoto.description}
                          </span>
                        </div>
                        {selectedPhoto.created_at && (
                          <div className="flex items-center gap-2 !text-xs !text-white/60 sm:!text-sm">
                            <span className="font-medium !text-white/75">
                              업로드 날짜:
                            </span>
                            <span>
                              {new Date(
                                selectedPhoto.created_at,
                              ).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        )}
                        {user && selectedPhoto.user_id === user.id && (
                          <div className="border-t border-white/10 pt-3">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setIsDeleteDialogOpen(true)}
                              className="w-full"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              사진 삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.94))] !text-white shadow-2xl backdrop-blur-2xl sm:rounded-[1.5rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>사진 삭제 확인</AlertDialogTitle>
                    <AlertDialogDescription className="!text-white/60">
                      정말로 이 사진을 삭제하시겠습니까? 이 작업은 되돌릴 수
                      없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (selectedPhoto) {
                          deleteMutation.mutate({
                            photoId: selectedPhoto.id,
                            photoSrc: selectedPhoto.src,
                          });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteMutation.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          삭제 중...
                        </>
                      ) : (
                        '삭제'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
