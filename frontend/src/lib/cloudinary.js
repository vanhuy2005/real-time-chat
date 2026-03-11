/**
 * Transform Cloudinary URL to get the right size variant.
 * Similar to how Facebook serves different image sizes for different contexts.
 */
export const getAvatarUrl = (url, size = 200) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/w_${size},h_${size},c_fill,g_face,f_auto,q_auto/`,
  );
};

