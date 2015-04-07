chckdSs = SpreadsheetApp.openById('1Oy8lnRU1rSC_oKbSAwz4W848qCvPQNkTGqqhKF2PFrg');

function getStudent(formObj){
  var test, studentQuery, studentsSheet, students, names, tags, studentQueryResults, tagQueryResults,
      records, binQueryResults, bins;

  studentQuery = formObj.studentSearch.toUpperCase();
  studentsSheet = chckdSs.getSheetByName('Students');
  students = NVSL.getRowsData(studentsSheet);
  names = students.map(function (e){
    return e.student.toUpperCase();
  });
  tags = students.map(function (e){
    return e.tagNumber.toUpperCase();
  });
  bins = students.map(function(e){
    return e.binNumber.toUpperCase();
  });
  records = [];
  
  function searchStringInArray (str, strArray) {
    var results = [];
    for (var j=0; j<strArray.length; j++) {
      if (strArray[j].match(str)){
        results.push(j);
      }   
    }
    var matches = results.length > 0 ? results : -1;
    return matches;
  }
  
  studentQueryResults = searchStringInArray(studentQuery, names);
  tagQueryResults = searchStringInArray(studentQuery, tags);
  binQueryResults = searchStringInArray(studentQuery, bins);
  records = records.concat(studentQueryResults).concat(tagQueryResults).concat(binQueryResults);
   return displaySearchResults(records, students);
}



function displaySearchResults(indexes, students){
  var test, indxs, records, panel;
  
  indxs = indexes.filter(function (e){
    return e > 0;
  });
  
  records = indxs.map(function(e){
    return students[e];
  });
  
  panel = HtmlService.createTemplateFromFile('search_results');
  panel.data = records;
  return panel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
  
  debugger;
}



function testSearch(){
  var test, formObj={};
  
  formObj.search = "bin 2";
  getStudent(formObj);
}