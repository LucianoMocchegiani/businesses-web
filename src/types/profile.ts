export interface Profile {
  profile_id: number;
  business_id: number;
  profile_name: string;
  created_at: string;
  updated_at: string;
  business?: Business;
  permissions?: Permission[];
  profileUsers?: ProfileUser[];
}

export interface Permission {
  permission_id: number;
  profile_id: number;
  service_id: number;
  can_get: boolean;
  can_post: boolean;
  can_put: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface Service {
  service_id: number;
  service_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUser {
  profile_user_id: number;
  user_id: number;
  profile_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
  profile?: Profile;
}

export interface Business {
  business_id: number;
  business_name: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: number;
  firebase_uid: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileRequest {
  business_id: number;
  profile_name: string;
  permissions?: CreatePermissionRequest[];
}

export interface CreatePermissionRequest {
  service_id: number;
  can_get: boolean;
  can_post: boolean;
  can_put: boolean;
  can_delete: boolean;
}

export interface ProfileWithPermissions extends Profile {
  permissions: Permission[];
}
