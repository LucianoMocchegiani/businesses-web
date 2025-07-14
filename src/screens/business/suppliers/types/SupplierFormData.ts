export interface SupplierFormData {
  supplier_name: string;
  contact_email?: string;
  contact_phone?: string;
  contact_location?: string;
  contact_description?: string;
}

export type DialogMode = 'create' | 'edit' | 'view';
