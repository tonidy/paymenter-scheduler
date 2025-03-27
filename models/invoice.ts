import type { BaseResponse } from "../dtos/base-response";

export interface Invoice {
  id: number;
  user_id: number;
  order_id: number;
  status: "pending" | "paid" | "cancelled";
  paid_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  paid_with: string;
  paid_reference: string | null;
  cancelled_at: string | null;
}
