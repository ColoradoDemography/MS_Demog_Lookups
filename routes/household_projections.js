module.exports = function(app, pg, conString) {


    app.get('/household', function(req, res) {

        //table name
        var schtbl = "estimates.household_projections";



        //schema.table combination
        var basequery = "SELECT area_code,year,household_type_id,age_group_id,SUM(total_households) as total_households from " + schtbl + " WHERE ";
        var groupby = " GROUP BY area_code,year,household_type_id,age_group_id ORDER BY area_code,year,household_type_id,age_group_id";


        //GROUP BY
        //opt0: = none or all = base query
        //opt1: year
        //opt2: area_code
        //opt3: age_group_id
        //opt4: household_type_id
        //opt5: year, area_code
        //opt6: year, age_group_id
        //opt7: year, household_type_id
        //opt8: area_code, age_group_id
        //opt9: area_code, household_type_id
        //opt10: age_group_id, household_type_id
        //opt11: year, area_code, age_group_id
        //opt12: year, area_code, household_type_id
        //opt13: area_code, age_group_id, household_type_id


        if (req.query.group) {

            //opt1: year
            if (req.query.group === "opt1") {
                basequery = "SELECT year, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = " GROUP BY year ORDER BY year";
            }
            //opt2: area_code
            if (req.query.group === "opt2") {
                basequery = "SELECT area_code, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = " GROUP BY area_code ORDER BY area_code";
            }
            //opt3: age_group_id
            if (req.query.group === "opt3") {
                basequery = "SELECT age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY age_group_id ORDER BY age_group_id";
            }
            //opt4: household_type_id
            if (req.query.group === "opt4") {
                basequery = "SELECT household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY household_type_id ORDER BY household_type_id";
            }
            //opt5: year, area_code
            if (req.query.group === "opt5") {
                basequery = "SELECT year, area_code, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, area_code ORDER BY year, area_code";
            }
            //opt6: year, age_group_id
            if (req.query.group === "opt6") {
                basequery = "SELECT year, age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, age_group_id ORDER BY year, age_group_id";
            }
            //opt7: year, household_type_id
            if (req.query.group === "opt7") {
                basequery = "SELECT year, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, household_type_id ORDER BY year, household_type_id";
            }
            //opt8: area_code, age_group_id
            if (req.query.group === "opt8") {
                basequery = "SELECT area_code, age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY area_code, age_group_id ORDER BY area_code, age_group_id";
            }
            //opt9: area_code, household_type_id
            if (req.query.group === "opt9") {
                basequery = "SELECT area_code, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY area_code, household_type_id ORDER BY year, area_code, household_type_id";
            }
            //opt10: age_group_id, household_type_id
            if (req.query.group === "opt10") {
                basequery = "SELECT age_group_id, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY age_group_id, household_type_id ORDER BY age_group_id, household_type_id";
            }
            //opt11: year, area_code, age_group_id
            if (req.query.group === "opt11") {
                basequery = "SELECT year, area_code, age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, area_code, age_group_id ORDER BY year, area_code, age_group_id";
            }
            //opt12: year, area_code, household_type_id
            if (req.query.group === "opt12") {
                basequery = "SELECT year, area_code, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, area_code, household_type_id ORDER BY year, area_code, household_type_id";
            }
            //opt13: area_code, age_group_id, household_type_id
            if (req.query.group === "opt13") {
                basequery = "SELECT area_code, age_group_id, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY area_code, age_group_id, household_type_id ORDER BY area_code, age_group_id, household_type_id";
            }
        }

        var yearstring = "";
        var countystring = "";
        var age_group_idstring = "";
        var household_idstring = "";

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
            res.send('please specify an age_group_id (or comma separated list of age_group_ids)');
            return;
        }

        //exit if no household
        if (!req.query.household) {
            res.send('please specify a household_id (or comma separated list of household_ids)');
            return;
        }

        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated (valid range: 2010-2040)
        //age_group_id: (integers) : 
        //0 = Total
        //1 = 18-24
        //2 = 25-44
        //3 = 45-64
        //4 = 65 & Over
        //household_id: (integers) :
        //0 = All Households
        //1 = One adult with no children
        //2 = One adult with children
        //3 = More than one adult with no children
        //4 = More than one adult with children


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

        //create sql selector for years
        for (j = 0; j < county.length; j++) {
            countystring = countystring + schtbl + ".area_code = " + county[j] + " OR ";
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


        //create array of age_group_ids
        var age_group_id = (req.query.age).split(",");
        var age_group_iddomain = ["0", "1", "2", "3", "4"];
        if (!validate(age_group_id, age_group_iddomain)) {
            res.send('one of your age_group_id inputs is not valid!');
            return;
        }


        //create sql selector for races
        for (j = 0; j < age_group_id.length; j++) {
            age_group_idstring = age_group_idstring + schtbl + ".age_group_id = " + age_group_id[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        age_group_idstring = age_group_idstring.substring(0, age_group_idstring.length - 3);



        //create array of age_group_ids
        var household_id = (req.query.household).split(",");
        var household_iddomain = ["0", "1", "2", "3", "4"];
        if (!validate(household_id, household_iddomain)) {
            res.send('one of your household inputs is not valid!');
            return;
        }


        //create sql selector for races
        for (j = 0; j < household_id.length; j++) {
            household_idstring = household_idstring + schtbl + ".household_type_id = " + household_id[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        household_idstring = household_idstring.substring(0, household_idstring.length - 3);



        //put it all together
        sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") AND " + "(" + age_group_idstring + ") AND " + "(" + household_idstring + ") " + groupby + ";";

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


    app.get('/householdYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select year from estimates.household_projections where area_code=0 and household_type_id=0 and age_group_id=0 order by year asc;", function(err, result) {
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


    app.get('/household_region', function(req, res) {

        //table name
        var schtbl = "estimates.household_projections_region";



        //schema.table combination
        var basequery = "SELECT reg_num,year,household_type_id,age_group_id,SUM(total_households) as total_households from " + schtbl + " WHERE ";
        var groupby = " GROUP BY reg_num,year,household_type_id,age_group_id ORDER BY reg_num,year,household_type_id,age_group_id";


        //GROUP BY
        //opt0: = none or all = base query
        //opt1: year
        //opt2: reg_num
        //opt3: age_group_id
        //opt4: household_type_id
        //opt5: year, reg_num
        //opt6: year, age_group_id
        //opt7: year, household_type_id
        //opt8: reg_num, age_group_id
        //opt9: reg_num, household_type_id
        //opt10: age_group_id, household_type_id
        //opt11: year, reg_num, age_group_id
        //opt12: year, reg_num, household_type_id
        //opt13: reg_num, age_group_id, household_type_id


        if (req.query.group) {

            //opt1: year
            if (req.query.group === "opt1") {
                basequery = "SELECT year, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = " GROUP BY year ORDER BY year";
            }
            //opt2: reg_num
            if (req.query.group === "opt2") {
                basequery = "SELECT reg_num, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = " GROUP BY reg_num ORDER BY reg_num";
            }
            //opt3: age_group_id
            if (req.query.group === "opt3") {
                basequery = "SELECT age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY age_group_id ORDER BY age_group_id";
            }
            //opt4: household_type_id
            if (req.query.group === "opt4") {
                basequery = "SELECT household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY household_type_id ORDER BY household_type_id";
            }
            //opt5: year, reg_num
            if (req.query.group === "opt5") {
                basequery = "SELECT year, reg_num, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, reg_num ORDER BY year, reg_num";
            }
            //opt6: year, age_group_id
            if (req.query.group === "opt6") {
                basequery = "SELECT year, age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, age_group_id ORDER BY year, age_group_id";
            }
            //opt7: year, household_type_id
            if (req.query.group === "opt7") {
                basequery = "SELECT year, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, household_type_id ORDER BY year, household_type_id";
            }
            //opt8: reg_num, age_group_id
            if (req.query.group === "opt8") {
                basequery = "SELECT reg_num, age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY reg_num, age_group_id ORDER BY reg_num, age_group_id";
            }
            //opt9: reg_num, household_type_id
            if (req.query.group === "opt9") {
                basequery = "SELECT reg_num, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY reg_num, household_type_id ORDER BY year, reg_num, household_type_id";
            }
            //opt10: age_group_id, household_type_id
            if (req.query.group === "opt10") {
                basequery = "SELECT age_group_id, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY age_group_id, household_type_id ORDER BY age_group_id, household_type_id";
            }
            //opt11: year, reg_num, age_group_id
            if (req.query.group === "opt11") {
                basequery = "SELECT year, reg_num, age_group_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, reg_num, age_group_id ORDER BY year, reg_num, age_group_id";
            }
            //opt12: year, reg_num, household_type_id
            if (req.query.group === "opt12") {
                basequery = "SELECT year, reg_num, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY year, reg_num, household_type_id ORDER BY year, reg_num, household_type_id";
            }
            //opt13: reg_num, age_group_id, household_type_id
            if (req.query.group === "opt13") {
                basequery = "SELECT reg_num, age_group_id, household_type_id, SUM(total_households) as total_households from " + schtbl + " WHERE ";
                groupby = "GROUP BY reg_num, age_group_id, household_type_id ORDER BY reg_num, age_group_id, household_type_id";
            }
        }

        var yearstring = "";
        var reg_numstring = "";
        var age_group_idstring = "";
        var household_idstring = "";

        var sqlstring;

        var i, j; //iterators


        //exit if no reg_num
        if (!req.query.reg_num) {
            res.send('please specify a region number (or comma separated list of region numbers)');
            return;
        }

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
            return;
        }

        //exit if no age
        if (!req.query.age) {
            res.send('please specify an age_group_id (or comma separated list of age_group_ids)');
            return;
        }

        //exit if no household
        if (!req.query.household) {
            res.send('please specify a household_id (or comma separated list of household_ids)');
            return;
        }

        //VALIDATE ALL INPUT ONCE IN ARRAYS
        //reg_num: (integers) : region numbers, comma separated
        //year: (integers) : comma separated (valid range: 2010-2040)
        //age_group_id: (integers) : 
        //0 = Total
        //1 = 18-24
        //2 = 25-44
        //3 = 45-64
        //4 = 65 & Over
        //household_id: (integers) :
        //0 = All Households
        //1 = One adult with no children
        //2 = One adult with children
        //3 = More than one adult with no children
        //4 = More than one adult with children


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


        //create array of age_group_ids
        var age_group_id = (req.query.age).split(",");
        var age_group_iddomain = ["0", "1", "2", "3", "4"];
        if (!validate(age_group_id, age_group_iddomain)) {
            res.send('one of your age_group_id inputs is not valid!');
            return;
        }


        //create sql selector for races
        for (j = 0; j < age_group_id.length; j++) {
            age_group_idstring = age_group_idstring + schtbl + ".age_group_id = " + age_group_id[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        age_group_idstring = age_group_idstring.substring(0, age_group_idstring.length - 3);



        //create array of age_group_ids
        var household_id = (req.query.household).split(",");
        var household_iddomain = ["0", "1", "2", "3", "4"];
        if (!validate(household_id, household_iddomain)) {
            res.send('one of your household inputs is not valid!');
            return;
        }


        //create sql selector for races
        for (j = 0; j < household_id.length; j++) {
            household_idstring = household_idstring + schtbl + ".household_type_id = " + household_id[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        household_idstring = household_idstring.substring(0, household_idstring.length - 3);



        //put it all together
        sqlstring = basequery + "(" + reg_numstring + ") AND " + "(" + yearstring + ") AND " + "(" + age_group_idstring + ") AND " + "(" + household_idstring + ") " + groupby + ";";

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