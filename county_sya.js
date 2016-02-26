//node modules
var express = require('express');
var app = express();
var pg = require('pg');
var conString = "postgres://codemog:demography@54.69.15.55/dola";


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');

    next();
}

app.use(allowCrossDomain);

// respond with "Hello World!" on the homepage
app.get('/sya', function(req, res) {

    //table name
    var schtbl = "estimates.county_sya_2015";
  
    //schema.table combination
    var basequery = "SELECT countyfips,year,age,county,malepopulation,femalepopulation,totalpopulation,datatype from " + schtbl + " where ";
    var groupby= "";
  
    if(req.query.group){
      if(req.query.group==="opt1"){
        basequery = "SELECT year,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
        groupby= " GROUP BY year ORDER BY year";
      }
      if(req.query.group==="opt2"){
        basequery = "SELECT countyfips,year,county,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
        groupby= " GROUP BY countyfips,county,year ORDER BY countyfips,county,year";
      }
      if(req.query.group==="opt3"){
        basequery = "SELECT year,age,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
        groupby= "GROUP BY year,age ORDER BY year,age";
      }
    }
  
  
    //county: (integers) : fips codes, comma separated
    //year: (integers) : comma separated
    //age: (integers) : comma separated

    var yearstring = "";
    var countystring = "";
    var agestring = "";
  
    var sqlstring;

    var i, j; //iterators

  
    //exit if no county
    if (!req.query.county) {
        res.send('please specify a county (or comma separated list of counties)');
    }
  
    //exit if no year
    if (!req.query.year) {
        res.send('please specify a year (or comma separated list of years)');
    }

    //exit if no age
    if (!req.query.age) {
        res.send('please specify a single year of age (or comma separated list of ages)');
    }
  


    //create array of county fips codes
    var county = (req.query.county).split(",");

    //create sql selector for years
    for (j = 0; j < county.length; j++) {
        countystring = countystring + schtbl + ".countyfips = " + county[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    countystring = countystring.substring(0, countystring.length - 3);


    //create array of years
    var year = (req.query.year).split(",");

    //create sql selector for years
    for (j = 0; j < year.length; j++) {
        yearstring = yearstring + schtbl + ".year = " + year[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    yearstring = yearstring.substring(0, yearstring.length - 3);


    //create array of years
    var age = (req.query.age).split(",");

    //create sql selector for years
    for (j = 0; j < age.length; j++) {
        agestring = agestring + schtbl + ".age = " + age[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    agestring = agestring.substring(0, agestring.length - 3);
  
  
    //put it all together
    sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") AND " + "(" + agestring + ")" + groupby + ";";
  
    //console.log(sqlstring);
  
    sendtodatabase(sqlstring);


    function sendtodatabase(sqlstring) {

        var client = new pg.Client(conString);

        client.connect(function(err) {

            if (err) {
                return console.error('could not connect to postgres', err);
            }

            client.query(sqlstring, function(err, result) {

                if (err) {
                    return console.error('error running query', err);
                }

                res.set({
                    "Content-Type": "application/json"
                });
                res.send(JSON.stringify(result.rows));


                client.end();

            });
        });
    }

});


var server = app.listen(4000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://', host, port);
});