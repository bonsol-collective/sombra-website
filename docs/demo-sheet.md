# Demo requests: the Google Sheet

The form on `/demo` (the "Contact", "Book a demo" and "Request demo" buttons all open it) posts to `/api/demo`.
That route checks the request and adds one row to a Google Sheet. The sheet is behind a small Apps Script web app,
so the site needs no Google account key.

## Setup (one time, about 5 minutes)

1. Make a Google Sheet. Put these headings in row 1:
   `Received | First name | Last name | Job title | Work email | Company | Message`
2. In the sheet: **Extensions > Apps Script**. Replace the code with the script below.
3. Make a long random secret (for example `openssl rand -hex 32`) and put it in the `SECRET` line.
4. **Deploy > New deployment > Web app**. "Execute as": **Me**. "Who has access": **Anyone**. Copy the web app URL.
5. In Vercel (**Project > Settings > Environment Variables**, Production and Preview) set:
   - `DEMO_SHEET_URL`: the web app URL
   - `DEMO_SHEET_SECRET`: the same secret
6. Deploy the site again, then send one test request from `/demo`.

"Anyone" is necessary because the site calls the URL with no Google login. The script stores nothing without the secret.

```js
const SECRET = 'paste the secret here';

function doPost(e) {
  const answer = ok => ContentService.createTextOutput(JSON.stringify({ ok })).setMimeType(ContentService.MimeType.JSON);
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET || !Array.isArray(body.row) || body.row.length !== 6) return answer(false);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([new Date(), ...body.row.map(String)]);
    } finally {
      lock.releaseLock();
    }
    return answer(true);
  } catch (error) {
    return answer(false);
  }
}
```

After a change to the script, make a **new version** of the deployment (**Deploy > Manage deployments > Edit**). The URL stays the same.

## Optional: reCAPTCHA

The form shows a reCAPTCHA v2 checkbox when `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set. Set `RECAPTCHA_SECRET_KEY` (the secret
of the same key pair) too, and the route refuses a request without a correct captcha answer. With no keys, the hidden
honeypot field is the only bot check.

## Behaviour

| Case | Answer | The user sees |
|---|---|---|
| Stored | 200 | "Thanks — we'll be in touch shortly." |
| A bad or missing field | 400 | "Check the fields and try again." |
| A bad captcha answer | 400 | "Complete the captcha, then submit again." |
| The variables are not set | 503 | "We could not send your request. Try again, or email sombra@bonsol.org." |
| The sheet did not store the row | 502 | The same message |

A value that starts with `=`, `+`, `-` or `@` gets a leading apostrophe, so the sheet never runs it as a formula.
The server log gets no field of a request.

## Local test

Put the two variables in `.env.local` (not committed), run `npm run dev`, and submit the form.
