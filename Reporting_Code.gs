var CHCKDSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('chckdSs'));



function getCheckInData(start, end){
  var test, scanSheet, scans, startDate, endDate, filteredScans;
  
  scanSheet = CHCKDSS.getSheetByName('Scans');
  scans = NVSL.getRowsData(scanSheet);
  startDate = start.getTime();
  endDate = end.getTime();
  
  function filterDate(e){
    return (startDate < e.timeStamp.getTime()) && (e.timeStamp.getTime() < endDate);
  };
  
  function filterStatus(e){
    return e.status === true;
  };
  
  filteredScans = scans.filter(filterDate).filter(filterStatus);
  return filteredScans;
}



function getReturnData(start, end){
  var test, scanSheet, scans, startDate, endDate, filteredScans;
  
  scanSheet = CHCKDSS.getSheetByName('Scans');
  scans = NVSL.getRowsData(scanSheet);
  startDate = start.getTime();
  endDate = end.getTime();
  
  function filterDate(e){
    return (startDate < e.timeStamp.getTime()) && (e.timeStamp.getTime() < endDate);
  };
  
  function filterStatus(e){
    return e.status != true;
  };
  
  filteredScans = scans.filter(filterDate).filter(filterStatus);
  return filteredScans;
}



function getMissingAssignmentData(start, end){
  var test, checkIns, filteredScans
  
  checkIns = getCheckInData(start, end);

  function filterMissingAssignment(e){
    return e.name == "Not assigned";
  }
  
  filteredScans = checkIns.filter(filterMissingAssignment);
  return filteredScans;
}



function getNotReturnedData(){
  var test, start, end, scanSheet, scans, dateFilteredScans, filteredScans, tagsSheet, tags, newScans;
  
  start = new Date(new Date().toDateString());
  end = new Date(start.getYear(),start.getMonth(),start.getDate()+1);
  scanSheet = CHCKDSS.getSheetByName('Scans');
  scans = NVSL.getRowsData(scanSheet);
  tagsSheet = CHCKDSS.getSheetByName('Students');
  tags = NVSL.getRowsData(tagsSheet);
  
  function filterDate(e){
    return (start < e.timeStamp.getTime()) && (e.timeStamp.getTime() < end);
  };
  
  filteredScans = scans.filter(filterDate).map(addCurrentStatus).filter(filterNotReturned);

  function addCurrentStatus(e){
    for(var i=0;i<tags.length;i++){
      if(e.tagNumber === tags[i].tagNumber){
        e.currentStatus = tags[i].status;
        return e;
      }
    }
  };
  
  function filterNotReturned(e){
    return e.currentStatus === true;
  };
  return filteredScans
}



function getNotCheckedInData(){
  var test, start, end, scanSheet, scans, tagsSheet, tags, checkIns, filteredScans;
  
  start = new Date(new Date().toDateString());
  end = new Date(start.getYear(),start.getMonth(),start.getDate()+1);
  tagsSheet = CHCKDSS.getSheetByName('Students');
  tags = NVSL.getRowsData(tagsSheet);
  
  checkIns = getCheckInData(start, end);
  filteredScans = tags.map(addCheckInStatus).filter(filterCheckedIn);
  
  function addCheckInStatus(e){
    e.checkInStatus = false;
    for(var i=0;i<checkIns.length;i++){
      if(e.tagNumber === checkIns[i].tagNumber){
        e.checkInStatus = true;
        return e;
      }
    }
    return e;
  };
  
  function filterCheckedIn(e){
    return e.checkInStatus === false;
  };
  
  debugger;
  return filteredScans;
}



function reportTest(){
  var test, startDate, endDate, data;
  
  startDate = new Date("3/30/2015");
  endDate = new Date("4/02/2015");
  debugger;
  data = getNotCheckedInData();
  debugger;
}



function report_notReturnedToday(){
  var test, results, panel, range;
  
  range = setDateToCurrent();
  
  results = getNotReturnedData();
  panel = HtmlService.createTemplateFromFile('not_returned_report');
  panel.data = results;
  panel.start = range[0];
  panel.end = range[1];
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function getDateFilters(formObj){
  var test, s, e, start, end, range;
  
  if(formObj.start){
    s = formObj.start.toString().split("-");
    e = formObj.end.toString().split("-");
    start = new Date(s[0],s[1]-1,s[2]);
    end = new Date(e[0],e[1]-1,e[2],23,59,59);
  }
  else{
    range = setDateToCurrent();
    start = range[0];
    end = range[1];
  }
  return [start, end];
}



function report_checkedIn(formObj){
  var test, range, results, panel, obj={};
  
  obj.start = formObj.checkedStart;
  obj.end = formObj.checkedEnd;
  
  range = getDateFilters(obj);

  results = getCheckInData(range[0], range[1]);
  panel = HtmlService.createTemplateFromFile('checked_in_report');
  panel.data = results;
  panel.start = range[0];
  panel.end = range[1];
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function report_returned(formObj){
  var test, range, results, panel, obj={};

  obj.start = formObj.returnedStart;
  obj.end = formObj.returnedEnd;
  
  range = getDateFilters(obj);

  results = getReturnData(range[0], range[1]);
  panel = HtmlService.createTemplateFromFile('returned_report');
  panel.data = results;
  panel.start = range[0];
  panel.end = range[1];
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function report_missingAssignments(formObj){
  var test, range, results, panel, obj={};
  
  obj.start = formObj.missingStart;
  obj.end = formObj.missingEnd;
  
  range = getDateFilters(obj);

  results = getMissingAssignmentData(range[0], range[1]);
  panel = HtmlService.createTemplateFromFile('missing_assignments_report');
  panel.data = results;
  panel.start = range[0];
  panel.end = range[1];
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}