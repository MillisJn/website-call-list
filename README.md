# Website Call List

Cincinnati-area small businesses with no website, for website sales calls. The page is `index.html`, served by GitHub Pages.

## Call logging setup (one time)

Call status and notes are saved to a Google Sheet through a small Apps Script.

1. Create a new Google Sheet (any name).
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the starter code and paste in everything from `setup/Code.gs`.
4. Change `PASSCODE` at the top to your team passcode, then click **Save**.
5. Click **Deploy → New deployment**, choose type **Web app**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy**. Approve the permissions prompt.
6. Copy the **Web app URL** (it ends in `/exec`) and add it to `index.html` as the `ENDPOINT` value.

Callers open the site, enter their name and the team passcode once, and their updates save for everyone.
