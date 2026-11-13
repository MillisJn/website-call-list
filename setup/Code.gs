// Website Call List — shared storage. Paste into Extensions > Apps Script of a Google Sheet.
// Change PASSCODE to whatever your team will type the first time they open the site.
const PASSCODE = 'CHANGE-ME';
const TAB = 'Calls';

function tab_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(TAB);
  if (!sh) { sh = ss.insertSheet(TAB); sh.appendRow(['key', 'business', 'status', 'note', 'by', 'at']); sh.setFrozenRows(1); }
  return sh;
}
function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) {
  if ((e.parameter.pass || '') !== PASSCODE) return out_({ ok: false, error: 'passcode' });
  const rows = tab_().getDataRange().getValues().slice(1);
  const calls = {};
  rows.forEach(r => { if (r[0]) calls[String(r[0])] = { status: r[2], note: r[3], by: r[4], at: r[5] }; });
  return out_({ ok: true, calls });
}
function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad request' }); }
  if ((b.pass || '') !== PASSCODE) return out_({ ok: false, error: 'passcode' });
  const key = String(b.key || '').replace(/\D/g, '').slice(-10);
  if (key.length !== 10) return out_({ ok: false, error: 'bad key' });
  const row = [key, String(b.business || '').slice(0, 200), String(b.status || '').slice(0, 40),
               String(b.note || '').slice(0, 2000), String(b.by || '').slice(0, 60), new Date().toISOString()];
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = tab_();
    const keys = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));
    const i = keys.indexOf(key);
    if (i > 0) sh.getRange(i + 1, 1, 1, 6).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return out_({ ok: true, at: row[5] });
}
