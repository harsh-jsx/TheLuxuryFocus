const CLOUD_NAME = "djlm0st0d";
const UPLOAD_PRESET = "tlfimages"; // Unsigned preset

export const uploadToCloudinary = async (file, { resourceType } = {}) => {
  if (!file) return null;

  const detected =
    resourceType ??
    (file.type?.startsWith("video/") ? "video" : "image");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${detected}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const data = await response.json();
    return {
      secureUrl: data.secure_url,
      resourceType: data.resource_type,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error Details:", error);
    throw error;
  }
};
