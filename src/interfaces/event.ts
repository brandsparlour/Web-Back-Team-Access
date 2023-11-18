export interface ICreateEvent {
  company_id:number;
  event_name: string;
  description?: string;
  event_date: Date;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_category?: string;
  organizer?: string;
  contact_info?: string;
  registration_link?: string;
  registration_fee?: number;
  event_capacity?: number;
  event_image?: string;
  status: "Upcoming" | "Past" | "Cancelled";
  registration_status: "Open" | "Closed";
  payment_type?: 'PAID'| 'FREE';
}

export interface IEventDetails extends ICreateEvent{
  event_id: number;
}