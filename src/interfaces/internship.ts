export interface ICreateInternship{
    user_id: number;
    company_id: number;
    link_id: number;
    intern_type: 'Organizer'| 'Influencer';
    course: string;
    year: number;
    college: string;
    university: string;
    photo: string;
    identity_card: string;
    resume: string;
    payment_status: 'PAID'| 'PENDING';
    created_at?: Date;
    updated_at?: Date;
}

export interface IIntership extends ICreateInternship{
    internship_id: number;
}