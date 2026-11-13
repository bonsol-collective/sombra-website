import { DEMO_FIELDS, parseDemoRequest, sheetCell } from "@/lib/demoRequest";

/**
 * Stores one demo request as one row of a Google Sheet (setup: docs/demo-sheet.md).
 * The sheet is behind a small Apps Script web app. Its URL and its secret stay on the server.
 */
const MAX_BODY = 20_000;
const refuse = (status: number, error: string, field?: string) => Response.json({ ok: false, error, field }, { status });

export async function POST(request: Request) {
  // A form on another website must not post here.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) return refuse(403, "origin");

  const text = await request.text();
  if (text.length > MAX_BODY) return refuse(413, "too_large");
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return refuse(400, "invalid");
  }
  const extra = body !== null && typeof body === "object" ? (body as Record<string, unknown>) : {};
  // The honeypot field is filled: a bot. It gets a success answer and nothing is stored.
  if (extra._gotcha) return Response.json({ ok: true });

  const parsed = parseDemoRequest(body);
  if (!parsed.ok) return refuse(400, "invalid", parsed.field);

  const captchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (captchaSecret) {
    const token = typeof extra.captcha === "string" ? extra.captcha : "";
    const checked = token
      ? await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          body: new URLSearchParams({ secret: captchaSecret, response: token }),
          signal: AbortSignal.timeout(10_000),
        })
          .then((r) => r.json() as Promise<{ success?: boolean }>)
          .catch(() => null)
      : null;
    if (checked?.success !== true) return refuse(400, "captcha");
  }

  const url = process.env.DEMO_SHEET_URL;
  const secret = process.env.DEMO_SHEET_SECRET;
  if (!url || !secret) {
    console.error("demo request: DEMO_SHEET_URL or DEMO_SHEET_SECRET is not set");
    return refuse(503, "not_configured");
  }
  try {
    const answer = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, row: DEMO_FIELDS.map((field) => sheetCell(parsed.value[field])) }),
      signal: AbortSignal.timeout(15_000),
    });
    const result = (await answer.json().catch(() => null)) as { ok?: boolean } | null;
    if (!answer.ok || result?.ok !== true) throw new Error(`sheet answered ${answer.status}`);
  } catch (error) {
    // No field of the request goes to the log.
    console.error("demo request: the sheet did not store the row:", error instanceof Error ? error.message : "unknown");
    return refuse(502, "store_failed");
  }
  return Response.json({ ok: true });
}
