export interface ICreateProductBrand {
  brand_name: string;
  description?: string;
  brand_logo?: string;
  brand_website?: string;
}

export interface IProductBrandDetails extends ICreateProductBrand {
  brand_id: number;
  created_at: Date;
  updated_at: Date;
}
