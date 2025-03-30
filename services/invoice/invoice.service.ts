import type { InvoicesResponse } from "../../dtos/invoice";
import type { Invoice } from "../../models/invoice";

const BaseURL = process.env.BASE_URL;
const UserToken = process.env.USER_TOKEN;

if (!BaseURL) {
  throw new Error("Missing BASE_URL in environment variables");
}

if (!UserToken) {
  throw new Error("Missing USER_TOKEN in environment variables");
}

export async function getInvoices(): Promise<InvoicesResponse> {
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
    `${BaseURL}/api/client/v1/invoices`,
    requestOptions,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fetch error:", response.status, errorText);
    throw new Error(`Failed to fetch invoices: ${errorText}`);
  }

  const json = await response.json();
  return json as InvoicesResponse;
}

export async function payInvoice(
  id: number,
  method: "credits" | string,
): Promise<Invoice> {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${UserToken}`,
    },
    body: JSON.stringify({ payment_method: method }),
    redirect: "follow",
  };

  const response = await fetch(
    `${BaseURL}/api/client/v1/invoices/${id}/pay`,
    requestOptions,
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Payment error for invoice ${id}:`,
      response.status,
      errorText,
    );
    throw new Error(`Failed to pay invoice ${id}: ${errorText}`);
  }

  const json = (await response.json()) as { data: Invoice };
  return json.data;
}
