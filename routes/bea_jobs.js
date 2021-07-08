var validate = require("../modules/common_functions.js").validate;
var pad = require("../modules/common_functions.js").pad;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;
var construct_delimited_string = require("../modules/common_functions.js").construct_delimited_string;

var request = require('request');


module.exports = function(app, pg, conString) {


    //select everything
    //app.get('/bea_jobs', function(req, res) {
    //    sendtodatabase("select * from estimates.bea_jobs order by fips asc;", pg, conString, res);
    //});
    
    app.get('/bea_jobs', function(req, res) {
        
        //table name
        var schtbl = "estimates.bea_jobs";


        //schema.table combination
        var basequery = "SELECT * from " + schtbl + " WHERE ";
        
        var countystring = "";

        var sqlstring;

        var j; //iterators
        
        //exit if no county
        if (!req.query.county) {
            res.send('please specify a county (or comma separated list of counties)');
            return;
        }
        
        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125", "501", "502","503","504","505","506","507","508","509","510","511","512","513","514","515","516","517","518","519","520","521","522"];
        if (!validate(county, countydomain)) {
            res.send('one of your county inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".fips = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);

                //put it all together
        sqlstring = basequery + countystring + ";"
        console.log(countystring);
        console.log(sqlstring);
        sendtodatabase(sqlstring, pg, conString, res);
    });

    //endpoint to gather valid counties
    app.get('/bea_jobs_county', function(req, res) {
        sendtodatabase("select distinct fips from estimates.bea_jobs order by fips asc;", pg, conString, res);
    });



}
