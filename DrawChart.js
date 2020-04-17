//Acquire chart api
//var Chart = require('chart.js');

//Grab data
var dataGrabber = document.getElementById("phpInteraction");
var realData = dataGrabber.textContent;

//Checks to see if timestamp1 is <= timestamp2
function isSmallerTimestamp(timestamp1, timestamp2)
{
  var sepDateTime1 = timestamp1.split(" ");
  var sepDateTime2 = timestamp2.split(" ");
  var date1 = sepDateTime1[0].split("-");
  var date2 = sepDateTime2[0].split("-");
  var time1 = sepDateTime1[1].split(":");
  var time2 = sepDateTime2[1].split(":");

  //Convert values to integers
  for (var i = 0; i < date1.length; i++)
  {
    date1[i] = +date1[i];
    date2[i] = +date2[i];
    time1[i] = +time1[i];
    time2[i] = +time2[i];
  }

  //Compare the year and month.
  if (date1[0] < date2[0] || date1[0] == date2[0] && date1[1] < date2[1] || date1[0] == date2[0] && date1[1] == date2[1] && date1[2] < date2[2])
  {
    return true;
  }  // Compare times
  else if (time1[0] < time2[0] || time1[0] == time2[0] && time1[1] < time2[1] || time1[0] == time2[0] && time1[1] == time2[1] && time1[2] < time2[2] || time1[0] == time2[0] && time1[1] == time2[1] && time1[2] == time2[2])
  {
    return true;
  }
  else
  {
    return false;
  }
}

var lines = realData.split("|");
var connectedUsers = 0;
var userStack = new Array();
var connChanges = new Array();
var timestamps = new Array();

for (var i = 0; i < lines.length; i++)
{
  var line = lines[i].split(",");
  var user = new Array();
  //User stucture: User, Timestamp, ConnectionState
  user.push(line[1]);
  user.push(line[0]);
  user.push(line[3]);

  if (i === 0)
  {
    if (user[2] == "1")
    {
      userStack.push(user);
      connectedUsers++;
      connChanges.push(connectedUsers);
      timestamps.push(user[1]);
    }
  }
  else
  {
    var copyExists = false;
    for (var j = 0; j < userStack.length; j++)
    {
      if (userStack[j][0] == user[0])
      {
        copyExists = true;
        if (user[2] == "0") {
          connectedUsers--;
          connChanges.push(connectedUsers);
          userStack.splice(j,1);
        }
      }
    }
    if (!copyExists) {
      userStack.push(user);
      connectedUsers++;
      connChanges.push(connectedUsers);
      timestamps.push(user[1]);
    }
  }
}

console.log("connChanges: " + connChanges);
console.log("Timestamps: " + timestamps);

//Set text color
Chart.defaults.global.defaultFontColor = '#ffffff';
var nowDateTime = new Date();
var twoDRep = document.getElementById("Graph").getContext('2d');
var chart = new Chart(twoDRep,{
  type: 'line',
  data: {
    //TODO: Put proper labels as these are test labels.
    //labels:[<?php  ?>],
    labels:timestamps,
    datasets: [{
      //TODO: Add Actual Data. The following is all sample data
      label: 'Number of Users',
      backgroundColor: 'rgb(0, 102, 0)',
      borderColor: 'rgb(255, 153, 51)',
      data: connChanges
      //data: [<?php ?>]
    }]
  }
});
