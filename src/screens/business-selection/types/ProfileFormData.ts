export interface CreateBusinessFormData {
  businessName: string;
  address?: string;
  phone?: string;
  ownerProfileName: string;
}

export interface ProfileFormData {
  profileName: string;
  businessName: string;
  permissions: {
    modifyProducts: boolean;
    modifyClients: boolean;
    modifyProviders: boolean;
    modifySales: boolean;
    modifyBuys: boolean;
    accessToStatistics: boolean;
    accessToBuys: boolean;
    accessToProviders: boolean;
  };
}

export type DialogMode = 'create' | 'edit' | 'view';
export type BusinessDialogMode = 'create-business' | 'search-business';
