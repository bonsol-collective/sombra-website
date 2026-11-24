import assert from "node:assert/strict";
import { test } from "node:test";
import { readChoice, writeChoice } from "./consent.ts";
import { GTM_SRC, clearGaCookies, googleTagEnabled, startGoogleTag } from "./googleTag.ts";

const DAY = 24 * 60 * 60 * 1000;
const T = Date.UTC(2026, 10, 24);

test("a stored choice holds for 182 days", () => {
  for (const choice of ["granted", "denied"] as const) {
    const raw = writeChoice(choice, T);
    assert.equal(readChoice(raw, T), choice);
    assert.equal(readChoice(raw, T + 181 * DAY), choice);
    assert.equal(readChoice(raw, T + 183 * DAY), null);
  }
});

test("a missing, broken or other-version choice asks again", () => {
  for (const raw of [
    null,
    "x",
    "{}",
    "null",
    '{"v":2,"analytics":"granted","at":0}',
    `{"v":1,"analytics":"yes","at":${T}}`,
    `{"v":1,"analytics":"granted","at":"${T}"}`,
    `{"v":1,"analytics":"granted","at":${T + DAY}}`,
  ]) {
    assert.equal(readChoice(raw, T), null, String(raw));
  }
});

test("the tag runs on the production site only", () => {
  assert.equal(googleTagEnabled("production"), true);
  for (const env of ["preview", "development", undefined]) assert.equal(googleTagEnabled(env), false);
});

/** A window and a document with only what `startGoogleTag` uses. */
function fakePage() {
  const appended: { async: boolean; src: string }[] = [];
  const win: { dataLayer?: unknown[] } = {};
  const doc = {
    createElement: (_tag: "script") => ({ async: false, src: "" }),
    head: { appendChild: (el: { async: boolean; src: string }) => void appended.push(el) },
  };
  return { win, doc, appended };
}

test("the tag starts with ads denied, then loads gtm.js one time", () => {
  const { win, doc, appended } = fakePage();
  startGoogleTag(win, doc);
  startGoogleTag(win, doc);
  const entries = (win.dataLayer ?? []).map((e) => Array.from(e as ArrayLike<unknown>));
  assert.equal(entries.length, 3);
  assert.deepEqual(entries[0], [
    "consent",
    "default",
    { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" },
  ]);
  assert.deepEqual(entries[1], ["set", "ads_data_redaction", true]);
  assert.equal(entries[2]![0], "js");
  assert.ok(entries[2]![1] instanceof Date);
  // gtag pushes its `arguments` object: Google reads an array as another kind of entry.
  assert.ok(!Array.isArray(win.dataLayer![0]));
  assert.deepEqual(appended, [{ async: true, src: GTM_SRC }]);
  assert.equal(GTM_SRC, "https://www.googletagmanager.com/gtm.js?id=GTM-KBGCBD3Q");
});

test("reject deletes the GA cookies for the host and each parent domain", () => {
  const writes: string[] = [];
  const doc = {
    get cookie() {
      return "a=1; _ga=x; _ga_ABC=y";
    },
    set cookie(v: string) {
      writes.push(v);
    },
  };
  clearGaCookies(doc, "www.sombra.tech");
  const expire = (name: string, domain?: string) =>
    `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
  assert.deepEqual(new Set(writes), new Set([
    expire("_ga"),
    expire("_ga", "www.sombra.tech"),
    expire("_ga", "sombra.tech"),
    expire("_ga_ABC"),
    expire("_ga_ABC", "www.sombra.tech"),
    expire("_ga_ABC", "sombra.tech"),
  ]));
});
