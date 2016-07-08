module.exports = function(app, pg, conString){


app.get('/sya-race-forecast', function(req, res) {

    //table name
    var schtbl = "estimates.county_race_by_age_forecast";

    //schema.table combination
    var basequery = "SELECT county,county_fips,year,age,race,count from " + schtbl + " WHERE ";
    var groupby = "";

    //GROUP BY
    //opt0: = none or all = base query
    //opt1: year
    //opt2: county_fips
    //opt3: age
    //opt4: race
    //opt5: year, county_fips
    //opt6: year, age
    //opt7: year, race
    //opt8: county_fips, age
    //opt9: county_fips, race
    //opt10: age, race
    //opt11: year, county_fips, age
    //opt12: year, county_fips, race
    //opt13: year, age, race
    //opt14: county_fips, age, race

    if (req.query.group) {

        //opt1: year
        if (req.query.group === "opt1") {
            basequery = "SELECT year, SUM(count) as count from " + schtbl + " WHERE ";
            //"SELECT county,county_fips,year,age,race,count from " + schtbl + " WHERE ";
            groupby = " GROUP BY year ORDER BY year";
        }
        //opt2: county_fips
        if (req.query.group === "opt2") {
            basequery = "SELECT county_fips, county, SUM(count) as count from " + schtbl + " WHERE ";
            //"SELECT county,county_fips,year,age,race,count from " + schtbl + " WHERE ";
            groupby = " GROUP BY county_fips, county ORDER BY county_fips, county";
        }
        //opt3: age
        if (req.query.group === "opt3") {
            basequery = "SELECT age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY age ORDER BY age";
        }
        //opt4: race
        if (req.query.group === "opt4") {
            basequery = "SELECT race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY race ORDER BY race";
        }
        //opt5: year, county_fips
        if (req.query.group === "opt5") {
            basequery = "SELECT year, county_fips, county SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, county_fips, county ORDER BY year, county_fips, county";
        }
        //opt6: year, age
        if (req.query.group === "opt6") {
            basequery = "SELECT year, age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, age ORDER BY year, age";
        }
        //opt7: year, race
        if (req.query.group === "opt7") {
            basequery = "SELECT year, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, race ORDER BY year, race";
        }
        //opt8: county_fips, age
        if (req.query.group === "opt8") {
            basequery = "SELECT county_fips, county, age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY county_fips, county, age ORDER BY county_fips, county, age";
        }
        //opt9: county_fips, race
        if (req.query.group === "opt9") {
            basequery = "SELECT county_fips, county, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY county_fips, county, race ORDER BY county_fips, county, race";
        }
        //opt10: age, race
        if (req.query.group === "opt10") {
            basequery = "SELECT age, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY age, race ORDER BY age, race";
        }
        //opt11: year, county_fips, age
        if (req.query.group === "opt11") {
            basequery = "SELECT year, county_fips, county, age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, county_fips, county, age ORDER BY year, county_fips, county, age";
        }
        //opt12: year, county_fips, race
        if (req.query.group === "opt12") {
            basequery = "SELECT year, county_fips, county, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, county_fips, county, race ORDER BY year, county_fips, county, race";
        }
        //opt13: year, age, race
        if (req.query.group === "opt13") {
            basequery = "SELECT year, age, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, age, race ORDER BY year, age, race";
        }
        //opt14: county_fips, age, race
        if (req.query.group === "opt14") {
            basequery = "SELECT county_fips, county, age, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY county_fips, county, age, race ORDER BY county_fips, county, age, race";
        }

    }

    var yearstring = "";
    var countystring = "";
    var agestring = "";
    var racestring = "";

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

    //exit if no age
    if (!req.query.age) {
        res.send('please specify a single year of age (or comma separated list of ages - or "all")');
        return;
    }

    //exit if no age
    if (!req.query.race) {
        res.send('please specify a single race (or comma separated list of races - or "all")');
        return;
    }


    //VALIDATE ALL INPUT ONCE IN ARRAYS
    //county: (integers) : fips codes, comma separated
    //year: (integers) : comma separated (valid range: 2010-2050)
    //age: (integers) : comma separated:  can only be 0, 18, 65 (corresponding to 0-17, 18-64, 65+)
    //race: (integers) : 1: Hispanic, 2: White non Hispanic, 3: Asian non Hispanic, 4: American Indian non Hispanic, 5: Black non Hispanic, 6: Total


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

    //create array of county fips codes
    var county = (req.query.county).split(",");
    var countydomain = ["1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
    if (!validate(county, countydomain)) {
        res.send('one of your county inputs is not valid!');
        return;
    }

    //create sql selector for years
    for (j = 0; j < county.length; j++) {
        countystring = countystring + schtbl + ".county_fips = " + county[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    countystring = countystring.substring(0, countystring.length - 3);


    //create array of years
    var year = (req.query.year).split(",");
    var yeardomain = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050"];
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
    var agedomain = ["0", "18", "65"];
    if (!validate(age, agedomain)) {
        res.send('one of your age inputs is not valid!');
        return;
    }

    //create sql selector for ages
    for (j = 0; j < age.length; j++) {
        agestring = agestring + schtbl + ".age = " + age[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    agestring = agestring.substring(0, agestring.length - 3);


    //create array of races
    var race = (req.query.race).split(",");
    var racedomain = ["1", "2", "3", "4", "5", "6"];
    if (!validate(race, racedomain)) {
        res.send('one of your race inputs is not valid!');
        return;
    }

    //create sql selector for races
    for (j = 0; j < race.length; j++) {
        if (race[j] === "1") {
            race[j] = "'Hispanic'";
        }
        if (race[j] === "2") {
            race[j] = "'White non Hispanic'";
        }
        if (race[j] === "3") {
            race[j] = "'Asian non Hispanic'";
        }
        if (race[j] === "4") {
            race[j] = "'American Indian non Hispanic'";
        }
        if (race[j] === "5") {
            race[j] = "'Black non Hispanic'";
        }
        if (race[j] === "6") {
            race[j] = "'Total'";
        }
        racestring = racestring + schtbl + ".race = " + race[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    racestring = racestring.substring(0, racestring.length - 3);

    // 1: Hispanic, 2: White non Hispanic, 3: Asian non Hispanic, 4: American Indian non Hispanic, 5: Black non Hispanic, 6: Total


    //put it all together
    sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") AND " + "(" + agestring + ") AND " + "(" + racestring + ")" + groupby + ";";

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

  
app.get('/sya-race-forecastYRS', function(req, res){

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select year from estimates.county_race_by_age_forecast where county_fips=1 and age=0 and race='Hispanic' order by year asc;", function(err, result) {
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
  

app.get('/sya-race-forecast_regions', function(req, res) {

    //table name
    var schtbl = "estimates.county_race_by_age_forecast_region";

    //schema.table combination
    var basequery = "SELECT region,reg_num,year,age,race,count from " + schtbl + " WHERE ";
    var groupby = "";

    //GROUP BY
    //opt0: = none or all = base query
    //opt1: year
    //opt2: reg_num
    //opt3: age
    //opt4: race
    //opt5: year, reg_num
    //opt6: year, age
    //opt7: year, race
    //opt8: reg_num, age
    //opt9: reg_num, race
    //opt10: age, race
    //opt11: year, reg_num, age
    //opt12: year, reg_num, race
    //opt13: year, age, race
    //opt14: reg_num, age, race

    if (req.query.group) {

        //opt1: year
        if (req.query.group === "opt1") {
            basequery = "SELECT year, SUM(count) as count from " + schtbl + " WHERE ";
            //"SELECT region,reg_num,year,age,race,count from " + schtbl + " WHERE ";
            groupby = " GROUP BY year ORDER BY year";
        }
        //opt2: reg_num
        if (req.query.group === "opt2") {
            basequery = "SELECT reg_num, region, SUM(count) as count from " + schtbl + " WHERE ";
            //"SELECT region,reg_num,year,age,race,count from " + schtbl + " WHERE ";
            groupby = " GROUP BY reg_num, region ORDER BY reg_num, region";
        }
        //opt3: age
        if (req.query.group === "opt3") {
            basequery = "SELECT age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY age ORDER BY age";
        }
        //opt4: race
        if (req.query.group === "opt4") {
            basequery = "SELECT race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY race ORDER BY race";
        }
        //opt5: year, reg_num
        if (req.query.group === "opt5") {
            basequery = "SELECT year, reg_num, region SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, reg_num, region ORDER BY year, reg_num, region";
        }
        //opt6: year, age
        if (req.query.group === "opt6") {
            basequery = "SELECT year, age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, age ORDER BY year, age";
        }
        //opt7: year, race
        if (req.query.group === "opt7") {
            basequery = "SELECT year, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, race ORDER BY year, race";
        }
        //opt8: reg_num, age
        if (req.query.group === "opt8") {
            basequery = "SELECT reg_num, region, age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY reg_num, region, age ORDER BY reg_num, region, age";
        }
        //opt9: reg_num, race
        if (req.query.group === "opt9") {
            basequery = "SELECT reg_num, region, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY reg_num, region, race ORDER BY reg_num, region, race";
        }
        //opt10: age, race
        if (req.query.group === "opt10") {
            basequery = "SELECT age, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY age, race ORDER BY age, race";
        }
        //opt11: year, reg_num, age
        if (req.query.group === "opt11") {
            basequery = "SELECT year, reg_num, region, age, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, reg_num, region, age ORDER BY year, reg_num, region, age";
        }
        //opt12: year, reg_num, race
        if (req.query.group === "opt12") {
            basequery = "SELECT year, reg_num, region, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, reg_num, region, race ORDER BY year, reg_num, region, race";
        }
        //opt13: year, age, race
        if (req.query.group === "opt13") {
            basequery = "SELECT year, age, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY year, age, race ORDER BY year, age, race";
        }
        //opt14: reg_num, age, race
        if (req.query.group === "opt14") {
            basequery = "SELECT reg_num, region, age, race, SUM(count) as count from " + schtbl + " WHERE ";
            groupby = "GROUP BY reg_num, region, age, race ORDER BY reg_num, region, age, race";
        }

    }

    var yearstring = "";
    var reg_numstring = "";
    var agestring = "";
    var racestring = "";

    var sqlstring;

    var i, j; //iterators


    //exit if no reg_num
    if (!req.query.reg_num) {
        res.send('please specify a reg_num (or comma separated list of region numbers)');
        return;
    }

    //exit if no year
    if (!req.query.year) {
        res.send('please specify a year (or comma separated list of years)');
        return;
    }

    //exit if no age
    if (!req.query.age) {
        res.send('please specify a single year of age (or comma separated list of ages - or "all")');
        return;
    }

    //exit if no age
    if (!req.query.race) {
        res.send('please specify a single race (or comma separated list of races - or "all")');
        return;
    }


    //VALIDATE ALL INPUT ONCE IN ARRAYS
    //reg_num: (integers) : region numbers, comma separated
    //year: (integers) : comma separated (valid range: 2010-2050)
    //age: (integers) : comma separated:  can only be 0, 18, 65 (corresponding to 0-17, 18-64, 65+)
    //race: (integers) : 1: Hispanic, 2: White non Hispanic, 3: Asian non Hispanic, 4: American Indian non Hispanic, 5: Black non Hispanic, 6: Total


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

    //create array of region numbers
    var reg_num = (req.query.reg_num).split(",");
    var reg_numdomain = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
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
    var yeardomain = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050"];
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
    var agedomain = ["0", "18", "65"];
    if (!validate(age, agedomain)) {
        res.send('one of your age inputs is not valid!');
        return;
    }

    //create sql selector for ages
    for (j = 0; j < age.length; j++) {
        agestring = agestring + schtbl + ".age = " + age[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    agestring = agestring.substring(0, agestring.length - 3);


    //create array of races
    var race = (req.query.race).split(",");
    var racedomain = ["1", "2", "3", "4", "5", "6"];
    if (!validate(race, racedomain)) {
        res.send('one of your race inputs is not valid!');
        return;
    }

    //create sql selector for races
    for (j = 0; j < race.length; j++) {
        if (race[j] === "1") {
            race[j] = "'Hispanic'";
        }
        if (race[j] === "2") {
            race[j] = "'White non Hispanic'";
        }
        if (race[j] === "3") {
            race[j] = "'Asian non Hispanic'";
        }
        if (race[j] === "4") {
            race[j] = "'American Indian non Hispanic'";
        }
        if (race[j] === "5") {
            race[j] = "'Black non Hispanic'";
        }
        if (race[j] === "6") {
            race[j] = "'Total'";
        }
        racestring = racestring + schtbl + ".race = " + race[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    racestring = racestring.substring(0, racestring.length - 3);

    // 1: Hispanic, 2: White non Hispanic, 3: Asian non Hispanic, 4: American Indian non Hispanic, 5: Black non Hispanic, 6: Total


    //put it all together
    sqlstring = basequery + "(" + reg_numstring + ") AND " + "(" + yearstring + ") AND " + "(" + agestring + ") AND " + "(" + racestring + ")" + groupby + ";";

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