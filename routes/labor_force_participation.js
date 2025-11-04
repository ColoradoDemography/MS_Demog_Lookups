module.exports = function(app, pg, conString) {


    app.get('/labor-force', function(req, res) {

        //table name
        var schtbl = "estimates.labor_force_participation";

        var gender = "";
        var genderstring = " gender='Male' OR gender='Female' "; //


        //adjustments to query if gender is a parameter
        if (req.query.gender) {
            if (req.query.gender !== "f" && req.query.gender !== "f" && req.query.gender !== "m" && req.query.gender !== "M" && req.query.gender !== "b" && req.query.gender !== "B") {
                res.send('your gender parameter is not valid! must be one of the following: f,F,m,M,b,B.  Leaving out this parameter defaults to the sum of male + female.');
                return;
            }
            if (req.query.gender === "f" || req.query.gender === "F") {
                gender = "gender,";
                genderstring = " gender='Female' ";
            }
            if (req.query.gender === "m" || req.query.gender === "M") {
                gender = "gender,";
                genderstring = " gender='Male' ";
            }
            if (req.query.gender === "b" || req.query.gender === "B") {
                gender = "gender,";
            }
        }


        //schema.table combination
        var basequery = "SELECT " + gender + "area_code,population_year,age_group,SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
        var groupby = " GROUP BY " + gender + "area_code,population_year,age_group ORDER BY area_code,population_year,age_group";


        //GROUP BY
        //opt0: = none or all = base query
        //opt1: population_year
        //opt2: area_code
        //opt3: age_group
        //opt4: population_year, area_code
        //opt5: population_year, age_group
        //opt6: area_code, age_group

        //var basequery = "SELECT " + gender + "area_code,population_year,age_group,SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
        //var groupby = " GROUP BY " + gender + "area_code,population_year,age_group ORDER BY area_code,population_year,age_group";

        if (req.query.group) {

            //opt1: population_year
            if (req.query.group === "opt1") {
                basequery = "SELECT " + gender + "population_year, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "population_year ORDER BY " + gender + "population_year";
            }
            //opt2: area_code
            if (req.query.group === "opt2") {
                basequery = "SELECT " + gender + "area_code, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "area_code ORDER BY " + gender + "area_code";
            }
            //opt3: age_group
            if (req.query.group === "opt3") {
                basequery = "SELECT " + gender + "age_group, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age_group ORDER BY " + gender + "age_group";
            }
            //opt4: population_year, area_code
            if (req.query.group === "opt4") {
                basequery = "SELECT " + gender + "population_year, area_code, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "population_year, area_code ORDER BY " + gender + "population_year, area_code";
            }
            //opt5: population_year, age_group
            if (req.query.group === "opt5") {
                basequery = "SELECT " + gender + "population_year, age_group, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "population_year, age_group ORDER BY " + gender + "population_year, age_group";
            }
            //opt6: area_code, age_group
            if (req.query.group === "opt6") {
                basequery = "SELECT " + gender + "area_code, age_group, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "area_code, age_group ORDER BY " + gender + "area_code, age_group";
            }

        }

        var population_yearstring = "";
        var countystring = "";
        var age_groupstring = "";
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

        //exit if no age_group
        if (!req.query.age) {
            res.send('please specify a single population_year of age_group (or comma separated list of age_groups - or "all")');
            return;
        }



        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //county: (integers) : fips codes, comma separated
        //population_year: (integers) : comma separated (valid range: 2010-2040)
        //age_group: (integers) : comma separated:  a,b,c,d,e,f,g
        //a = 16 to 19
        //b = 20 to 24
        //c = 25 to 34
        //d = 35 to 44
        //e = 45 to 54
        //f = 55 to 64
        //g = 65 to 74
		//h = 75 and Older


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
        var countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
        if (!validate(county, countydomain)) {
            res.send('one of your county inputs is not valid!');
            return;
        }

        //create sql selector for population_years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".area_code = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        countystring = countystring.substring(0, countystring.length - 3);


        //create array of population_years
        var population_year = (req.query.year).split(",");
        var population_yeardomain = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050", "2051", "2052", "2053", "2054", "2055", "2056", "2057", "2058", "2059", "2060"];
        if (!validate(population_year, population_yeardomain)) {
            res.send('one of your population_year inputs is not valid!');
            return;
        }

        //create sql selector for population_years
        for (j = 0; j < population_year.length; j++) {
            population_yearstring = population_yearstring + schtbl + ".population_year = " + population_year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        population_yearstring = population_yearstring.substring(0, population_yearstring.length - 3);


        //create array of age_groups
        var age_group = (req.query.age).split(",");
        var age_groupdomain = ["a", "b", "c", "d", "e", "f", "g", "h"];
        if (!validate(age_group, age_groupdomain)) {
            res.send('one of your age_group inputs is not valid!');
            return;
        }


        //create sql selector for races
        for (j = 0; j < age_group.length; j++) {
            if (age_group[j] === "a") {
                age_group[j] = "'16 to 19'";
            }
            if (age_group[j] === "b") {
                age_group[j] = "'20 to 24'";
            }
            if (age_group[j] === "c") {
                age_group[j] = "'25 to 34'";
            }
            if (age_group[j] === "d") {
                age_group[j] = "'35 to 44'";
            }
            if (age_group[j] === "e") {
                age_group[j] = "'45 to 54'";
            }
            if (age_group[j] === "f") {
                age_group[j] = "'55 to 64'";
            }
            if (age_group[j] === "g") {
                age_group[j] = "'65 to 74'";
            }
            if (age_group[j] === "h") {
                age_group[j] = "'75 and over'";
            }
            age_groupstring = age_groupstring + schtbl + ".age_group = " + age_group[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        age_groupstring = age_groupstring.substring(0, age_groupstring.length - 3);




        //put it all together
        sqlstring = basequery + "(" + genderstring + ") AND " + "(" + countystring + ") AND " + "(" + population_yearstring + ") AND " + "(" + age_groupstring + ") " + groupby + ";";

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


    app.get('/labor-forceYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select population_year from estimates.labor_force_participation where area_code=0 and gender='Female' and age_group='16 to 19' order by population_year asc;", function(err, result) {
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


    app.get('/labor-force_region', function(req, res) {

        //table name
        var schtbl = "estimates.labor_force_participation_region";

        var gender = "";
        var genderstring = " gender='Male' OR gender='Female' "; //


        //adjustments to query if gender is a parameter
        if (req.query.gender) {
            if (req.query.gender !== "f" && req.query.gender !== "f" && req.query.gender !== "m" && req.query.gender !== "M" && req.query.gender !== "b" && req.query.gender !== "B") {
                res.send('your gender parameter is not valid! must be one of the following: f,F,m,M,b,B.  Leaving out this parameter defaults to the sum of male + female.');
                return;
            }
            if (req.query.gender === "f" || req.query.gender === "F") {
                gender = "gender,";
                genderstring = " gender='Female' ";
            }
            if (req.query.gender === "m" || req.query.gender === "M") {
                gender = "gender,";
                genderstring = " gender='Male' ";
            }
            if (req.query.gender === "b" || req.query.gender === "B") {
                gender = "gender,";
            }
        }


        //schema.table combination
        var basequery = "SELECT " + gender + "reg_num,population_year,age_group,SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
        var groupby = " GROUP BY " + gender + "reg_num,population_year,age_group ORDER BY reg_num,population_year,age_group";


        //GROUP BY
        //opt0: = none or all = base query
        //opt1: population_year
        //opt2: reg_num
        //opt3: age_group
        //opt4: population_year, reg_num
        //opt5: population_year, age_group
        //opt6: reg_num, age_group

        //var basequery = "SELECT " + gender + "reg_num,population_year,age_group,SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
        //var groupby = " GROUP BY " + gender + "reg_num,population_year,age_group ORDER BY reg_num,population_year,age_group";

        if (req.query.group) {

            //opt1: population_year
            if (req.query.group === "opt1") {
                basequery = "SELECT " + gender + "population_year, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "population_year ORDER BY " + gender + "population_year";
            }
            //opt2: reg_num
            if (req.query.group === "opt2") {
                basequery = "SELECT " + gender + "reg_num, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = " GROUP BY " + gender + "reg_num ORDER BY " + gender + "reg_num";
            }
            //opt3: age_group
            if (req.query.group === "opt3") {
                basequery = "SELECT " + gender + "age_group, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "age_group ORDER BY " + gender + "age_group";
            }
            //opt4: population_year, reg_num
            if (req.query.group === "opt4") {
                basequery = "SELECT " + gender + "population_year, reg_num, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "population_year, reg_num ORDER BY " + gender + "population_year, reg_num";
            }
            //opt5: population_year, age_group
            if (req.query.group === "opt5") {
                basequery = "SELECT " + gender + "population_year, age_group, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "population_year, age_group ORDER BY " + gender + "population_year, age_group";
            }
            //opt6: reg_num, age_group
            if (req.query.group === "opt6") {
                basequery = "SELECT " + gender + "reg_num, age_group, SUM(laborforce) as laborforce,SUM(cni_pop_16pl) as cni_pop_16pl, (SUM(laborforce)/SUM(cni_pop_16pl)) as participationrate from " + schtbl + " WHERE ";
                groupby = "GROUP BY " + gender + "reg_num, age_group ORDER BY " + gender + "reg_num, age_group";
            }

        }

        var population_yearstring = "";
        var reg_numstring = "";
        var age_groupstring = "";
        var racestring = "";

        var sqlstring;

        var i, j; //iterators


        //exit if no reg_num
        if (!req.query.reg_num) {
            res.send('please specify a reg_num (or comma separated list of counties)');
            return;
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
            return;
        }

        //exit if no age_group
        if (!req.query.age) {
            res.send('please specify a single population_year of age_group (or comma separated list of age_groups - or "all")');
            return;
        }



        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //reg_num: (integers) : region numbers, comma separated
        //population_year: (integers) : comma separated (valid range: 2010-2040)
        //age_group: (integers) : comma separated:  a,b,c,d,e,f,g
        //a = 16 to 19
        //b = 20 to 24
        //c = 25 to 34
        //d = 35 to 44
        //e = 45 to 54
        //f = 55 to 64
        //g = 65+


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

        //create sql selector for population_years
        for (j = 0; j < reg_num.length; j++) {
            reg_numstring = reg_numstring + schtbl + ".reg_num = " + reg_num[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        reg_numstring = reg_numstring.substring(0, reg_numstring.length - 3);


        //create array of population_years
        var population_year = (req.query.year).split(",");
        var population_yeardomain = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040", "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050", "2051", "2052", "2053", "2054", "2055", "2056", "2057", "2058", "2059", "2060"];
        if (!validate(population_year, population_yeardomain)) {
	    res.send('one of your population_year inputs is not valid!');
            return;
        }

        //create sql selector for population_years
        for (j = 0; j < population_year.length; j++) {
            population_yearstring = population_yearstring + schtbl + ".population_year = " + population_year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        population_yearstring = population_yearstring.substring(0, population_yearstring.length - 3);


        //create array of age_groups
        var age_group = (req.query.age).split(",");
        var age_groupdomain = ["a", "b", "c", "d", "e", "f", "g", "h"];
        if (!validate(age_group, age_groupdomain)) {
            res.send('one of your age_group inputs is not valid!');
            return;
        }


        //create sql selector for races
        for (j = 0; j < age_group.length; j++) {
            if (age_group[j] === "a") {
                age_group[j] = "'16 to 19'";
            }
            if (age_group[j] === "b") {
                age_group[j] = "'20 to 24'";
            }
            if (age_group[j] === "c") {
                age_group[j] = "'25 to 34'";
            }
            if (age_group[j] === "d") {
                age_group[j] = "'35 to 44'";
            }
            if (age_group[j] === "e") {
                age_group[j] = "'45 to 54'";
            }
            if (age_group[j] === "f") {
                age_group[j] = "'55 to 64'";
            }
            if (age_group[j] === "g") {
                age_group[j] = "'65 to 74'";
            }
            if (age_group[j] === "h") {
                age_group[j] = "'75 and over'";
            }
            age_groupstring = age_groupstring + schtbl + ".age_group = " + age_group[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        age_groupstring = age_groupstring.substring(0, age_groupstring.length - 3);




        //put it all together
        sqlstring = basequery + "(" + genderstring + ") AND " + "(" + reg_numstring + ") AND " + "(" + population_yearstring + ") AND " + "(" + age_groupstring + ") " + groupby + ";";

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
