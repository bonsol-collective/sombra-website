import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDemoRequest, sheetCell } from "./demoRequest.ts";

const good = {
  firstName: " Ada ",
  lastName: "Lovelace",
  jobTitle: "CTO",
  email: "ada@example.com",
  company: "Engines Ltd",
  message: "Line one\nLine two",
};

test("accepts a full request and trims it", () => {
  assert.deepEqual(parseDemoRequest(good), { ok: true, value: { ...good, firstName: "Ada" } });
});

test("the message is optional, the other fields are not", () => {
  const { message: _, ...rest } = good;
  assert.deepEqual(parseDemoRequest(rest), { ok: true, value: { ...good, firstName: "Ada", message: "" } });
  for (const field of ["firstName", "lastName", "jobTitle", "email", "company"])
    assert.deepEqual(parseDemoRequest({ ...good, [field]: "   " }), { ok: false, field });
});

test("refuses a value that is not text, a bad email and a value that is too long", () => {
  assert.deepEqual(parseDemoRequest(null), { ok: false, field: "firstName" });
  assert.deepEqual(parseDemoRequest("text"), { ok: false, field: "firstName" });
  assert.deepEqual(parseDemoRequest({ ...good, company: 7 }), { ok: false, field: "company" });
  for (const email of ["ada", "ada@example", "a b@example.com", "ada@@example.com"])
    assert.deepEqual(parseDemoRequest({ ...good, email }), { ok: false, field: "email" });
  assert.deepEqual(parseDemoRequest({ ...good, firstName: "a".repeat(101) }), { ok: false, field: "firstName" });
  assert.deepEqual(parseDemoRequest({ ...good, message: "a".repeat(4001) }), { ok: false, field: "message" });
});

test("removes control characters, and keeps a new line only in the message", () => {
  const parsed = parseDemoRequest({ ...good, company: "Eng\u0000ines\nLtd", message: "a\u0007b\nc" });
  assert.equal(parsed.ok && parsed.value.company, "Engines Ltd");
  assert.equal(parsed.ok && parsed.value.message, "ab\nc");
});

test("a sheet cell never starts a formula", () => {
  for (const value of ["=HYPERLINK(1)", "+1", "-1", "@SUM(A1)", "\t=1"]) assert.equal(sheetCell(value), "'" + value);
  assert.equal(sheetCell("Ada"), "Ada");
  assert.equal(sheetCell(""), "");
});
