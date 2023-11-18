export interface ICreateProductReview {
    product_id : number;
    customer_id : number;
    rating : number;
    review_text ? : string;
}

export interface IProductReviewDetails extends ICreateProductReview{
    review_id: number;
    review_date: Date;
}