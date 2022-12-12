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
    
    app.get('/mig1864', function(req, res) {
        
        //table name
        var schtbl = "estimates.netmigration_1864";


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
        var countydomain = ["000", "001", "003", "005", "007", "009", "011", "013", "014", "015", "017", "019", "021", "023", "025", "027", "029", "031", "033", "035", "037", "039", "041", "043", "045", "047", "049", "051", "053", "055", "057", "059", "061", "063", "065", "067", "069", "071", "073", "075", "077", "079", "081", "083", "085", "087", "089", "091", "093", "095", "097", "099", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
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
        
        //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"];
        if (!validate(year, yeardomain)) {
            res.send('one of your year inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < year.length; j++) {
            yearstring = yearstring + schtbl + ".year = " + year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        yearstring = yearstring.substring(0, yearstring.length - 3);

        //put it all together
        sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") " + ";";

        console.log("QUERY: " + sqlstring);
        sendtodatabase(sqlstring, pg, conString, res);

    });
