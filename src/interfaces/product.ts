export interface ICreateProduct {
    product_name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    category: string;
    brand: string;
    product_images?: string;
    product_SKU?: string;
    average_rating?: number;
    number_of_reviews?: number;
    material?: string;
    dimensions?: string;
    weight?: string;
    color?: string;
    size?: string;
}

export interface IProductDetails extends ICreateProduct {
    product_id: number;
    created_at: Date;
    updated_at: Date;
}
