export interface ICreateProductCategory {
    category_name : string;
    parent_category : number;
    description ? : string;
}

export interface IProductCategoryDetails extends ICreateProductCategory {
    category_id : number;
}