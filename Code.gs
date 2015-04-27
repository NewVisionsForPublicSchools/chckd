<html lang="en">

<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" /> 
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.js"></script>
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.7.14/css/bootstrap-datetimepicker.css"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.7.14/css/bootstrap-datetimepicker.min.css"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.7.14/js/bootstrap-datetimepicker.min.js"></script>
  <link data-require="bootstrap-css@*" data-semver="3.3.1" rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
  <?!= include('style'); ?>
  <?!= include('navbar'); ?>
  <?!= include('search'); ?>
  <?!= include('reporting'); ?>
</head>

<body>

  <div class="container-fluid" id="home">

    <div class="jumbotron col-md-8 col-md-offset-2">
      <div class="title">
        <h1 class="text-center" id="jumbotron-title">chckd <small>Check In/Return</small></h1>
      </div> <!-- close title -->
      <div id="scan">
      <div class="col-md-6 col-md-offset-3 text-center">
        <form class="form-inline" id="myform" method="get" action="" onsubmit="return false">
          
            <div class="form-group">
              <input type="text" class="form-control" name="studentScan" id="studentScan" placeholder="Scan device tag">
            </div> <!-- close form-group -->
            <button type="button" class="btn btn-primary" id="submitBtn"
            onclick="google.script.run.withSuccessHandler(updateResults).processScan(this.parentNode)">Submit</button>
          
        </form> <!-- close form -->
        </div>
      </div> <!-- close scan -->

    </div> <!-- close jumbotron -->

    <div id="results"></div>

  </div> <!-- close container -->
   
</body>

</html>



<script>
//$('#navbar').load('navbar.html')
$(document).ready(setFocus);
    
    

$('#studentScan').on("keyup", function(){
  if(event.keyCode == 13){
    $('#submitBtn').trigger("click");
  }
});



function setFocus() {
  var input = document.getElementById ("studentScan");
  input.focus ();
}



function updateResults(resultHtml){
  document.getElementById("myform").reset();
  setFocus();
  var outputDiv = document.getElementById('results');
  outputDiv.innerHTML = resultHtml;
}



function toggle_visibility(id) {
 var e = document.getElementById(id);
 if(e.style.display == 'block')
    e.style.display = 'none';
 else
    e.style.display = 'block';
}
</script>
