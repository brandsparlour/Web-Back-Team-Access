export interface ICreateEvent {
  company_id:number;
  event_name: string;
  description: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_category?: string;
  organizer?: string;
  contact_info?: string;
  registration_link?: string;
  ticket_price?: number;
  event_capacity?: number;
  event_image?: string;
  status: "Upcoming" | "Past" | "Cancelled";
  registration_status: "Open" | "Closed";
}

export interface IEventDetails extends ICreateEvent{
  event_id: number;
}