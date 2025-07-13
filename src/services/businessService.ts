import { apiService } from './apiService';

export interface CreateBusinessData {
  name: string;
  address?: string;
  phone?: string;
  owner_profile_name: string;
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

class BusinessService {
  private readonly endpoint = '/businesses';

  // Obtener negocios donde el usuario tiene perfiles
  async getUserBusinesses(): Promise<BusinessWithProfile[]> {
    return apiService.get<BusinessWithProfile[]>(`${this.endpoint}/user`);
  }

  // Obtener negocio por ID
  async getById(businessId: number): Promise<any> {
    return apiService.get(`${this.endpoint}/${businessId}`);
  }

  // Crear negocio con perfil de owner
  async createWithOwner(data: CreateBusinessData): Promise<any> {
    return apiService.post(`${this.endpoint}/with-owner`, data);
  }

  // Verificar si un usuario tiene negocios
  async hasBusinesses(): Promise<boolean> {
    try {
      const businesses = await this.getUserBusinesses();
      return businesses.length > 0;
    } catch (error) {
      console.error('Error checking user businesses:', error);
      return false;
    }
  }
}

export const businessService = new BusinessService();
