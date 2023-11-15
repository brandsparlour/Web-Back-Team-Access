export interface ICreatePromotionPlan{
    plan_name: string;
    description: string;
    price: number;
    currency: string;
    billing_cycle: 'Monthly'| 'Annually',
    features: string,
    customization_options: string,
    availability:'Available'| 'Not Available',
    created_at?: Date,
    updated_at?: Date
}

export interface IPromotionPlan extends ICreatePromotionPlan{
    plan_id: number;
}