//Provide Database connection funtionality
const { Pool } = require('pg');
var Chart = require('chart.js');

// Use Heroku Postgres database
const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

alert("Opening Database");
//Retrieve the data from the database
database.query('SELECT * FROM voiceStateConnections',(err,res)=>{
  if (err)
  {
    alert("Failed to retrieve data.");
  }
  else
  {
    document.getElementById("data").innerHTML = res;
  }
});

// Disconnect from database.
database.end().then(() => console.log('Disconnected from database.'));

var nowDateTime = new Date();
var twoDRep = document.getElementById("Graph").getContext('2d');
var chart = new Chart(twoDRep,{
  type: 'line',
  data: {
    //TODO: Put proper labels as these are test labels.
    labels:['Monday','Tuesday','Wednesday'],
    datasets: [{
      //TODO: Add Actual Data. The following is all sample data
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [5,6,7]
    }]
  }
});
