module.exports = function(app, pg, conString) {


    app.get('/jobs', function(req, res) {

        //table name
        var schtbl = "estimates.jobs_by_sector";

        //schema.table combination
        var basequery = "SELECT area_code,sector_id,sector_name,population_year,total_jobs from " + schtbl + " where ";

        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated

        var yearstring = "";
        var countystring = "";
        var sectorstring = "";

        var sqlstring;

        var i, j, k; //iterators

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


        //exit if no county
        if (!req.query.county) {
            res.send('please specify a county (or comma separated list of counties)');
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        }


        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
        if (!validate(county, countydomain)) {
            res.send('one of your county inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".area_code = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);


        //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
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



        //create array of years

        if (!req.query.sector) {
            sectorstring = "5=5"; //rather than explicitly list every sector
        } else {
            var sector = (req.query.sector).split(",");
            var sectordomain = ["11", "21", "22", "23", "31-33", "42", "44-45", "48-49", "51", "52", "53", "54", "55", "56", "61", "62", "71", "72", "81", "92", "99"];
            if (!validate(sector, sectordomain)) {
                res.send('one of your sector inputs is not valid!');
                return;
            }

            //create sql selector for years
            for (k = 0; k < sector.length; k++) {
                sectorstring = sectorstring + schtbl + ".sector_id = '" + sector[k] + "' OR ";
            }
            //remove stray OR from end of sql selector
            sectorstring = sectorstring.substring(0, sectorstring.length - 3);
        }



        //put it all together
        sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") AND (" + sectorstring + ") ORDER BY area_code, population_year, sector_id;";

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

app.get('/jobs0', function(req, res) {

        //table name
        var schtbl = "estimates.jobs_by_sector_0";

        //schema.table combination
        var basequery = "SELECT area_code,sector_id,sector_name,population_year,total_jobs from " + schtbl + " where ";

        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated

        var yearstring = "";
        var countystring = "";
        var sectorstring = "";

        var sqlstring;

        var i, j, k; //iterators

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


        //exit if no county
        if (!req.query.county) {
            res.send('please specify a county (or comma separated list of counties)');
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        }


        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
        if (!validate(county, countydomain)) {
            res.send('one of your county inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".area_code = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);


        //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["2020", "2021", "2022", "2023"];
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



        //create array of years

        if (!req.query.sector) {
            sectorstring = "5=5"; //rather than explicitly list every sector
        } else {
            var sector = (req.query.sector).split(",");
            var sectordomain = ["11", "21", "22", "23", "31-33", "42", "44-45", "48-49", "51", "52", "53", "54", "55", "56", "61", "62", "71", "72", "81", "92", "99"];
            if (!validate(sector, sectordomain)) {
                res.send('one of your sector inputs is not valid!');
                return;
            }

            //create sql selector for years
            for (k = 0; k < sector.length; k++) {
                sectorstring = sectorstring + schtbl + ".sector_id = '" + sector[k] + "' OR ";
            }
            //remove stray OR from end of sql selector
            sectorstring = sectorstring.substring(0, sectorstring.length - 3);
        }



        //put it all together
        sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") AND (" + sectorstring + ") ORDER BY area_code, population_year, sector_id;";

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
    
    app.get('/jobsbase', function(req, res) {

        //table name
        var schtbl = "estimates.jobs_base";

        //schema.table combination
        var basequery = "SELECT area_code,sector_id,population_year,total_jobs from " + schtbl + " where ";

        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated

        var yearstring = "";
        var countystring = "";
        var sectorstring = "";

        var sqlstring;

        var i, j, k; //iterators

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


        //exit if no county
        if (!req.query.county) {
            res.send('please specify a county (or comma separated list of counties)');
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        }


        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["500", "3", "7", "9", "14", "15", "17", "19", "21", "23", "25", "27", "29", "33", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
        if (!validate(county, countydomain)) {
            res.send('one of your county inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".area_code = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);


        //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["2020", "2021", "2022", "2023"];
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



        //create array of years

        if (!req.query.sector) {
            sectorstring = "5=5"; //rather than explicitly list every sector
        } else {
            var sector = (req.query.sector).split(",");
            var sectordomain = ["11", "21", "22", "23", "31-33", "42", "44-45", "48-49", "51", "52", "53", "54", "55", "56", "61", "62", "71", "72", "81", "92", "99"];
            if (!validate(sector, sectordomain)) {
                res.send('one of your sector inputs is not valid!');
                return;
            }

            //create sql selector for years
            for (k = 0; k < sector.length; k++) {
                sectorstring = sectorstring + schtbl + ".sector_id = '" + sector[k] + "' OR ";
            }
            //remove stray OR from end of sql selector
            sectorstring = sectorstring.substring(0, sectorstring.length - 3);
        }



        //put it all together
        sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") AND (" + sectorstring + ") ORDER BY area_code, population_year, sector_id;";

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
    
    app.get('/jobsYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select population_year from estimates.jobs_by_sector where area_code=0 and sector_id='10' order by population_year asc;", function(err, result) {
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
    });

    app.get('/jobsYRS0', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select population_year from estimates.jobs_by_sector_0 where area_code=0 and sector_id='10' order by population_year asc;", function(err, result) {
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
    });

    app.get('/jobs_region', function(req, res) {

        //table name
        var schtbl = "estimates.jobs_by_sector_region";

        //schema.table combination
        var basequery = "SELECT area_code,sector_id,sector_name,population_year,total_jobs from " + schtbl + " where ";

        //reg_num: (integers) : region numbers, comma separated
        //year: (integers) : comma separated

        var yearstring = "";
        var reg_numstring = "";
        var sectorstring = "";

        var sqlstring;

        var i, j, k; //iterators

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


        //exit if no region number
        if (!req.query.reg_num) {
            res.send('please specify a region number (or comma separated list of region numbers)');
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        }


        //create array of region numbers
        var reg_num = (req.query.reg_num).split(",");
        var reg_numdomain = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
        if (!validate(reg_num, reg_numdomain)) {
            res.send('one of your reg_num inputs is not valid!');
            return;
        }

        //create sql selector for years
        for (j = 0; j < reg_num.length; j++) {
            reg_numstring = reg_numstring + schtbl + ".area_code = " + reg_num[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        reg_numstring = reg_numstring.substring(0, reg_numstring.length - 3);


        //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
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



        //create array of years

        if (!req.query.sector) {
            sectorstring = "5=5"; //rather than explicitly list every sector
        } else {
            var sector = (req.query.sector).split(",");
            var sectordomain = ["11", "21", "22", "23", "31-33", "42", "44-45", "48-49", "51", "52", "53", "54", "55", "56", "61", "62", "71", "72", "81", "92", "99"];
            if (!validate(sector, sectordomain)) {
                res.send('one of your sector inputs is not valid!');
                return;
            }

            //create sql selector for years
            for (k = 0; k < sector.length; k++) {
                sectorstring = sectorstring + schtbl + ".sector_id = '" + sector[k] + "' OR ";
            }
            //remove stray OR from end of sql selector
            sectorstring = sectorstring.substring(0, sectorstring.length - 3);
        }



        //put it all together
        sqlstring = basequery + "(" + reg_numstring + ") AND " + "(" + yearstring + ") AND (" + sectorstring + ") ORDER BY area_code, population_year, sector_id;";

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


}
