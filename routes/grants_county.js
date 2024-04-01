var validate = require("../modules/common_functions.js").validate;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;


module.exports = function(app, pg, conString) {


    app.get('/grants_county', function(req, res) {

        //table name
        var schtbl = "estimates.grants_counties_years";


        //schema.table combination
        var basequery = "SELECT * from " + schtbl + " WHERE ";
        var groupby = "";


        //GROUP BY
        //opt0: = none or all = base query
        //opt1: year
        //opt2: county_fips


        var yearstring = "";
        var countystring = "";


        var sqlstring;

        var i, j; //iterators


        //exit if no county
        if (!req.query.county) {
            res.send('please specify a county (or comma separated list of counties)');
            return;
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
            return;
        }



        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated (valid range: 1985-2014)


        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125", "500"];
        if (!validate(county, countydomain)) {
            res.send('one of your county inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".countyfips = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);


        //create array of years
        var year = (req.query.year).split(",");
       var yeardomain = ["1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050"];
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
        sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") " + groupby + ";";

        console.log("QUERY: " + sqlstring);
        sendtodatabase(sqlstring, pg, conString, res);

    });
     app.get('/grantYRS', function(req, res) {

        sendtodatabase("select year from estimates.grants_counties_years where countyfips=1 order by year asc;", pg, conString, res);

    });

}
