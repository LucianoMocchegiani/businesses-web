import { apiService } from './apiService';

export interface CreateBusinessData {
  name: string;
  address?: string;
  phone?: string;
  owner_profile_name: string;
  owner_user_id: number;
}

export interface BusinessWithProfile {
  business: {
    business_id: number;
    business_name: string;
    business_address?: string;
    business_phone?: string;
    owner_id?: number;
    created_at: string;
    updated_at: string;
  };
  profile: {
    profile_id: number;
    profile_name: string;
    permissions: Array<{
      service_id: number;
      can_get: boolean;
      can_post: boolean;
      can_put: boolean;
      can_delete: boolean;
      service: {
        service_id: number;
        service_name: string;
        description?: string;
      };
    }>;
  };
}

export const businessService = {
  // Obtener negocios donde el usuario tiene perfiles
  async getUserBusinesses(): Promise<BusinessWithProfile[]> {
    return apiService.get<BusinessWithProfile[]>(`/businesses/user`);
  },

  // Crear negocio con perfil de owner
  async createWithOwner(data: CreateBusinessData) {
    return apiService.post('/businesses/with-owner', data);
  },

  // Obtener negocio por ID
  async getById(businessId: number) {
    return apiService.get(`/businesses/${businessId}`);
  }
};
