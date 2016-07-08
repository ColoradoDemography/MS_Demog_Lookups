module.exports = function(app, pg, conString) {


    app.get('/sya', function(req, res) {


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



        //table name
        var schtbl = "estimates.county_sya";

        //schema.table combination
        var basequery = "SELECT countyfips,year,age,county,malepopulation,femalepopulation,totalpopulation,datatype from " + schtbl + " where ";
        var groupby = "";

        if (req.query.group) {
            if (req.query.group === "opt1") {
                basequery = "SELECT year,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
                groupby = " GROUP BY year ORDER BY year";
            }
            if (req.query.group === "opt2") {
                basequery = "SELECT countyfips,year,county,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
                groupby = " GROUP BY countyfips,county,year ORDER BY countyfips,county,year";
            }
            if (req.query.group === "opt3") {
                basequery = "SELECT year,age,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
                groupby = "GROUP BY year,age ORDER BY year,age";
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
            //res.send('please specify a single year of age (or comma separated list of ages)');
            //instead, default to all ages
            req.query.age = "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100";
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
            countystring = countystring + schtbl + ".countyfips = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);


        //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050"];
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


        //create array of ages
        var age = (req.query.age).split(",");
        var agedomain = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"];
        if (!validate(age, agedomain)) {
            res.send('one of your year inputs is not valid!');
            return;
        }

        //create sql selector for ages
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


    app.get('/syaYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select year, datatype from estimates.county_sya where countyfips=1 and age=0 order by year asc;", function(err, result) {
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


    app.get('/syaAGE', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select age from estimates.county_sya where countyfips=1 and year=1990 order by age asc;", function(err, result) {
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


    app.get('/sya_regions', function(req, res) {


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



        //table name
        var schtbl = "estimates.county_sya_region";

        //schema.table combination
        var basequery = "SELECT reg_num,year,age,region,malepopulation,femalepopulation,totalpopulation,datatype from " + schtbl + " where ";
        var groupby = "";

        if (req.query.group) {
            if (req.query.group === "opt1") {
                basequery = "SELECT year,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
                groupby = " GROUP BY year ORDER BY year";
            }
            if (req.query.group === "opt2") {
                basequery = "SELECT reg_num,year,region,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
                groupby = " GROUP BY reg_num,region,year ORDER BY reg_num,region,year";
            }
            if (req.query.group === "opt3") {
                basequery = "SELECT year,age,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation from " + schtbl + " WHERE ";
                groupby = "GROUP BY year,age ORDER BY year,age";
            }
        }


        //reg_num: (integers) : fips codes, comma separated
        //year: (integers) : comma separated
        //age: (integers) : comma separated

        var yearstring = "";
        var reg_numstring = "";
        var agestring = "";

        var sqlstring;

        var i, j; //iterators


        //exit if no reg_num
        if (!req.query.reg_num) {
            res.send('please specify a region number (or comma separated list of region numbers)');
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        }

        //exit if no age
        if (!req.query.age) {
            //res.send('please specify a single year of age (or comma separated list of ages)');
            //instead, default to all ages
            req.query.age = "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100";
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
            reg_numstring = reg_numstring + schtbl + ".reg_num = " + reg_num[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        reg_numstring = reg_numstring.substring(0, reg_numstring.length - 3);


        //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050"];
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


        //create array of ages
        var age = (req.query.age).split(",");
        var agedomain = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"];
        if (!validate(age, agedomain)) {
            res.send('one of your year inputs is not valid!');
            return;
        }

        //create sql selector for ages
        for (j = 0; j < age.length; j++) {
            agestring = agestring + schtbl + ".age = " + age[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        agestring = agestring.substring(0, agestring.length - 3);


        //put it all together
        sqlstring = basequery + "(" + reg_numstring + ") AND " + "(" + yearstring + ") AND " + "(" + agestring + ")" + groupby + ";";

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


}