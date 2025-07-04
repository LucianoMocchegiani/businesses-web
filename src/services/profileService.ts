import { apiService } from './apiService';
import { Profile, CreateProfileRequest, Permission, Service } from '@/types/profile';

class ProfileService {
  // Obtener perfiles por business_id
  async getByBusiness(businessId: number): Promise<Profile[]> {
    return apiService.get<Profile[]>(`/profiles?business_id=${businessId}`);
  }

  // Obtener perfiles de un usuario
  async getByUser(userId: number): Promise<Profile[]> {
    return apiService.get<Profile[]>(`/profiles/user/${userId}`);
  }

  // Obtener un perfil específico
  async getById(profileId: number): Promise<Profile> {
    return apiService.get<Profile>(`/profiles/${profileId}`);
  }

  // Obtener permisos de un perfil
  async getPermissions(profileId: number): Promise<Permission[]> {
    return apiService.get<Permission[]>(`/profiles/${profileId}/permissions`);
  }

  // Crear nuevo perfil
  async create(data: CreateProfileRequest): Promise<Profile> {
    return apiService.post<Profile>('/profiles', data);
  }

  // Crear permisos para un perfil
  async createPermissions(profileId: number, permissions: any[]): Promise<void> {
    return apiService.post<void>(`/profiles/${profileId}/permissions`, permissions);
  }

  // Actualizar perfil
  async update(profileId: number, data: Partial<CreateProfileRequest>): Promise<Profile> {
    return apiService.put<Profile>(`/profiles/${profileId}`, data);
  }

  // Eliminar perfil
  async delete(profileId: number): Promise<void> {
    return apiService.delete<void>(`/profiles/${profileId}`);
  }

  // Obtener servicios disponibles (para configurar permisos)
  async getServices(): Promise<Service[]> {
    return apiService.get<Service[]>('/services');
  }

  // Verificar si un usuario tiene perfiles asignados
  async hasProfiles(userId: number): Promise<boolean> {
    try {
      const profiles = await this.getByUser(userId);
      return profiles.length > 0;
    } catch (error) {
      console.error('Error checking user profiles:', error);
      return false;
    }
  }

  // Crear perfil básico para nuevo usuario
  async createBasicProfile(businessId: number, profileName: string): Promise<Profile> {
    const basicPermissions = [
      {
        service_id: 1, // customers
        can_get: true,
        can_post: true,
        can_put: true,
        can_delete: false
      },
      {
        service_id: 2, // products  
        can_get: true,
        can_post: true,
        can_put: true,
        can_delete: false
      },
      {
        service_id: 3, // sales
        can_get: true,
        can_post: true,
        can_put: true,
        can_delete: false
      }
    ];

    return this.create({
      business_id: businessId,
      profile_name: profileName,
      permissions: basicPermissions
    });
  }
}

export const profileService = new ProfileService();
