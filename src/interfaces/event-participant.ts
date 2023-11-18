export interface ICreateEventParticipant{
    company_id : number;
    customer_id : number;
    event_id : number;
    name ? : string;
    email ? : string;
    phone? : string; 
    registration_date ? : Date;
    payment_status? :'PAID' | 'PENDING';
    additional_info ? : string;
}

export interface IEventParticipantDetails extends ICreateEventParticipant {
    participant_id: number;
}