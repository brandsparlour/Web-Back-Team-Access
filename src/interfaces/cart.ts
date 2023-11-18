export interface ICreateCart {
    customer_id : number;
    products ? : string;
}

export interface ICartDetail extends ICreateCart {
    cart_id: number;
    created_at: Date;
    updated_at: Date;
}