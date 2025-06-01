import { apiRequest } from '@/shared/utils/apiHelper';
import axios from 'axios';

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

const CLOUD_NAME = 'dcnr3iflj';
const UPLOAD_PRESET = 'preset_equipo';

export const cloudinaryUploadApi = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET); // reemplaza con el de tu cuenta
    formData.append('cloud_name', CLOUD_NAME); // reemplaza con el tuyo

    const result = await apiRequest<CloudinaryUploadResponse>(
      axios.post('https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload', formData),
      {
        error: 'Error al subir imagen',
        loading: '', // <- evita mostrar loader global
      }
    );

    return result.secure_url;
  },
};