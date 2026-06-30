# Newsletter → Google Sheet

The footer/mobile newsletter form POSTs the email to a Google Apps Script Web App,
which appends a row to a Google Sheet. The frontend side is already wired
(`NEWSLETTER_ENDPOINT` in `src/components/Footer.tsx`) — you just need to deploy
the script and paste its URL in.

## 1. Create the sheet + script

1. Create (or open) the Google Sheet that should collect sign-ups.
2. **Extensions → Apps Script**.
3. Delete any starter code and paste this, then **Save**:

```js
// Tab the emails are written to (created automatically if missing).
const SHEET_NAME = 'Subscribers';

function doPost(e) {
  try {
    const email = ((e && e.parameter && e.parameter.email) || '').trim();
    if (!email) return ContentService.createTextOutput('missing email');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(['Timestamp', 'Email']); // header
    sheet.appendRow([new Date(), email]);

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

// Lets you sanity-check the deployment in a browser (optional).
function doGet() {
  return ContentService.createTextOutput('ok');
}
```

## 2. Deploy as a Web App

1. **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. **Execute as:** Me. **Who has access:** **Anyone**.
   (Required — the site posts anonymously. "Anyone" = anyone with the URL can POST;
   it can only append rows, it can't read the sheet.)
4. **Deploy**, then authorize the script when prompted.
5. Copy the **Web app URL** — it ends in `/exec`.

## 3. Paste the URL into the site

In `src/components/Footer.tsx`, set:

```ts
const NEWSLETTER_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Deploy the frontend and submit a test email — a new row should appear in the sheet.

## Notes

- The form sends the request with `mode: "no-cors"`, so the browser can't read the
  response. This means the UI shows "Subscribed ✓" once the request completes, even
  if the script erred — so confirm with a real test submission.
- To change what's stored (e.g. add the page/source, dedupe existing emails), edit
  the `appendRow(...)` line in the script and redeploy (**Deploy → Manage deployments
  → edit → New version**). The site URL stays the same across versions.
- If you ever rename/move the deployment you'll get a new `/exec` URL — update
  `NEWSLETTER_ENDPOINT` to match.
