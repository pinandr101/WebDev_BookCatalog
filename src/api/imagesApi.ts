import type { ImageUploadAnswer } from "../types";
import api from "./apiConfigs";

const imagesApi = {
    getImageUrl: (name: string) => `http://158.160.203.172:8080/image/${name}`,
    uploadImage: async (file: File): Promise<ImageUploadAnswer> =>{
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post<ImageUploadAnswer>('/image/url', formData);
        return response.data;
    },
    delete: async (name: string) => {
        const response = await api.delete(`/image/?name=${name}`);
        return response.data;
    }
}

export default imagesApi;
