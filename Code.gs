/**
 * LifeLine Blood Donation Website — Google Sheets backend
 *
 * Use this script as a container-bound script:
 * 1. Open your Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Replace the editor contents with this code and save.
 * 4. Run setupSheets() once and approve permissions.
 * 5. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Copy the Web app URL ending in /exec into config.js.
 *
 * WARNING: "Anyone" permits public access to this API. Do not put sensitive
 * private data in this sheet. Only publish donor details with their consent.
 */

const DONORS_SHEET = 'Donors';
const REQUESTS_SHEET = 'Requests';

const DONOR_HEADERS = [
  'Donor ID', 'Full Name', 'Age', 'Gender', 'Blood Group', 'Phone',
  'Email', 'City', 'Last Donation Date', 'Donations', 'Timestamp'
];

const REQUEST_HEADERS = [
  'Request ID', 'Patient Name', 'Blood Group Needed', 'Units Required',
  'Urgency', 'Hospital Name', 'City', 'Contact Person', 'Contact Phone',
  'Additional Notes', 'Timestamp'
];

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open Apps Script from the Google Sheet using Extensions > Apps Script.');

  let donors = ss.getSheetByName(DONORS_SHEET);
  if (!donors) donors = ss.insertSheet(DONORS_SHEET);
  if (donors.getLastRow() === 0) donors.appendRow(DONOR_HEADERS);
  formatSheet_(donors, [9], [11]);

  let requests = ss.getSheetByName(REQUESTS_SHEET);
  if (!requests) requests = ss.insertSheet(REQUESTS_SHEET);
  if (requests.getLastRow() === 0) requests.appendRow(REQUEST_HEADERS);
  formatSheet_(requests, [], [11]);

  let summary = ss.getSheetByName('Summary');
  if (!summary) summary = ss.insertSheet('Summary');
  summary.clear();
  summary.getRange(1, 1, 4, 2).setValues([
    ['Metric', 'Value'],
    ['Registered Donors', '=COUNTA(Donors!A:A)-1'],
    ['Requests Received', '=COUNTA(Requests!A:A)-1'],
    ['Lives Impacted (estimate)', '=(COUNTA(Donors!A:A)-1)*3']
  ]);
  summary.getRange('A1:B1').setFontWeight('bold');
  summary.autoResizeColumns(1, 2);
}

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || '').toLowerCase();
  let result;
  try {
    if (action === 'donors') {
      result = { success: true, records: getRecords_(DONORS_SHEET, 'donor') };
    } else if (action === 'requests') {
      result = { success: true, records: getRecords_(REQUESTS_SHEET, 'request') };
    } else {
      result = { success: true, message: 'LifeLine Google Sheets API is running.' };
    }
  } catch (err) {
    result = { success: false, error: String(err && err.message || err), records: [] };
  }

  const callback = String((e && e.parameter && e.parameter.callback) || '');
  const json = JSON.stringify(result);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) throw new Error('Request body is empty.');
    const payload = JSON.parse(raw);
    const record = payload.record || {};
    if (payload.action === 'addDonor') {
      validateDonor_(record);
      appendDonor_(record);
      result = { success: true, message: 'Donor saved.' };
    } else if (payload.action === 'addRequest') {
      validateRequest_(record);
      appendRequest_(record);
      result = { success: true, message: 'Blood request saved.' };
    } else {
      throw new Error('Unknown action.');
    }
  } catch (err) {
    result = { success: false, error: String(err && err.message || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRecords_(sheetName, kind) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return values.filter(row => row[0]).map(row => {
    if (kind === 'donor') {
      return {
        id: String(row[0]), name: String(row[1] || ''), age: row[2], gender: String(row[3] || ''),
        blood: String(row[4] || ''), phone: String(row[5] || ''), email: String(row[6] || ''),
        city: String(row[7] || ''), last: toDateString_(row[8]), donations: row[9] || 1,
        ts: toMillis_(row[10])
      };
    }
    return {
      id: String(row[0]), patient: String(row[1] || ''), blood: String(row[2] || ''),
      units: row[3], urgency: String(row[4] || ''), hospital: String(row[5] || ''),
      city: String(row[6] || ''), contact: String(row[7] || ''), phone: String(row[8] || ''),
      notes: String(row[9] || ''), ts: toMillis_(row[10])
    };
  });
}

function appendDonor_(r) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DONORS_SHEET);
  if (!sheet) throw new Error('Donors sheet is missing. Run setupSheets() first.');
  const last = parseDate_(r.last);
  const timestamp = parseTimestamp_(r.ts);
  sheet.appendRow([
    safeCell_(r.id), safeCell_(r.name), safeCell_(r.age), safeCell_(r.gender),
    safeCell_(r.blood), safeCell_(r.phone), safeCell_(r.email), safeCell_(r.city),
    last || '', Number(r.donations) || 1, timestamp
  ]);
  const row = sheet.getLastRow();
  if (last) sheet.getRange(row, 9).setNumberFormat('dd-mm-yyyy');
  sheet.getRange(row, 11).setNumberFormat('dd-mm-yyyy hh:mm:ss');
}

function appendRequest_(r) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REQUESTS_SHEET);
  if (!sheet) throw new Error('Requests sheet is missing. Run setupSheets() first.');
  const timestamp = parseTimestamp_(r.ts);
  sheet.appendRow([
    safeCell_(r.id), safeCell_(r.patient), safeCell_(r.blood), safeCell_(r.units),
    safeCell_(r.urgency), safeCell_(r.hospital), safeCell_(r.city), safeCell_(r.contact),
    safeCell_(r.phone), safeCell_(r.notes), timestamp
  ]);
  sheet.getRange(sheet.getLastRow(), 11).setNumberFormat('dd-mm-yyyy hh:mm:ss');
}

function validateDonor_(r) {
  if (!r || !r.id || !r.name || !r.blood || !r.phone || !r.city) {
    throw new Error('Please provide the required donor details.');
  }
  if (String(r.name).length > 100 || String(r.phone).length > 30) {
    throw new Error('A submitted field is too long.');
  }
}

function validateRequest_(r) {
  if (!r || !r.id || !r.patient || !r.blood || !r.phone || !r.hospital) {
    throw new Error('Please provide the required blood request details.');
  }
  if (String(r.patient).length > 100 || String(r.phone).length > 30) {
    throw new Error('A submitted field is too long.');
  }
}

function parseDate_(value) {
  if (!value) return null;
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const s = String(value).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  return null;
}

function parseTimestamp_(value) {
  if (value === null || value === undefined || value === '') return new Date();
  if (typeof value === 'number') return new Date(value > 100000000000 ? value : value * 1000);
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
}

function toDateString_(value) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function toMillis_(value) {
  if (!value) return 0;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function safeCell_(value) {
  if (value === null || value === undefined) return '';
  const s = String(value).trim();
  // Prevent spreadsheet formula injection from user-submitted text.
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function formatSheet_(sheet, dateColumns, datetimeColumns) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  dateColumns.forEach(col => sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('dd-mm-yyyy'));
  datetimeColumns.forEach(col => sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('dd-mm-yyyy hh:mm:ss'));
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}
