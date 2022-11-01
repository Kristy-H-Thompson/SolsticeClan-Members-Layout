var sheetName = 'Form Responses 1'
var sheetName2 = 'Archive'
var scriptProp = PropertiesService.getScriptProperties()

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doGet (e) {
  var lock = LockService.getPublicLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)
    var sheet2 = doc.getSheetByName(sheetName2);

    var rows = sheet.getDataRange().getValues();
    var row2 = sheet2.getDataRange().getValues();
    row2.shift();
    rows.push(row2);

    for (i=0;i<rows.length;i++) {
      try {
      var row = rows[i][3];
      if (row.includes(',')) {
        rows[i][3] = row.replaceAll(',', ';');
      };
      } catch (e) { continue; }
    };

    return ContentService
      .createTextOutput(rows)
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
} 
function doPost (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  console.log('locked')

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1


    var newRow = headers.map(function(header) {
      return header == 'Timestamp' ? new Date() : e.parameter[header]
    })


    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}


function spamJade() {
    const clan = "SolsticeClan"
    const stat = 7;
  
    var sheet = SpreadsheetApp.getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var body = "These cats are still waiting to be accepted: \n"
    for (i=0; i<rows.length; i++) {
  
      if (rows[i][stat] == "Pending") {
        body += "\n - " + rows[i][1] + " - " + rows[i][2] + " - added on " + rows[i][0];
      }
  
    }
  
    var recipient = "xxx@gmail.com"
    var subject = "There are pending cats in " + clan;
    MailApp.sendEmail(recipient, subject, body);
  }
  