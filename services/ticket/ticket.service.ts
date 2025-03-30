import type {
  CreateTicketRequest,
  ReplyTicketRequest,
  TicketsResponse,
} from "../../dtos/ticket";
import type { Ticket } from "../../models/ticket";

const BaseURL = process.env.BASE_URL;
const UserToken = process.env.USER_TOKEN;

if (!BaseURL) {
  throw new Error("Missing BASE_URL in environment variables");
}

if (!UserToken) {
  throw new Error("Missing USER_TOKEN in environment variables");
}

export async function getTickets(): Promise<TicketsResponse> {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "",
      "Accept": "application/json",
      "Authorization": `Bearer ${UserToken}`,
    },
    redirect: "follow",
  };

  const response = await fetch(
    `${BaseURL}/api/client/v1/tickets`,
    requestOptions,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fetch error:", response.status, errorText);
    throw new Error(`Failed to fetch tickets: ${errorText}`);
  }

  const json = await response.json();
  return json as TicketsResponse;
}

export async function createTicket(req: CreateTicketRequest): Promise<Ticket> {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${UserToken}`,
    },
    body: JSON.stringify(req),
    redirect: "follow",
  };

  const response = await fetch(
    `${BaseURL}/api/client/v1/tickets`,
    requestOptions,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Error for creating new ticket:`,
      response.status,
      errorText,
    );
    throw new Error(`Failed to create new ticket: ${errorText}`);
  }

  const json = (await response.json()) as { data: { ticket: Ticket } };
  return json.data.ticket;
}

export async function replyTicket(
  ticketId: number,
  req: ReplyTicketRequest,
): Promise<string> {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${UserToken}`,
    },
    body: JSON.stringify(req),
    redirect: "follow",
  };

  const response = await fetch(
    `${BaseURL}/api/client/v1/tickets/${ticketId}/reply`,
    requestOptions,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Error for replying the ticket ${ticketId}: `,
      response.status,
      errorText,
    );
    throw new Error(`Failed to reply the ticket ${ticketId}: ${errorText}`);
  }

  const json = (await response.json()) as { message: string };
  return json.message;
}
