import { imageUrls } from "@/constants";

 // Helper to get a random image from the array
export const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
};