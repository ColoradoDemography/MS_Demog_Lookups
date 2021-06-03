var validate = require("../modules/common_functions.js").validate;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;


module.exports = function(app, pg, conString) {


    app.get('/migbyage', function(req, res) {

        //table name
        var schtbl = "estimates.county_migbyage_sya";


        //schema.table combination
        var basequery = "SELECT countyfips,age,netmigration,geonum from " + schtbl + " WHERE ";
        


        //GROUP BY
        //opt0: = none or all = base query
        //opt1: year
        //opt2: county_fips


        var yearstring = "";
        var countystring = "";
        var groupby = "";

        var sqlstring;

        var i, j; //iterators


        //exit if no county
        //if (!req.query.county) {
        //    res.send('please specify a county (or comma separated list of counties)');
        //    return;
        //}

        //exit if no year
        //if (!req.query.year) {
        //    res.send('please specify a year (or comma separated list of years)');
        //    return;
        //}



        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated (valid range: 1985-2014)


        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["000", "001", "003", "005", "007", "009", "011", "013", "014", "015", "017", "019", "021", "023", "025", "027", "029", "031", "033", "035", "037", "039", "041", "043", "045", "047", "049", "051", "053", "055", "057", "059", "061", "063", "065", "067", "069", "071", "073", "075", "077", "079", "081", "083", "085", "087", "089", "091", "093", "095", "097", "099", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
        if (!validate(county, countydomain)) {
            res.send('one of your county inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".countyfips = " + county[j] + " OR ";
        }
        remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);


        //create array of years
        //var year = (req.query.year).split(",");
        //var yeardomain = ["1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
        //if (!validate(year, yeardomain)) {
        //    res.send('one of your year inputs is not valid!');
        //    return;
        //}

        //create sql selector for years
        //for (j = 0; j < year.length; j++) {
        //    yearstring = yearstring + schtbl + ".year = " + year[j] + " OR ";
        //}
        //remove stray OR from end of sql selector
        //yearstring = yearstring.substring(0, yearstring.length - 3);

        //put it all together
        sqlstring = basequery + countystring + ";";

        console.log("QUERY: " + sqlstring);
        sendtodatabase(sqlstring, pg, conString, res);

    });
