const CLOUD_NAME = "YOUR_CLOUD_NAME"; // Replace with your Cloudinary Cloud Name
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // Replace with your Upload Preset (Unsigned)

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    // formData.append("cloud_name", CLOUD_NAME); // Optional if using the URL below with cloud name embedded

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Image upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
