export interface StoreInfoEntity {
  id: number;
  code: string;
  parentCode?: string | null;
  name: string;
  fileKey: string;
  sort: number;
  status: number;
  link?: string | null;
  userAction: string;
  actionDate: string;
}
