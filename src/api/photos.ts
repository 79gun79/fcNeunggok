import { supabase } from "@/lib/supabase";
import { Photo } from "@/types/photo";

export interface PhotoWithUser extends Photo {
  user_name?: string;
  user_email?: string;
  user_avatar?: string;
}

export const fetchPhotos = async (): Promise<PhotoWithUser[]> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("id, src, description, user_id, user_name, user_email, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Photos 조회 오류:", error);
      return getDefaultPhotos();
    }

    return data || getDefaultPhotos();
  } catch (error) {
    console.error("Photos fetch 실패:", error);
    // 네트워크 오류 등 발생 시 기본값 반환
    return getDefaultPhotos();
  }
};

export const uploadPhoto = async (file: File, description: string): Promise<{ success: boolean; error?: string; photo?: PhotoWithUser }> => {
  try {
    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "인증이 필요합니다. 로그인을 해주세요." };
    }

    // 파일 이름 생성 (타임스탬프 + 원본 파일명)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Supabase Storage에 파일 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(`user-uploads/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("파일 업로드 오류:", uploadError);
      return { success: false, error: "파일 업로드에 실패했습니다." };
    }

    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(uploadData.path);

    // 데이터베이스에 사진 정보 저장 (작성자 정보 포함)
    const { data: photoData, error: dbError } = await supabase
      .from('photos')
      .insert([
        {
          src: publicUrl,
          description: description,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          user_email: user.email,
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("데이터베이스 저장 오류:", dbError);
      // 업로드된 파일 삭제
      await supabase.storage
        .from('photos')
        .remove([uploadData.path]);
      return { success: false, error: "사진 정보 저장에 실패했습니다." };
    }

    // 작성자 정보가 포함된 사진 객체 반환
    const photoWithUser: PhotoWithUser = {
      ...photoData,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      user_email: user.email,
      user_avatar: user.user_metadata?.avatar_url,
    };

    return { success: true, photo: photoWithUser };
  } catch (error) {
    console.error("사진 업로드 실패:", error);
    return { success: false, error: "알 수 없는 오류가 발생했습니다." };
  }
};

export const deletePhoto = async (photoId: number, photoSrc: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "인증이 필요합니다. 로그인을 해주세요." };
    }

    // 먼저 사진 정보를 가져와서 본인이 올린 사진인지 확인
    const { data: photoData, error: fetchError } = await supabase
      .from('photos')
      .select('user_id')
      .eq('id', photoId)
      .single();

    if (fetchError || !photoData) {
      return { success: false, error: "사진을 찾을 수 없습니다." };
    }

    if (photoData.user_id !== user.id) {
      return { success: false, error: "본인이 올린 사진만 삭제할 수 있습니다." };
    }

    // Storage에서 파일 삭제 (URL에서 경로 추출)
    try {
      // publicUrl에서 경로 추출
      const url = new URL(photoSrc);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/photos\/(.+)/);
      if (pathMatch) {
        const filePath = pathMatch[1];
        const { error: storageError } = await supabase.storage
          .from('photos')
          .remove([filePath]);

        if (storageError) {
          console.warn("Storage 파일 삭제 실패 (계속 진행):", storageError);
          // Storage 삭제 실패해도 DB 삭제는 진행
        }
      }
    } catch (error) {
      console.warn("파일 경로 파싱 실패 (계속 진행):", error);
    }

    // 데이터베이스에서 사진 정보 삭제
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)
      .eq('user_id', user.id); // 추가 보안: user_id도 확인

    if (deleteError) {
      console.error("데이터베이스 삭제 오류:", deleteError);
      return { success: false, error: "사진 삭제에 실패했습니다." };
    }

    return { success: true };
  } catch (error) {
    console.error("사진 삭제 실패:", error);
    return { success: false, error: "알 수 없는 오류가 발생했습니다." };
  }
};

// 기본 photos 데이터 (fallback)
const getDefaultPhotos = (): Photo[] => [
  { id: 1, src: "/img1.png", description: "문제영" },
];
