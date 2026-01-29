import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Camera, Plus, Upload, X, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPhotos, uploadPhoto, deletePhoto } from "@/api/photos";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Photo } from "@/types/photo";

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
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
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
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="w-6 h-6 text-sky-600" />
            <span className="text-sky-600 font-medium tracking-wide">
              Gallery
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            전지 훈련 갤러리
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            자기 전에 생각 많이 날꺼야~
          </p>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-slate-500">
              사진을 불러오는 중...
            </div>
          ) : (
            <>
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`aspect-square rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.description}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}

              {/* 사진 추가 버튼 - 로그인된 사용자만 표시 */}
              {user && (
                <Dialog
                  open={isUploadDialogOpen}
                  onOpenChange={setIsUploadDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-sky-100 to-slate-100 flex flex-col items-center justify-center gap-3 hover:from-sky-200 hover:to-slate-200 transition-colors cursor-pointer group border-2 border-dashed border-sky-200 hover:border-sky-300">
                      <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8 text-sky-500" />
                      </div>
                      <span className="text-sm text-slate-500 font-medium">
                        사진 추가
                      </span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
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
                          className="mt-1"
                        />
                      </div>

                      {previewUrl && (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="미리보기"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
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
                          className="mt-1"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
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
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              업로드 중...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              업로드
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* 사진 상세 모달 */}
              <Dialog
                open={isPhotoModalOpen}
                onOpenChange={setIsPhotoModalOpen}
              >
                <DialogContent className="sm:max-w-xl rounded-2xl ">
                  <DialogHeader>
                    <DialogTitle>사진 상세</DialogTitle>
                  </DialogHeader>
                  {selectedPhoto && (
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="w-full flex justify-center bg-slate-50 rounded-lg overflow-hidden">
                        <img
                          src={selectedPhoto.src}
                          alt={selectedPhoto.description}
                          className="max-w-full max-h-[60vh] object-contain"
                        />
                      </div>
                      <div className="w-full space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">작성자:</span>
                          <span>
                            {selectedPhoto.user_name ||
                              (selectedPhoto.user_id === user?.id
                                ? "나"
                                : "알 수 없음")}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <span className="font-medium text-gray-600">
                            설명:
                          </span>
                          <span className="flex-1">
                            {selectedPhoto.description}
                          </span>
                        </div>
                        {selectedPhoto.created_at && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-medium">업로드 날짜:</span>
                            <span>
                              {new Date(
                                selectedPhoto.created_at
                              ).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                        )}
                        {/* 본인이 올린 사진인 경우 삭제 버튼 표시 */}
                        {user && selectedPhoto.user_id === user.id && (
                          <div className="pt-2 border-t">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setIsDeleteDialogOpen(true)}
                              className="w-full"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              사진 삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* 삭제 확인 다이얼로그 */}
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent>
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
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          삭제 중...
                        </>
                      ) : (
                        "삭제"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* 로그인 안내 메시지 - 로그인하지 않은 사용자에게 표시 */}
              {/* {!user && (
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-500 font-medium block">
                      사진 추가는
                    </span>
                    <span className="text-sm text-gray-500 font-medium block">
                      로그인 후 가능합니다
                    </span>
                  </div>
                </div>
              )} */}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
