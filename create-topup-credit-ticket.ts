import type { Ticket } from "./models/ticket";
import { getBalances } from "./services/balance/balance.service";
import {
  createTicket,
  getTickets,
  replyTicket,
} from "./services/ticket/ticket.service";

async function main() {
  try {
    // Get current time in WIB
    const now = new Date();
    const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);

    console.log(`🕒 Running at: ${wibTime} WIB`);

    const response = await getTickets();

    const pendingTickets = response.data.filter(
      (ticket: Ticket) =>
        ticket.status === "open" || ticket.status === "replied",
    );

    if (pendingTickets.length > 0) {
      console.log("Pending Tickets:", pendingTickets);
      // console.table(pendingTickets, [
      //   "id",
      //   "title",
      //   "status",
      //   "priority",
      // ]);
      const ticketToReply = pendingTickets[0]!;
      console.log(`Replying to ticket #${ticketToReply.id}...`);
      const replyResp = await replyTicket(
        ticketToReply.id,
        {
          message: "Min, ini friendly reminder buat top up credit. Makasih 😊.",
        },
      );
      if (replyResp) {
        console.log(`✅ Ticket #${ticketToReply.id} replied successfully!`);
      }
      return;
    }

    const balanceResult = await getBalances();
    // console.log("Balance:", balanceResult);

    if (balanceResult.balance >= 65) {
      console.log("Looks like your credits good — no ticket needed!");
      return;
    }

    // If below 65, continue to create a ticket
    console.log("Insufficient credit — proceeding to create a ticket...");

    const enableCreateTicket = process.env.ENABLE_CREATE_TICKET === "true";

    if (!enableCreateTicket) {
      console.log(
        "🚫 Create ticket is disabled via ENABLE_CREATE_TICKET env variable.",
      );
      return;
    }

    const ticketResp = await createTicket({
      title: "[IMPORTANT]Topup Credit from automation",
      message: "Min, tolong topup credit akun ane 😊.",
      priority: "high",
    });

    if (ticketResp) {
      console.log(`✅ Ticket ${ticketResp.id} created successfully!`);
    } else {
      console.log("❌ Failed to create ticket.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
