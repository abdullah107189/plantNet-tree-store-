import axios from "axios";
export const useImageApi = async (getImage) => {
    const formData = new FormData()
    formData.append('image', getImage)

    const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_KEY}`, formData)
    return data?.data?.url
};
