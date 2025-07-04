export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  notes?: string;
}

export type DialogMode = 'create' | 'edit' | 'view';
