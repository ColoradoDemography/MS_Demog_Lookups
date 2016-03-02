//node modules
var express = require('express');
var app = express();
var pg = require('pg');
var conString = "postgres://codemog:demography@104.197.26.248/dola";


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');

    next();
}


app.use(allowCrossDomain);

// respond with "Hello World!" on the homepage_group_id
app.get('/base-analysis', function(req, res) {

    //table name
    var schtbl = "estimates.base_analysis";


    //schema.table combination
    var basequery = "SELECT * from " + schtbl + " WHERE ";

    //exit if no county
    if (!req.query.county) {
        res.send('please specify a county');
        return;
    }



    //function to check all data input against valid values
    function validate(data, check) {
        var valid;

        for (var i = 0; i < data.length; i++) {
            valid = false;
            for (var j = 0; j < check.length; j++) {
                if (data[i] === check[j]) {
                    valid = true;
                }
            }
            if (!valid) {
                return false;
            }
        }

        return true;
    }

    function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
  
    //create array of county fips codes
    var county = (req.query.county).split(",");
    var countydomain = ["0","1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125", "500"];
    if (!validate(county, countydomain)) {
        res.send('one of your county inputs is not valid!');
        return;
    }

    var countystring="";
  
    //create sql selector for years
    for (j = 0; j < county.length; j++) {
        countystring = countystring + schtbl + ".fips = '" + pad(county[j],3) + "' OR ";
    }
    //remove stray OR from end of sql selector
    countystring = countystring.substring(0, countystring.length - 3);


    //put it all together
    sqlstring = basequery + "(" + countystring + ");";

    console.log(sqlstring);

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


var server = app.listen(4001, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://', host, port);
});