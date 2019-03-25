module.exports = function(app, pg, conString) {

    // respond with "Hello World!" on the homepage
    app.get('/jobs-forecast', function(req, res) {


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

        //schema.table combination
        var schtbl = "estimates.jobs_forecast";
        var basequery = "SELECT countyfips, population_year, datatype";
        // var statlist = "total_population"; 


        //population_year: 1870:2010 : comma separated
        //compress: explicit yes or no


        var yearstring = "";
        var countystring = "";
        // var typestring = "";
      //  var statstring = "";
        var year;
        var county;
        // var type;
        //var countyfips;
       // var slist = [];
        var sqlstring;

        var i, j; //iterators

        var yeardomain = [];
        var countydomain = [];
        //  var typedomain = [];



        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        } else {
            yeardomain = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040"];
            //create array of years
            year = (req.query.year).split(",");
            //validate year input
            if (!validate(year, yeardomain)) {
                res.send('one of your year inputs is not valid!');
                return;
            }
        }

        // //exit if no geo identifier
        // if (!req.query.geo) {
        //     //no countyfips or placefips specified
        //     res.send('please specify a geography');
        // }

        //validate geostring, if entered
        if (req.query.county) {
            countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125", "500"];
            county = (req.query.county).split(",");
            //validate place input
            if (!validate(county, countydomain)) {
                res.send('one of your county inputs is not valid!');
                return;
            }
        }
        
                //validate type, if entered
        // if (req.query.type) {
        //     typedomain = ["M", "C" ];
        //     type = (req.query.type).split(",");
        //     //validate place input
        //     if (!validate(type, typedomain)) {
        //         res.send('one of your type inputs is not valid!');
        //         return;
        //     }
        // }


        //create sql selector for years
        for (j = 0; j < year.length; j++) {
            yearstring = yearstring + schtbl + ".population_year = " + year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        yearstring = yearstring.substring(0, yearstring.length - 3);
        
        // geography sql selector
        for (i = 0; i < county.length; i++) {
                countystring = countystring + schtbl + ".countyfips = " + "'" + county[i]+ "'" + " OR ";
            }
            countystring = countystring.substring(0, countystring.length - 3);
            
            // typestring=  typestring + schtbl + ".area_type = " + "'" + type + "'";

        //full sql string selector

            sqlstring = basequery + ', totaljobs ' + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + countystring + ');';
            sendtodatabase(sqlstring);
            
            console.log(sqlstring)

    


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
                    // res.send(JSON.stringify(result.rows));
                res.send(JSON.parse(JSON.stringify(result.rows).replace(/"\s+|\s+"/g,'"')));


                    client.end();

                });
            });
        }

    });



    app.get('/jobs_county', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select distinct countyfips from estimates.jobs_forecast order by countyfips asc;", function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                res.set({
                    "Content-Type": "application/json"
                });
                // res.send(JSON.stringify(result.rows));
                res.send(JSON.parse(JSON.stringify(result.rows).replace(/"\s+|\s+"/g,'"')));
                client.end();
            });
        });
    });
    
    app.get('/jobsforecastYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select distinct population_year, datatype from estimates.jobs_forecast order by population_year asc;", function(err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                res.set({
                    "Content-Type": "application/json"
                });
                // res.send(JSON.stringify(result.rows));
                res.send(JSON.parse(JSON.stringify(result.rows).replace(/"\s+|\s+"/g,'"')));
                client.end();
            });
        });
    });
    
    app.get('/jobforecast_region', function(req, res) {
        sendtodatabase("select distinct reg_num from estimates.jobs_forecast_region order by reg_num asc;", pg, conString, res);
    });
    
    app.get('/jobsforecast_region', function(req, res) {
        //table name
        var schtbl = "estimates.jobs_forecast_region";
        
                //schema.table combination
        var basequery = "SELECT reg_num,population_year,totaljobs,datatype from " + schtbl + " WHERE ";
        var groupby = "";


        //GROUP BY
        //opt0: = none or all = base query
        //opt1: year
        //opt2: reg_num
        
        if (req.query.group) {

            var statarray = [];

            //break down statarray into sumlist
            var statstring = "";
            var statlist = "";

            for (var k = 0; k < statarray.length; k++) {
                statstring = statstring + "SUM(" + statarray[k] + ") as " + statarray[k] + ", ";
                statlist = statlist + statarray[k] + ", ";
            }
            statstring = statstring.slice(0, -2);
            statlist = statlist.slice(0, -2);

            //opt1: year
            if (req.query.group === "opt1") {
                basequery = "SELECT year, SUM(totaljobs) as totaljobs, " + statstring + " from " + schtbl + " WHERE ";
                groupby = " GROUP BY population_year ORDER BY population_year ";
            }
            //opt2: reg_num
            if (req.query.group === "opt2") {
                basequery = "SELECT reg_num, " + statstring + " from " + schtbl + " WHERE ";
                groupby = " GROUP BY reg_num ORDER BY reg_num ";
            }

        }
        
        var yearstring = "";
        var reg_numstring = "";


        var sqlstring;

        var i, j; //iterators


        //exit if no reg_num
        if (!req.query.reg_num) {
            res.send('please specify a reg_num (or comma separated list of reg_num\'s)');
            return;
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
            return;
        }
        
        //create array of reg_num fips codes
        var reg_num = (req.query.reg_num).split(",");
        var reg_numdomain = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
        if (!validate(reg_num, reg_numdomain)) {
            res.send('one of your reg_num inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < reg_num.length; j++) {
            reg_numstring = reg_numstring + schtbl + ".reg_num = " + reg_num[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        reg_numstring = reg_numstring.substring(0, reg_numstring.length - 3);


        //create array of years
        var year = (req.query.population_year).split(",");
        var yeardomain = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040"];
        if (!validate(year, yeardomain)) {
            res.send('one of your year inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < year.length; j++) {
            yearstring = yearstring + schtbl + ".population_year = " + year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        yearstring = yearstring.substring(0, yearstring.length - 3);

        //put it all together
        sqlstring = basequery + "(" + reg_numstring + ") AND " + "(" + yearstring + ") " + groupby + ";";

        console.log(sqlstring);

        sendtodatabase(sqlstring, pg, conString, res);
        
    });

}
