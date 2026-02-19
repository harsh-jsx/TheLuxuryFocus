const CLOUD_NAME = "djlm0st0d"; // Replace with your Cloudinary Cloud Name
const UPLOAD_PRESET = "tlfimages"; // Replace with your Upload Preset (Unsigned)
const api_key = "941775487481737"
const api_sec = "c8A7Y1xwFJzJiq2qAy8D2bl33nw"
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
        console.error("Cloudinary Upload Error Details:", error);
        if (error.message) console.error("Error Message:", error.message);
        throw error;
    }
};
