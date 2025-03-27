import type { Invoice } from "../models/invoice";
import type { BaseResponse } from "./base-response";

export type InvoicesResponse = BaseResponse<Invoice[]>;
