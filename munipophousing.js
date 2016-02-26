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
app.get('/gather', function(req, res) {

    //schema.table combination
    var schtbl = "estimates.munipophousingtimeseries_v2014";
    var basequery = "SELECT municipalityname,year,countyfips,placefips,";
    var statlist = "totalpopulation"; //default if no statlist selected

    //countyfips (integer version) : comma separated
    //placefips: (integer version) : comma separated
    //year: 2010,2011,2012,2013,2014 : comma separated
    //compress: explicit yes or no
    //stats: comma separated all or none.  defaults as *.  
    //possible stats are: totalpopulation,householdpopulation,groupquarterspopulation,
    //totalhousingunits,occupiedhousingunits,vacanthousingunits

    var yearstring = "";
    var countystring = "";
    var placestring = "";
    var statstring = "";
    var year;
    var placefips;
    var countyfips;
    var slist;
    var sqlstring;

    var i, j; //iterators

    //exit if no year
    if (!req.query.year) {
        res.send('please specify a year (or comma separated list of years)');
    }

    //exit if no geo identifier
    if (!req.query.placefips && !req.query.countyfips) {
        //no countyfips or placefips specified
        res.send('please specify a place fips or county fips');
    }

    //create array of years
    year = (req.query.year).split(",");

    //create sql selector for years
    for (j = 0; j < year.length; j++) {
        yearstring = yearstring + schtbl + ".year = " + year[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    yearstring = yearstring.substring(0, yearstring.length - 3);

    if (req.query.stats) {
        //countyfipsonly = want all pieces in county = default.  or 'compressed' to sum all up to county number
        statlist = req.query.stats
    }

    if (!req.query.placefips && req.query.countyfips) {

        //countyfipsonly = want all pieces in county = default.  or 'compressed' to sum all up to county number
        countyfips = (req.query.countyfips).split(",");
        for (i = 0; i < countyfips.length; i++) {
            countystring = countystring + schtbl + ".countyfips = " + countyfips[i] + " OR ";
        }
        countystring = countystring.substring(0, countystring.length - 3);

        if (req.query.compressed === "no") {
            sqlstring = basequery + statlist + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + countystring + ');';
            sendtodatabase(sqlstring);
        } else if (req.query.compressed === "yes") {
            basequery = "SELECT year,countyfips,";
            slist = statlist.split(",");
            for (j = 0; j < slist.length; j++) {
                statstring = statstring + "SUM(" + slist[j] + ") as " + slist[j] + ",";
            }
            statstring = statstring.substring(0, statstring.length - 1);
            sqlstring = basequery + statstring + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + countystring + ') group by year,countyfips order by countyfips,year;';
            sendtodatabase(sqlstring);
        } else {
            res.send('please explicity set compressed to yes or no');
        }
    }

    if (req.query.placefips && !req.query.countyfips) {
        //placefipsonly = want all place pieces.  or 'compressed' to sum up all place pieces
        placefips = (req.query.placefips).split(",");
        for (j = 0; j < placefips.length; j++) {
            placestring = placestring + schtbl + ".placefips = " + placefips[j] + " OR ";
        }
        placestring = placestring.substring(0, placestring.length - 3);

        if (req.query.compressed === "no") {
            sqlstring = basequery + statlist + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + placestring + ');';
            sendtodatabase(sqlstring);
        } else if (req.query.compressed === "yes") {
            basequery = "SELECT replace(municipalityname, ' (Part)', '') as municipalityname,year,placefips,";
            slist = statlist.split(",");
            for (j = 0; j < slist.length; j++) {
                statstring = statstring + "SUM(" + slist[j] + ") as " + slist[j] + ",";
            }
            statstring = statstring.substring(0, statstring.length - 1);
            sqlstring = basequery + statstring + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + placestring + ') group by year,placefips,municipalityname order by placefips,municipalityname,year;';
            sendtodatabase(sqlstring);
        } else {
            res.send('please explicity set compressed to yes or no');
        }
    }


    if (req.query.placefips && req.query.countyfips) {

        countyfips = (req.query.countyfips).split(",");
        for (var i = 0; i < countyfips.length; i++) {
            countystring = countystring + schtbl + ".countyfips = " + countyfips[i] + " OR ";
        }
        countystring = countystring.substring(0, countystring.length - 3);

        placefips = (req.query.placefips).split(",");
        for (var j = 0; j < placefips.length; j++) {
            placestring = placestring + schtbl + ".placefips = " + placefips[j] + " OR ";
        }
        placestring = placestring.substring(0, placestring.length - 3);

        //placefips and countyfips = looking for particular piece in particular county.  very specific.  compressed doesnt matter
        sqlstring = basequery + statlist + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + countystring + ') AND (' + placestring + ');';
        sendtodatabase(sqlstring);
    }

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