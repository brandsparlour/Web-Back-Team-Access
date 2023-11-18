export interface ICreateProductWishList {
  customer_id: number;
  products?: string;
}

export interface IProductWishList extends ICreateProductWishList {
  wishlist_id: number;
  added_date: Date;
}
