import { useState, useCallback, Dispatch, SetStateAction } from "react";

const useImage = () => {
  const [image, setImage] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [errorLoadingImage, setErrorLoadingImage] = useState<boolean>(false);

  const loadImage = useCallback(async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      setLoadingImage(true);
      setErrorLoadingImage(false);
      const file = target.files[0];

      try {
        const base64 = await convertToBase64(file);
        setImage(base64);
      } catch (error) {
        setErrorLoadingImage(true);
        setImage("");
      } finally {
        setLoadingImage(false);
      }
    }
  }, []);

  const removeImage = useCallback(() => {
    setImage("");
    setErrorLoadingImage(false);
  }, []);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return {
    image,
    loadImage,
    loadingImage,
    removeImage,
    errorLoadingImage,
    setErrorLoadingImage,
  };
};

export default useImage;
