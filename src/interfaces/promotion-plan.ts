export interface ICreatePromotionPlan{
    plan_name: string;
    description: string;
    price: number;
    currency: string;
    billing_cycle: 'Monthly'| 'Annually',
    features: string,
    customization_options: string,
    availability:'Available'| 'Not Available',
}

export interface IPromotionPlan extends ICreatePromotionPlan{
    plan_id: number;
}