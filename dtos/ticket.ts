import type { Ticket } from "../models/ticket";
import type { BaseResponse } from "./base-response";

export type TicketsResponse = BaseResponse<Ticket[]>;

export interface CreateTicketRequest {
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
}

export interface ReplyTicketRequest {
  message: string;
}
