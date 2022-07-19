module.exports = function(app, pg, conString) {
    //Modified 7/5/2022 for testing, remove the "test" option from the programwhen in production
    // respond with "Hello World!" on the homepage
    app.get('/county_sya_race_estimates_current', function(req, res) {

        //table name
		//MOD 7/5/2022 Modification for the 2022 data files
		//if (req.query.test) {
		//var schtbl = "estimates.county_sya_race_estimates_current";
		//} else {
        var schtbl = "estimates.county_sya_race_estimates_current";
        //}
		
        var gender = "";
        var genderstring = " sex='M' OR sex='F' "; //


        //adjustments to query if sex is a parameter
        if (req.query.sex) {
            if (req.query.sex !== "f" && req.query.sex !== "f" && req.query.sex !== "m" && req.query.sex !== "M" && req.query.sex !== "b" && req.query.sex !== "B") {
                res.send('your sex parameter is not valid! must be one of the following: f,F,m,M,b,B.  Leaving out this parameter defaults to the sum of male + female.');
                return;
            }
            if (req.query.sex === "f" || req.query.sex === "F") {
                gender = "sex,";
                genderstring = " sex='F' ";
            }
            if (req.query.sex === "m" || req.query.sex === "M") {
                gender = "sex,";
                genderstring = " sex='M' ";
            }
            if (req.query.sex === "b" || req.query.sex === "B") {
                gender = "sex,";
            }
        }


        //schema.table combination
        var basequery = "SELECT " + gender + "county_fips,year,age,race,ethnicity,SUM(count) as count from " + schtbl + " WHERE ";
        var groupby = " GROUP BY " + gender + "county_fips,year,age,race,ethnicity ORDER BY county_fips,year,age,race,ethnicity";


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
                basequery = "SELECT " + gender + "year, SUM(count) as count from " + schtbl + " WHERE ";
                //"SELECT county,county_fips,year,age,race,count from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "year ORDER BY " + gender + "year";
            }
            //opt2: county_fips
            if (req.query.group === "opt2") {
                basequery = "SELECT " + gender + "county_fips, SUM(count) as count from " + schtbl + " WHERE ";
                //"SELECT county,county_fips,year,age,race,count from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "county_fips ORDER BY " + gender + "county_fips";
            }
            //opt3: age
            if (req.query.group === "opt3") {
                basequery = "SELECT " + gender + "age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age ORDER BY " + gender + "age";
            }
            //opt4: race
            if (req.query.group === "opt4") {
                basequery = "SELECT " + gender + "race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "race ORDER BY " + gender + "race";
            }
            //opt5: year, county_fips
            if (req.query.group === "opt5") {
                basequery = "SELECT " + gender + "year, county_fips, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, county_fips ORDER BY " + gender + "year, county_fips";
            }
            //opt6: year, age
            if (req.query.group === "opt6") {
                basequery = "SELECT " + gender + "year, age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age ORDER BY " + gender + "year, age";
            }
            //opt7: year, race
            if (req.query.group === "opt7") {
                basequery = "SELECT " + gender + "year, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, race ORDER BY " + gender + "year, race";
            }
            //opt8: county_fips, age
            if (req.query.group === "opt8") {
                basequery = "SELECT " + gender + "county_fips, age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "county_fips, age ORDER BY " + gender + "county_fips, age";
            }
            //opt9: county_fips, race
            if (req.query.group === "opt9") {
                basequery = "SELECT " + gender + "county_fips, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "county_fips, race ORDER BY " + gender + "county_fips, race";
            }
            //opt10: age, race
            if (req.query.group === "opt10") {
                basequery = "SELECT " + gender + "age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age, race ORDER BY " + gender + "age, race";
            }
            //opt11: year, county_fips, age
            if (req.query.group === "opt11") {
                basequery = "SELECT " + gender + "year, county_fips, age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, county_fips, age ORDER BY " + gender + "year, county_fips, age";
            }
            //opt12: year, county_fips, race
            if (req.query.group === "opt12") {
                basequery = "SELECT " + gender + "year, county_fips, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, county_fips, race ORDER BY " + gender + "year, county_fips, race";
            }
            //opt13: year, age, race
            if (req.query.group === "opt13") {
                basequery = "SELECT " + gender + "year, age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age, race ORDER BY " + gender + "year, age, race";
            }
            //opt14: county_fips, age, race
            if (req.query.group === "opt14") {
                basequery = "SELECT " + gender + "county_fips, age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "county_fips, age, race ORDER BY " + gender + "county_fips, age, race";
            }
            //opt4: ethnicity
            if (req.query.group === "opt15") {
                basequery = "SELECT " + gender + "ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "ethnicity ORDER BY " + gender + "ethnicity";
            }
            
            //opt4: race
            if (req.query.group === "opt16") {
                basequery = "SELECT " + gender + "year, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, ethnicity ORDER BY " + gender + "year, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt17") {
                basequery = "SELECT " + gender + "county_fips, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "county_fips, ethnicity ORDER BY " + gender + "county_fips, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt18") {
                basequery = "SELECT " + gender + "age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age, ethnicity ORDER BY " + gender + "age, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt19") {
                basequery = "SELECT " + gender + "race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "race, ethnicity ORDER BY " + gender + "race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt20") {
                basequery = "SELECT " + gender + "year, county_fips, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, county_fips, ethnicity ORDER BY " + gender + "year, county_fips, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt21") {
                basequery = "SELECT " + gender + "year, age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age, ethnicity ORDER BY " + gender + "year, age, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt22") {
                basequery = "SELECT " + gender + "year, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, race, ethnicity ORDER BY " + gender + "year, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt23") {
                basequery = "SELECT " + gender + "county_fips, age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "county_fips, age, ethnicity ORDER BY " + gender + "county_fips, age, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt24") {
                basequery = "SELECT " + gender + "county_fips, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "county_fips, race, ethnicity ORDER BY " + gender + "county_fips, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt25") {
                basequery = "SELECT " + gender + "age, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age, race, ethnicity ORDER BY " + gender + "age, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt26") {
                basequery = "SELECT " + gender + "year, county_fips, age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, county_fips, age, race ORDER BY " + gender + "year, county_fips, age, race";
            }
            //opt4: race
            if (req.query.group === "opt27") {
                basequery = "SELECT " + gender + "year, age, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age, race, ethnicity ORDER BY " + gender + "year, age, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt28") {
                basequery = "SELECT " + gender + "year, county_fips, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, county_fips, race, ethnicity ORDER BY " + gender + "year, county_fips, race, ethnicity"
            }
            //opt4: race
            if (req.query.group === "opt28") {
                basequery = "SELECT " + gender + "year, county_fips, age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, county_fips, age, ethnicity ORDER BY " + gender + "year, county_fips, age, ethnicity"
            }

        }

        var yearstring = "";
        var countystring = "";
        var agestring = "";
        var racestring = "";
        var ethnicitystring = "";

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
        
        //exit if no age
        if (!req.query.ethnicity) {
            res.send('please specify a single ethnicity (or comma separated list of races - or "all")');
            return;
        }


        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated (valid range: 2011-2014)
        //age: (integers) : comma separated:  range from 0 to 90
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
		//MOD 7/5/2022
        var year = (req.query.year).split(",");
		//if (req.query.test) {
			var yeardomain = ["2020", "2021"];
		//} else {
        //var yeardomain = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
        //}
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
		//MOD 7/5/2022
        var race = (req.query.race).split(",");
		//if (req.query.test) {
			var racedomain = ["1","2","3","4","5","6"];
		//} else {
		//	var racedomain = ["1", "2", "3", "4"];
		//}
        if (!validate(race, racedomain)) {
            res.send('one of your race inputs is not valid!');
            return;
        }

        //MOD 7/5/2022
		//if (req.query.test) {
		 for (j = 0; j < race.length; j++) {
            if (race[j] === "1") {
                race[j] = "'White alone'";
            }
            if (race[j] === "2") {
                race[j] = "'Black or African American alone'";
            }
            if (race[j] === "3") {
                race[j] = "'American Indian and Alaska Native alone'";
            }
           if (race[j] === "4") {
                race[j] = "'Asian alone'";
            }
            if (race[j] === "5") {
                race[j] = "'Native Hawaiian or Other Pacific Islander alone'";
            }
        if (race[j] === "6") {
                race[j] = "'Two or more '";
            }
			racestring = racestring + schtbl + ".race = " + race[j] + " OR ";
        }
		/*
		} else {
        //create sql selector for races
        for (j = 0; j < race.length; j++) {
            /if (race[j] === "1") {
                race[j] = "'Hispanic'";
            }
            if (race[j] === "1") {
                race[j] = "'White'";
            }
            if (race[j] === "2") {
                race[j] = "'Asian/Pacific Islander'";
            }
            if (race[j] === "3") {
                race[j] = "'American Indian'";
            }
            if (race[j] === "4") {
                race[j] = "'Black'";
            }
            //if (race[j] === "6") {
                //race[j] = "'Total'";
            //}
	            racestring = racestring + schtbl + ".race = " + race[j] + " OR ";
        }
		 }
		*/
        //remove stray OR from end of sql selector
        racestring = racestring.substring(0, racestring.length - 3);

        // 1: Hispanic, 2: White non Hispanic, 3: Asian non Hispanic, 4: American Indian non Hispanic, 5: Black non Hispanic, 6: Total

        
        //create array of ethnicities
        var ethnicity = (req.query.ethnicity).split(",");
        var ethnicitydomain = ["1", "2"];
        if (!validate(ethnicity, ethnicitydomain)) {
            res.send('one of your ethnicity inputs is not valid!');
            return;
        }

        //create sql selector for ethnicity
        for (j = 0; j < ethnicity.length; j++) {
            if (ethnicity[j] === "1") {
                ethnicity[j] = "'Hispanic'";
            }
            if (ethnicity[j] === "2") {
                ethnicity[j] = "'Non Hispanic'";
            }
            ethnicitystring = ethnicitystring + schtbl + ".ethnicity = " + ethnicity[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        ethnicitystring = ethnicitystring.substring(0, ethnicitystring.length - 3);
        

        //put it all together
        sqlstring = basequery + "(" + genderstring + ") AND " + "(" + countystring + ") AND " + "(" + yearstring + ") AND " + "(" + agestring + ") AND " + "(" + racestring + ") AND " + "(" + ethnicitystring + ")" + groupby + ";";

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


    app.get('/sya-race-estimatesYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select year from estimates.county_sya_race_estimates where county_fips=1 and age=0 and sex='M' and race='White' and ethnicity='Hispanic Origin' order by year asc;", function(err, result) {
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


    app.get('/sya-race-estimatesAGE', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select age from estimates.county_sya_race_estimates where county_fips=1 and year=2011 and sex='M' and race='White' and ethnicity='Hispanic Origin' order by age asc;", function(err, result) {
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


    app.get('/sya-race-estimates_regions', function(req, res) {

        //table name
        var schtbl = "estimates.county_sya_race_estimates_region";

        var gender = "";
        var genderstring = " sex='M' OR sex='F' "; //


        //adjustments to query if sex is a parameter
        if (req.query.sex) {
            if (req.query.sex !== "f" && req.query.sex !== "f" && req.query.sex !== "m" && req.query.sex !== "M" && req.query.sex !== "b" && req.query.sex !== "B") {
                res.send('your sex parameter is not valid! must be one of the following: f,F,m,M,b,B.  Leaving out this parameter defaults to the sum of male + female.');
                return;
            }
            if (req.query.sex === "f" || req.query.sex === "F") {
                gender = "sex,";
                genderstring = " sex='F' ";
            }
            if (req.query.sex === "m" || req.query.sex === "M") {
                gender = "sex,";
                genderstring = " sex='M' ";
            }
            if (req.query.sex === "b" || req.query.sex === "B") {
                gender = "sex,";
            }
        }


        //schema.table combination
        var basequery = "SELECT " + gender + "reg_num,year,age,race,ethnicity,SUM(count) as count from " + schtbl + " WHERE ";
        var groupby = " GROUP BY " + gender + "reg_num,year,age,race,ethnicity ORDER BY reg_num,year,age,race,ethnicity";


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
                basequery = "SELECT " + gender + "year, SUM(count) as count from " + schtbl + " WHERE ";
                //"SELECT region,reg_num,year,age,race,count from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "year ORDER BY " + gender + "year";
            }
            //opt2: reg_num
            if (req.query.group === "opt2") {
                basequery = "SELECT " + gender + "reg_num, SUM(count) as count from " + schtbl + " WHERE ";
                //"SELECT region,reg_num,year,age,race,count from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "reg_num ORDER BY " + gender + "reg_num";
            }
            //opt3: age
            if (req.query.group === "opt3") {
                basequery = "SELECT " + gender + "age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age ORDER BY " + gender + "age";
            }
            //opt4: race
            if (req.query.group === "opt4") {
                basequery = "SELECT " + gender + "race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "race ORDER BY " + gender + "race";
            }
            //opt5: year, reg_num
            if (req.query.group === "opt5") {
                basequery = "SELECT " + gender + "year, reg_num, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, reg_num ORDER BY " + gender + "year, reg_num";
            }
            //opt6: year, age
            if (req.query.group === "opt6") {
                basequery = "SELECT " + gender + "year, age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age ORDER BY " + gender + "year, age";
            }
            //opt7: year, race
            if (req.query.group === "opt7") {
                basequery = "SELECT " + gender + "year, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, race ORDER BY " + gender + "year, race";
            }
            //opt8: reg_num, age
            if (req.query.group === "opt8") {
                basequery = "SELECT " + gender + "reg_num, age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "reg_num, age ORDER BY " + gender + "reg_num, age";
            }
            //opt9: reg_num, race
            if (req.query.group === "opt9") {
                basequery = "SELECT " + gender + "reg_num, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "reg_num, race ORDER BY " + gender + "reg_num, race";
            }
            //opt10: age, race
            if (req.query.group === "opt10") {
                basequery = "SELECT " + gender + "age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age, race ORDER BY " + gender + "age, race";
            }
            //opt11: year, reg_num, age
            if (req.query.group === "opt11") {
                basequery = "SELECT " + gender + "year, reg_num, age, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, reg_num, age ORDER BY " + gender + "year, reg_num, age";
            }
            //opt12: year, reg_num, race
            if (req.query.group === "opt12") {
                basequery = "SELECT " + gender + "year, reg_num, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, reg_num, race ORDER BY " + gender + "year, reg_num, race";
            }
            //opt13: year, age, race
            if (req.query.group === "opt13") {
                basequery = "SELECT " + gender + "year, age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age, race ORDER BY " + gender + "year, age, race";
            }
            //opt14: reg_num, age, race
            if (req.query.group === "opt14") {
                basequery = "SELECT " + gender + "reg_num, age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "reg_num, age, race ORDER BY " + gender + "reg_num, age, race";
            }
            //opt4: ethnicity
            if (req.query.group === "opt15") {
                basequery = "SELECT " + gender + "ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "ethnicity ORDER BY " + gender + "ethnicity";
            }
            
            //opt4: race
            if (req.query.group === "opt16") {
                basequery = "SELECT " + gender + "year, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, ethnicity ORDER BY " + gender + "year, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt17") {
                basequery = "SELECT " + gender + "reg_num, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "reg_num, ethnicity ORDER BY " + gender + "reg_num, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt18") {
                basequery = "SELECT " + gender + "age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age, ethnicity ORDER BY " + gender + "age, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt19") {
                basequery = "SELECT " + gender + "race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "race, ethnicity ORDER BY " + gender + "race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt20") {
                basequery = "SELECT " + gender + "year, reg_num, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, reg_num, ethnicity ORDER BY " + gender + "year, reg_num, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt21") {
                basequery = "SELECT " + gender + "year, age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age, ethnicity ORDER BY " + gender + "year, age, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt22") {
                basequery = "SELECT " + gender + "year, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, race, ethnicity ORDER BY " + gender + "year, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt23") {
                basequery = "SELECT " + gender + "reg_num, age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "reg_num, age, ethnicity ORDER BY " + gender + "county_fips, age, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt24") {
                basequery = "SELECT " + gender + "reg_num, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "reg_num, race, ethnicity ORDER BY " + gender + "reg_num, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt25") {
                basequery = "SELECT " + gender + "age, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age, race, ethnicity ORDER BY " + gender + "age, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt26") {
                basequery = "SELECT " + gender + "year, reg_num, age, race, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, reg_num, age, race ORDER BY " + gender + "year, reg_num, age, race";
            }
            //opt4: race
            if (req.query.group === "opt27") {
                basequery = "SELECT " + gender + "year, age, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, age, race, ethnicity ORDER BY " + gender + "year, age, race, ethnicity";
            }
            //opt4: race
            if (req.query.group === "opt28") {
                basequery = "SELECT " + gender + "year, reg_num, race, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, reg_num, race, ethnicity ORDER BY " + gender + "year, reg_num, race, ethnicity"
            }
            //opt4: race
            if (req.query.group === "opt28") {
                basequery = "SELECT " + gender + "year, reg_num, age, ethnicity, SUM(count) as count from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "year, reg_num, age, ethnicity ORDER BY " + gender + "year, reg_num, age, ethnicity"
            }

        }

        var yearstring = "";
        var reg_numstring = "";
        var agestring = "";
        var racestring = "";
        var ethnicitystring = "";

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

        //exit if no race
        if (!req.query.race) {
            res.send('please specify a single race (or comma separated list of races - or "all")');
            return;
        }
        
         //exit if no ethnicity
        if (!req.query.ethnicity) {
            res.send('please specify a single ethnicity (or comma separated list of races - or "all")');
            return;
        }


        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //reg_num: (integers) : region numbers, comma separated
        //year: (integers) : comma separated (valid range: 2011-2014)
        //age: (integers) : comma separated:  range from 0 to 90
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
        var year = (req.query.year).split(",");
        var yeardomain = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
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
        var racedomain = ["1", "2", "3", "4"];
        if (!validate(race, racedomain)) {
            res.send('one of your race inputs is not valid!');
            return;
        }

        //create sql selector for races
        for (j = 0; j < race.length; j++) {
            //if (race[j] === "1") {
                //race[j] = "'Hispanic'";
            //}
            if (race[j] === "1") {
                race[j] = "'White'";
            }
            if (race[j] === "2") {
                race[j] = "'Asian/Pacific Islander'";
            }
            if (race[j] === "3") {
                race[j] = "'American Indian'";
            }
            if (race[j] === "4") {
                race[j] = "'Black'";
            }
            //if (race[j] === "6") {
                //race[j] = "'Total'";
            //}
            racestring = racestring + schtbl + ".race = " + race[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        racestring = racestring.substring(0, racestring.length - 3);
        
        //create array of ethnicities
        var ethnicity = (req.query.ethnicity).split(",");
        var ethnicitydomain = ["1", "2"];
        if (!validate(ethnicity, ethnicitydomain)) {
            res.send('one of your ethnicity inputs is not valid!');
            return;
        }

        //create sql selector for ethnicity
        for (j = 0; j < ethnicity.length; j++) {
            if (ethnicity[j] === "1") {
                ethnicity[j] = "'Hispanic'";
            }
            if (ethnicity[j] === "2") {
                ethnicity[j] = "'Non Hispanic'";
            }
            ethnicitystring = ethnicitystring + schtbl + ".ethnicity = " + ethnicity[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        ethnicitystring = ethnicitystring.substring(0, ethnicitystring.length - 3);

        // 1: Hispanic, 2: White non Hispanic, 3: Asian non Hispanic, 4: American Indian non Hispanic, 5: Black non Hispanic, 6: Total


        //put it all together
        sqlstring = basequery + "(" + genderstring + ") AND " + "(" + reg_numstring + ") AND " + "(" + yearstring + ") AND " + "(" + agestring + ") AND " + "(" + racestring + ") AND " + "(" + ethnicitystring + ")" + groupby + ";";

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
