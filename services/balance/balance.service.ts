import * as cheerio from "cheerio";

const BaseURL = process.env.BASE_URL;
const Cookie = process.env.COOKIE;

if (!BaseURL) {
  throw new Error("Missing BASE_URL in environment variables");
}

if (!Cookie) {
  throw new Error("Missing COOKIE in environment variables");
}

export async function getBalances(): Promise<
  { currency: string; balance: number }
> {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Cookie": Cookie as string,
      },
      redirect: "follow",
    };

    const response = await fetch(`${BaseURL}/credits`, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch error:", response.status, errorText);
      throw new Error(`Failed to fetch credits page: ${errorText}`);
    }

    const html = await response.text();
    // console.log("HTML response:", html);
    const $ = cheerio.load(html);

    const selector =
      "#mobile-menu > div > div.ml-auto.items-center.justify-end.hidden.md\\:flex > a > span";
    const element = $(selector).first();
    // console.log("Element found:", element.html());
    // console.log("Element text:", element.text());

    if (!element.length) {
      throw new Error("Element not found using selector");
    }

    const rawText = element.text().trim(); // e.g. "Rp 62.00" with weird spacing
    const cleanedText = rawText.replace(/\s+/g, " "); // Normalize spacing

    // Match currency + amount (e.g. "Rp 62.00")
    const match = cleanedText.match(/^([A-Za-z]+)\s+([\d.,]+)/);

    if (!match || !match[1] || !match[2]) {
      throw new Error(
        `Could not parse currency and balance from text: "${cleanedText}"`,
      );
    }

    const currency = match[1];
    const balance = parseFloat(match[2].replace(/,/g, ""));

    if (isNaN(balance)) {
      throw new Error("Parsed balance is not a number");
    }

    return {
      currency,
      balance,
    };
  } catch (err) {
    console.error("getBalances error:", err);
    throw err;
  }
}
