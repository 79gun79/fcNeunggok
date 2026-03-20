import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Plus, Trash2, Upload, X } from "lucide-react";
import { fetchPhotos, uploadPhoto, deletePhoto } from "@/api/photos";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useToast } from "@/hooks/use-toast";
import { Photo } from "@/types/photo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const GallerySection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["photos"],
    queryFn: fetchPhotos,
    staleTime: 5 * 60 * 1000,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, description }: { file: File; description: string }) =>
      uploadPhoto(file, description),
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "사진 업로드 성공",
          description: "갤러리에 사진이 추가되었습니다.",
        });
        queryClient.invalidateQueries({ queryKey: ["photos"] });
        setIsUploadDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "업로드 실패",
          description: result.error || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "업로드 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
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
          title: "사진 삭제 성공",
          description: "사진이 삭제되었습니다.",
        });
        queryClient.invalidateQueries({ queryKey: ["photos"] });
        setIsPhotoModalOpen(false);
        setIsDeleteDialogOpen(false);
        setSelectedPhoto(null);
      } else {
        toast({
          title: "삭제 실패",
          description: result.error || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "삭제 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
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
        title: "입력 오류",
        description: "파일과 설명을 모두 입력해주세요.",
        variant: "destructive",
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
    setDescription("");
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const photoCountLabel = `${photos.length.toString().padStart(2, "0")} Photos`;

  return (
    <section
      id="gallery"
      ref={ref}
      className="scroll-mt-24 px-3 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="container mx-auto">
        <div
          className={`luxury-panel mb-8 rounded-[1.5rem] p-4 sm:mb-10 sm:rounded-[2rem] sm:p-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-4 flex flex-col items-start gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3 py-2 text-xs font-medium tracking-wide text-primary/80 sm:px-4 sm:text-sm">
              <Camera className="h-4 w-4" />
              Community Gallery
            </div>
            <div className="rounded-full border border-border/70 bg-white/80 px-3 py-2 text-xs text-muted-foreground sm:px-4 sm:text-sm">
              {photoCountLabel}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="mb-3 text-3xl font-bold text-foreground sm:mb-4 sm:text-4xl md:text-5xl">
                FC 능곡의 기록을 모아보는
                <span className="text-gradient"> 프리미엄 포토 아카이브</span>
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-lg sm:leading-7">
                팀의 순간을 차분한 브라운 톤의 갤러리로 정리했습니다. 로그인한
                멤버는 새로운 사진을 업로드하고, 자신이 올린 기록을 직접 관리할 수
                있습니다.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-primary/15 bg-primary px-4 py-3 text-xs leading-5 text-primary-foreground shadow-lg shadow-primary/20 sm:px-5 sm:py-4 sm:text-sm">
              {user
                ? "지금 이 순간도 새로운 기록으로 남겨보세요."
                : "로그인 후 업로드와 삭제 기능을 사용할 수 있습니다."}
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {isLoading ? (
            <div className="col-span-full luxury-panel rounded-[1.5rem] py-12 text-center text-sm text-muted-foreground sm:rounded-[1.75rem] sm:py-16 sm:text-base">
              사진을 불러오는 중...
            </div>
          ) : photos.length === 0 ? (
            <div className="col-span-full luxury-panel rounded-[1.5rem] px-5 py-12 text-center sm:rounded-[1.75rem] sm:px-6 sm:py-16">
              <p className="text-base font-semibold text-foreground sm:text-lg">
                아직 등록된 사진이 없습니다.
              </p>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                첫 번째 장면을 업로드해 커뮤니티 아카이브를 시작해보세요.
              </p>
            </div>
          ) : (
            <>
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`group relative aspect-[0.92] cursor-pointer overflow-hidden rounded-[1.35rem] border border-white/40 bg-white/70 shadow-[0_18px_40px_-20px_rgba(86,57,32,0.35)] transition-all duration-500 sm:aspect-[0.95] sm:rounded-[1.75rem] ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                    <p className="max-h-12 overflow-hidden text-base font-semibold leading-6 sm:max-h-14 sm:text-lg sm:leading-7">
                      {photo.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-white/80 sm:mt-3 sm:text-sm">
                      <span className="truncate">
                        {photo.user_name || "FC 능곡 멤버"}
                      </span>
                      {photo.created_at && (
                        <span>
                          {new Date(photo.created_at).toLocaleDateString("ko-KR")}
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
                    <div className="group flex aspect-[0.92] cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.35rem] border border-dashed border-primary/30 bg-[linear-gradient(145deg,rgba(255,250,245,0.92),rgba(229,215,201,0.8))] px-5 text-center transition-all hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_18px_40px_-20px_rgba(86,57,32,0.35)] sm:aspect-[0.95] sm:gap-4 sm:rounded-[1.75rem] sm:px-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 shadow-sm transition-transform group-hover:scale-110 sm:h-16 sm:w-16">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-foreground sm:text-base">
                          사진 업로드
                        </span>
                        <span className="mt-2 block text-xs leading-5 text-muted-foreground sm:text-sm">
                          새로운 순간을 아카이브에 추가하세요.
                        </span>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] border-border/70 bg-[linear-gradient(160deg,rgba(255,250,245,0.98),rgba(244,236,227,0.98))] p-4 shadow-2xl sm:max-w-md sm:rounded-[1.75rem] sm:p-6">
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
                          className="mt-1 border-border/80 bg-white/80"
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
                                fileInputRef.current.value = "";
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
                          className="mt-1 min-h-28 border-border/80 bg-white/80"
                        />
                      </div>

                      <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                        <Button
                          onClick={handleDialogClose}
                          variant="outline"
                          className="flex-1"
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
                          className="flex-1"
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
                <DialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] border-border/70 bg-[linear-gradient(160deg,rgba(255,250,245,0.98),rgba(244,236,227,0.98))] shadow-2xl sm:max-w-xl sm:rounded-[1.75rem]">
                  <DialogHeader>
                    <DialogTitle>사진 상세</DialogTitle>
                  </DialogHeader>
                  {selectedPhoto && (
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex w-full justify-center overflow-hidden rounded-[1rem] bg-[#f2e8dd] sm:rounded-2xl">
                        <img
                          src={selectedPhoto.src}
                          alt={selectedPhoto.description}
                          className="max-h-[60vh] max-w-full object-contain"
                        />
                      </div>
                      <div className="w-full space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                          <span className="font-medium">작성자:</span>
                          <span>
                            {selectedPhoto.user_name ||
                              (selectedPhoto.user_id === user?.id ? "나" : "알 수 없음")}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs sm:text-sm">
                          <span className="font-medium text-muted-foreground">
                            설명:
                          </span>
                          <span className="flex-1">{selectedPhoto.description}</span>
                        </div>
                        {selectedPhoto.created_at && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                            <span className="font-medium">업로드 날짜:</span>
                            <span>
                              {new Date(selectedPhoto.created_at).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                        )}
                        {user && selectedPhoto.user_id === user.id && (
                          <div className="border-t border-border/70 pt-3">
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
                <AlertDialogContent className="max-w-[calc(100vw-1rem)] rounded-[1.25rem] border-border/70 bg-[linear-gradient(160deg,rgba(255,250,245,0.98),rgba(244,236,227,0.98))] shadow-2xl sm:rounded-[1.5rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>사진 삭제 확인</AlertDialogTitle>
                    <AlertDialogDescription>
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
                        "삭제"
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
