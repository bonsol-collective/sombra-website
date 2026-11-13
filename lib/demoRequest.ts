/** The fields of the demo request form, in the order of the sheet columns. */
export const DEMO_FIELDS = ["firstName", "lastName", "jobTitle", "email", "company", "message"] as const;
export type DemoField = (typeof DEMO_FIELDS)[number];
export type DemoRequest = Record<DemoField, string>;

const MAX_LENGTH: Record<DemoField, number> = {
  firstName: 100,
  lastName: 100,
  jobTitle: 150,
  email: 254,
  company: 150,
  message: 4000,
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Checks a request from the form. The server does not trust the checks of the browser. `field` is the first bad field. */
export function parseDemoRequest(input: unknown): { ok: true; value: DemoRequest } | { ok: false; field: DemoField } {
  const source = input !== null && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const value = {} as DemoRequest;
  for (const field of DEMO_FIELDS) {
    const raw = source[field] ?? (field === "message" ? "" : undefined);
    if (typeof raw !== "string") return { ok: false, field };
    // Control characters have no use in a name. The message keeps its new lines.
    const clean = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
    const text = (field === "message" ? clean.replace(/\r\n?/g, "\n") : clean.replace(/\s+/g, " ")).trim();
    if (text.length > MAX_LENGTH[field]) return { ok: false, field };
    if (field !== "message" && !text) return { ok: false, field };
    if (field === "email" && !EMAIL.test(text)) return { ok: false, field };
    value[field] = text;
  }
  return { ok: true, value };
}

/** A spreadsheet runs a cell that starts with `=`, `+`, `-` or `@` as a formula. A leading apostrophe makes it plain text. */
export function sheetCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}
