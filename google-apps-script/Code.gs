/**
 * Google Apps Script for Prachi & Sumit Wedding RSVP
 * --------------------------------------------------
 * INSTRUCTIONS:
 * 1. Open Google Sheets (create a new blank spreadsheet, e.g., "Prachi & Sumit RSVP").
 * 2. In the top menu, go to: Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this entire file, and click the Save (floppy disk) icon.
 * 4. In the top right, click "Deploy" > "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set:
 *    - Description: "Wedding RSVP Collector"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (VERY IMPORTANT: must be "Anyone", NOT "Only myself")
 * 7. Click "Deploy", then authorize access if prompted.
 * 8. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/.../exec).
 * 9. Paste this URL into `src/data/weddingContent.json` under `rsvp.googleSheetsScriptUrl`.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent writes
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Automatically initialize header row on brand new sheets
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp (IST)",
        "Guest Name",
        "Attendance Status",
        "Total Guests",
        "Personal Message / Blessings"
      ];
      sheet.appendRow(headers);

      // Apply royal styling to headers
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#641e32"); // Royal burgundy
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);

      // Auto-set reasonable column widths
      sheet.setColumnWidth(1, 170);
      sheet.setColumnWidth(2, 220);
      sheet.setColumnWidth(3, 180);
      sheet.setColumnWidth(4, 120);
      sheet.setColumnWidth(5, 360);
    }

    // Parse incoming payload (supports JSON and form parameters)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var timestamp = Utilities.formatDate(
      new Date(),
      "Asia/Kolkata",
      "dd MMM yyyy, hh:mm a 'IST'"
    );

    var guestName = data.name || data.guestName || "Honoured Guest";
    var attendance = data.attendance || "Joyfully Attending";
    var guestCount = (attendance.indexOf("Afar") !== -1 || attendance.indexOf("Unable") !== -1)
      ? "0"
      : (data.guestCount || data.guests || "1");
    var message = data.message || data.wishes || "";

    // Append guest record
    sheet.appendRow([timestamp, guestName, attendance, guestCount, message]);

    // Align new row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 4).setHorizontalAlignment("center");

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "RSVP recorded successfully!",
        guestName: guestName
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    "✦ Prachi & Sumit Wedding RSVP Service is Live and Ready! ✦\nSend POST requests with guest details to record RSVPs."
  ).setMimeType(ContentService.MimeType.TEXT);
}

