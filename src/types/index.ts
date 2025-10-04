export interface StoreInfoEntity {
  id: number;
  code: string;
  parentCode?: string | null;
  name: string;
  fileKey?: string | null;
  sort: number;
  status: number;
  link?: string | null;
  userAction: string;
  actionDate: string;
}
