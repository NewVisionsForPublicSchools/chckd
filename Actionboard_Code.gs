function refreshActionboard(){
 var test, panel, results, today, start, end;
  
  
  results = {};
  start = setDateToCurrent()[0];
  end = setDateToCurrent()[1];

  results.checked = getCheckInData(start, end).length;
  results.returned = getReturnData(start, end).length;
  results.missing = getMissingAssignmentData(start, end).length;
  results.notReturned = getNotReturnedData().length;
  
  panel = HtmlService.createTemplateFromFile('actionboard');
  panel.data = results;

  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function report_checkedInToday(){
  var test, range, results, panel;
  
  range = setDateToCurrent();
  results = getCheckInData(range[0], range[1]);
  panel = HtmlService.createTemplateFromFile('checked_in_report');
  panel.data = results;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function report_returnedToday(){
  var test, range, results, panel;

  range = setDateToCurrent();

  results = getReturnData(range[0], range[1]);
  panel = HtmlService.createTemplateFromFile('returned_report');
  panel.data = results;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function report_missingAssignmentsToday(){
  var test, range, results, panel;
  
  range = setDateToCurrent();

  results = getMissingAssignmentData(range[0], range[1]);
  panel = HtmlService.createTemplateFromFile('missing_assignments_report');
  panel.data = results;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function setDateToCurrent(){
 var start, end;
  
  start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  end = new Date();
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds (59);
  
  return [start, end];
}