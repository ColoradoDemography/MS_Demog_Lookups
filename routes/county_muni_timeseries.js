module.exports = function(app, pg, conString) {

    // respond with "Hello World!" on the homepage
    app.get('/countymuni', function(req, res) {


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
        var schtbl = "estimates.county_muni_timeseries";
        var basequery = "SELECT municipalityname,year,countyfips,placefips,";
        var statlist = "totalpopulation"; //default if no statlist selected

        //countyfips (integer version) : comma separated
        //placefips: (integer version) : comma separated
        //year: 2010,2011,2012,2013,2014,2015 : comma separated
        //compress: explicit yes or no
        //stats: comma separated all or none.  defaults as *.  
        //possible stats are: totalpopulation,householdpopulation,groupquarterspopulation,
        //totalhousingunits,occupiedhousingunits,vacanthousingunits

        var yearstring = "";
        var countystring = "";
        var placestring = "";
        var statstring = "";
        var year;
        var placefips;
        var countyfips;
        var slist = [];
        var sqlstring;

        var i, j; //iterators

        var yeardomain = [];
        var placedomain = [];
        var countydomain = [];

        var statdomain = [];


        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        } else {
            yeardomain = ["1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
            //create array of years
            year = (req.query.year).split(",");
            //validate year input
            if (!validate(year, yeardomain)) {
                res.send('one of your year inputs is not valid!');
                return;
            }
        }

        //exit if no geo identifier
        if (!req.query.placefips && !req.query.countyfips) {
            //no countyfips or placefips specified
            res.send('please specify a place fips or county fips');
        }

        //validate placefips, if entered
        if (req.query.placefips) {
            placedomain = ["760", "925", "1090", "1530", "2355", "3235", "3455", "3620", "3950", "4000", "4110", "4935", "5265", "6090", "6255", "6530", "7025", "7190", "7410", "7571", "7795", "7850", "8070", "8345", "8400", "8675", "9115", "9280", "9555", "10105", "10600", "11260", "11645", "11810", "12045", "12387", "12390", "12415", "12635", "12815", "12855", "12910", "13460", "13845", "14175", "14765", "15330", "15550", "15605", "16000", "16385", "16495", "17375", "17760", "17925", "18310", "18420", "18530", "18640", "18750", "19080", "19355", "19630", "19795", "19850", "20000", "20440", "20495", "20770", "21265", "22035", "22145", "22200", "22860", "23025", "23135", "23740", "24620", "24785", "24950", "25115", "25280", "25610", "26270", "26600", "26765", "26875", "27040", "27425", "27700", "27810", "27865", "27975", "28105", "28305", "28360", "28690", "28745", "29185", "29680", "29735", "29955", "30340", "30780", "30835", "31550", "31605", "31660", "31715", "32155", "32650", "33035", "33310", "33640", "33695", "34520", "34740", "34960", "35070", "36610", "37215", "37270", "37380", "37545", "37600", "37820", "37875", "38370", "38535", "38590", "39195", "39855", "39965", "40185", "40515", "40570", "40790", "41010", "41560", "41835", "42055", "42110", "42330", "42495", "43000", "43110", "43550", "43605", "43660", "44100", "44320", "44980", "45255", "45530", "45695", "45955", "45970", "46355", "46465", "47070", "48060", "48115", "48445", "48500", "48555", "49600", "49875", "50040", "50480", "50920", "51250", "51635", "51690", "51745", "51800", "52075", "52350", "52550", "52570", "53120", "53175", "53395", "54330", "54880", "54935", "55045", "55155", "55540", "55705", "55870", "55980", "56145", "56365", "56420", "56475", "56860", "56970", "57025", "57245", "57300", "57400", "57630", "58235", "59005", "59830", "60160", "60600", "61315", "62000", "62660", "62880", "63045", "63265", "64090", "64200", "64255", "64970", "65190", "65740", "66895", "67005", "67280", "67830", "68105", "68655", "68930", "69040", "69150", "69645", "69700", "70195", "70250", "70360", "70525", "70580", "70635", "71755", "72395", "73330", "73715", "73825", "73935", "74485", "74815", "75640", "75970", "76795", "77290", "77510", "78610", "79270", "80040", "80865", "81030", "81690", "82130", "82350", "82460", "82735", "83230", "83450", "83835", "84440", "84770", "85045", "85155", "85485", "85705", "86090", "86310", "86475", "86750", "99990"];
            placefips = (req.query.placefips).split(",");
            //validate place input
            if (!validate(placefips, placedomain)) {
                res.send('one of your place inputs is not valid!');
                return;
            }
        }

        //validate countyfips, if entered
        if (req.query.countyfips) {
            countydomain = ["1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
            countyfips = (req.query.countyfips).split(",");
            //validate place input
            if (!validate(countyfips, countydomain)) {
                res.send('one of your county inputs is not valid!');
                return;
            }
        }


        //create sql selector for years
        for (j = 0; j < year.length; j++) {
            yearstring = yearstring + schtbl + ".year = " + year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        yearstring = yearstring.substring(0, yearstring.length - 3);


        if (req.query.stats) {
            statdomain = ["totalpopulation"];
            slist = (req.query.stats).split(",");
            //validate place input
            if (!validate(slist, statdomain)) {
                res.send('one of your stats inputs is not valid!');
                return;
            }
            statlist = req.query.stats;
        }
        //reset slist to be based off of statlist, just in case default - totalpopulation is used rather than req.query.stats
        slist = (statlist).split(",");


        if (!req.query.placefips && req.query.countyfips) {

            //countyfipsonly = want all pieces in county = default.  or 'compressed' to sum all up to county number
            for (i = 0; i < countyfips.length; i++) {
                countystring = countystring + schtbl + ".countyfips = " + countyfips[i] + " OR ";
            }
            countystring = countystring.substring(0, countystring.length - 3);

            if (req.query.compressed === "no") {
                sqlstring = basequery + statlist + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + countystring + ');';
                console.log(sqlstring);
                sendtodatabase(sqlstring);
            } else if (req.query.compressed === "yes") {
                basequery = "SELECT year,countyfips,";
                for (j = 0; j < slist.length; j++) {
                    statstring = statstring + "SUM(" + slist[j] + ") as " + slist[j] + ",";
                }
                statstring = statstring.substring(0, statstring.length - 1);
                sqlstring = basequery + statstring + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + countystring + ') AND (estimates.county_muni_timeseries.placefips = 0) group by year,countyfips order by countyfips,year;';
                console.log(sqlstring);
                sendtodatabase(sqlstring);
            } else {
                res.send('please explicity set compressed to yes or no');
            }
        }


        if (req.query.placefips && !req.query.countyfips) {
            //placefipsonly = want all place pieces.  or 'compressed' to sum up all place pieces
            for (j = 0; j < placefips.length; j++) {
                placestring = placestring + schtbl + ".placefips = " + placefips[j] + " OR ";
            }
            placestring = placestring.substring(0, placestring.length - 3);

            if (req.query.compressed === "no") {
                sqlstring = basequery + statlist + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + placestring + ');';
                console.log(sqlstring);
                sendtodatabase(sqlstring);
            } else if (req.query.compressed === "yes") {
                basequery = "SELECT replace(municipalityname, ' (Part)', '') as municipalityname,year,placefips,";
                for (j = 0; j < slist.length; j++) {
                    statstring = statstring + "SUM(" + slist[j] + ") as " + slist[j] + ",";
                }
                statstring = statstring.substring(0, statstring.length - 1);
                sqlstring = basequery + statstring + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + placestring + ') group by year,placefips,municipalityname order by placefips,municipalityname,year;';
                console.log(sqlstring);
                sendtodatabase(sqlstring);
            } else {
                res.send('please explicity set compressed to yes or no');
            }
        }


        if (req.query.placefips && req.query.countyfips) {

            for (var i = 0; i < countyfips.length; i++) {
                countystring = countystring + schtbl + ".countyfips = " + countyfips[i] + " OR ";
            }
            countystring = countystring.substring(0, countystring.length - 3);

            for (var j = 0; j < placefips.length; j++) {
                placestring = placestring + schtbl + ".placefips = " + placefips[j] + " OR ";
            }
            placestring = placestring.substring(0, placestring.length - 3);

            //placefips and countyfips = looking for particular piece in particular county.  very specific.  compressed doesnt matter
            sqlstring = basequery + statlist + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + countystring + ') AND (' + placestring + ');';
            console.log(sqlstring);
            sendtodatabase(sqlstring);
        }


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



    app.get('/countymuniYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select year from estimates.county_muni_timeseries where countyfips=3 and placefips=1090 order by year asc;", function(err, result) {
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


}
