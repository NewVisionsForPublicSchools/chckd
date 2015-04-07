pageTitle = "Braves";
chckdSs = SpreadsheetApp.openById('1Oy8lnRU1rSC_oKbSAwz4W848qCvPQNkTGqqhKF2PFrg');

function doGet() {
  return HtmlService
      .createTemplateFromFile('index')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle(pageTitle);
}



function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}



function processScan(formObj){
  var test, deviceScan, currentTime, student, scan;
  
  deviceScan = formObj.studentScan.toUpperCase();
  currentTime = new Date();
  student = getStudentInfo(deviceScan);
//  debugger;
  
  scan = {
    tagNumber: deviceScan,
    timeStamp: currentTime,
    name: student.student || "Not assigned",
    binNumber: student.binNumber || "Not assigned",
    status: !student.status,
    grade: student.grade || "Not assigned"
  };

  if(student != "Tag does not exist"){
    addScanToSheet(scan);
    changeDeviceState(scan);
    
    switch(scan.name != "Not assigned"){
      case true:
        if(scan.status === true){
          return displayCheckInInfo(scan)
        }
        else{
          return displayReturnInfo(scan);
        }
        break;
        
      case false:
        if(scan.status === true){
          return displayWarningInfo(scan)
        }
        else{
          return displayReturnInfo(scan);
        }
        break;
        
      default:
        break;
    }
  }
  else{
    return displayRejectedInfo(scan);
  }
}



function getStudentInfo(deviceScan){
  var test, tagNumber, studentSheet, deviceTags, tagRecord;
  
  tagNumber = deviceScan;
  studentSheet = chckdSs.getSheetByName('Students');
  deviceTags = NVSL.getRowsData(studentSheet);
  
  function getTagRecord(e){
    return e.tagNumber === tagNumber;
  }
  
  tagRecord = deviceTags.filter(getTagRecord)[0] || "Tag does not exist";
  return tagRecord;
}



function addScanToSheet(scan){
  var test, scanSheet, headerRange, record;
  
  scanSheet = chckdSs.getSheetByName('Scans');
  headerRange = scanSheet.getRange(1,1,1,6)
  record = [scan];
  
  NVSL.setRowsData(scanSheet, record, headerRange, scanSheet.getLastRow()+1);
  
}



function test(){
  var test, formObj;
  
  formObj = {
    studentScan: "AMS310"
  }
  
  processScan(formObj);
}



function changeDeviceState(scan){
  var test, tagNumber, status, studentSheet, deviceTags, tagIndex, tagRecords, statusRange;
  
  tagNumber = scan.tagNumber;
  status = scan.status;
  studentSheet = chckdSs.getSheetByName('Students');
  deviceTags = NVSL.getRowsData(studentSheet);
  
  function getTagRecord(e){
    return e.tagNumber;
  }
  
  tagRecords = deviceTags.map(getTagRecord);
  tagIndex = tagRecords.indexOf(tagNumber);
  statusRange = studentSheet.getRange(tagIndex+2,5,1,1);
  statusRange.setValue(status);
}



function displayCheckInInfo(scan){
  var test, panel;
  
  panel = HtmlService.createTemplateFromFile('Check_In');
  panel.data = scan;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function displayReturnInfo(scan){
  var test, panel;
  
  panel = HtmlService.createTemplateFromFile('Return');
  panel.data = scan;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function displayWarningInfo(scan){
  var test, panel;
  
  panel = HtmlService.createTemplateFromFile('Warning');
  panel.data = scan;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function displayRejectedInfo(scan){
  var test, panel;
  
  panel = HtmlService.createTemplateFromFile('Rejected');
  panel.data = scan;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}