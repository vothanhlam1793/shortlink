
// KIEM TRA LUOT VIEW THEO TUNG SHORT LINK THEO NGAY

var app = angular.module("mainApp", []);

var data_structure = [{
  short_id: {
    ip: 1
  }
}]

function filter_logs(date_before, date_after, short, logs){
  var logs_filtered = [];
  if(logs){
    for (i in logs){
      try{
        if(logs[i].date){
          var date_logs = new Date(logs[i].date);
          
          if ( (date_logs - date_before >= 0 ) && (date_logs - date_after <= 0 ) && ( (!short) || (logs[i].short == short) ) ){
            logs_filtered.push(logs[i]);
          }
        }
      }
      catch(err){
        console.log(err);
      }
    }
  }
  else {
    return logs_filtered;
  }
  return logs_filtered;
}

function filter_logs_2(short, logs){
  var logs_filtered = [];
  if(logs){
    for (i in logs){
      try{
        if( (!short) || (logs[i].short == short) ){
          logs_filtered.push(logs[i]);
        }
      }
      catch(err){
        console.log(err);
      }
    }
  }
  else {
    return logs_filtered;
  }
  return logs_filtered;
}

function standarize_logs(logs){
  var data = {};
  var shorts = [];
  for (i in logs){
    try{
      if (shorts.length === 0 ){
        shorts.push(logs[i].short);
        data[logs[i].short] = {}
        data[logs[i].short][logs[i].ip] = 1;
      }
      else {
        if (shorts.includes(logs[i].short)){
          if(data[logs[i].short][logs[i].ip]){
            data[logs[i].short][logs[i].ip] = data[logs[i].short][logs[i].ip] + 1;
          }
          else {
            data[logs[i].short][logs[i].ip] = 1;
          }
        }
        else{
          shorts.push(logs[i].short);

          data[logs[i].short] = {}
          data[logs[i].short][logs[i].ip] = 1;
        }
      }
    }
    catch(err){
      console.log(err)
    }
  }
  return data;
} 

function standarize_logs_2(logs){
  var data = {};
  var dates = [];

  for ( i in logs){

    try{
      var date_log = logs[i].date.substring(0,10);
      if(!dates){
        dates.push(date_log);
        data[date_log] = 1;
      }
      else{
        if (dates.includes(date_log)){
          data[date_log] = data[date_log] + 1;
        }
        else {
          dates.push(date_log);
          data[date_log] = 1;
        }
      }
    }
    catch(err){
      console.log(err);
    }
  }
  return data;
}

// parse
function parse_to_array(data){
  
}

app.controller('controller',function($scope, $http, $timeout, $interval){
  
  $scope.logs = [];
  $scope.data = [];

  $http.get("/logs").then(function(res){
    $scope.logs = res.data;
    if($scope.logs){
      // for (i in $scope.logs){

      //   // Find all short_id + make data
      //   if($scope.shorts.length === 0){
      //     $scope.shorts.push($scope.logs[i].short);

      //     $scope.data[$scope.logs[i].short] = {}
      //     $scope.data[$scope.logs[i].short][$scope.logs[i].ip] = 1;

      //   }
      //   else {
      //     if ($scope.shorts.includes($scope.logs[i].short)){
      //       if($scope.data[$scope.logs[i].short][$scope.logs[i].ip]){
      //         $scope.data[$scope.logs[i].short][$scope.logs[i].ip] = $scope.data[$scope.logs[i].short][$scope.logs[i].ip] + 1;
      //       }
      //       else {
      //         $scope.data[$scope.logs[i].short][$scope.logs[i].ip] = 1;
      //       }
      //     }
      //     else{
      //       $scope.shorts.push($scope.logs[i].short);

      //       $scope.data[$scope.logs[i].short] = {}
      //       $scope.data[$scope.logs[i].short][$scope.logs[i].ip] = 1;

      //     }
      //   }
      // }
      // $scope.data = standarize_logs_2($scope.logs);

      // console.log("logs: ", $scope.logs);
      // console.log("data: ", $scope.data);
    }
  });

  $scope.filter = function(short, logs){
    
    var logs_filtered = filter_logs_2(short, logs);
    $scope.data = standarize_logs_2(logs_filtered);
    console.log($scope.data);
  }
  
  //Filter by date & short

  
});