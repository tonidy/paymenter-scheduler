export interface Ticket {
  id: number;
  title: string;
  status: "open" | "closed" | "replied";
  priority: "low" | "medium" | "high";
  user_id: number;
  order_id?: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  created_at: string;
  updated_at: string;
}
