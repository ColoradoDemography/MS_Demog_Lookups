var pg = require('pg');


var appRouter = function(app) {

    app.get("/districts", function(req, res) {
      
        
        var db = 'dola';
        var schema = 'bounds';
        var tname = 'county_bounds';

        //var limit = req.query.limit || 5000; //by default limits to 1000 search results.  override by setting limit= in GET string
        var active = req.query.active || '0'; //comma delimited list of lgstatusid's, if '0' then all

        var activearray = [];
        var filterarray = [];


        if (active !== '0') {
            activearray = active.split(",");
            var activestr = "";

            activearray.forEach(function(a) {
                activestr = activestr + " lgstatusid='" + a + "' or";
            });

            activestr = activestr.slice(0, -2);
            activestr = " and (" + activestr + ")";

        } else {
            activestr = '';
        }


        var filter = req.query.filter || '0'; //comma delimited list of lgtypeid's, if '0' then all

        if (filter !== '0') {
            filterarray = filter.split(",");
            var filterstr = "";

            filterarray.forEach(function(b) {
                filterstr = filterstr + " lgtypeid='" + b + "' or";
            });

            //trim last trailing 'or'
            filterstr = filterstr.slice(0, -2);
            filterstr = " and (" + filterstr + ")";

        } else {
            filterstr = '';
        }

        var tolerance = 0;

        //get simplify factor
        var zoom = req.query.zoom || 17;

        //type coercion okay here
        if (zoom == 2) {
            tolerance = 0.2;
        } //past minZoom
        if (zoom == 3) {
            tolerance = 0.1;
        } //past minZoom
        if (zoom == 4) {
            tolerance = 0.07;
        } //past minZoom
        if (zoom == 5) {
            tolerance = 0.04;
        } //past minZoom
        if (zoom == 6) {
            tolerance = 0.018;
        }
        if (zoom == 7) {
            tolerance = 0.01;
        }
        if (zoom == 8) {
            tolerance = 0.005;
        }
        if (zoom == 9) {
            tolerance = 0.003;
        }
        if (zoom == 10) {
            tolerance = 0.0015;
        }
        if (zoom == 11) {
            tolerance = 0.001;
        }
        if (zoom == 12) {
            tolerance = 0.0005;
        }
        if (zoom == 13) {
            tolerance = 0.00025;
        }
        if (zoom == 14) {
            tolerance = 0.0001;
        }
        if (zoom == 15) {
            tolerance = 0.0001;
        }
        if (zoom == 16) {
            tolerance = 0.0001;
        }
        if (zoom == 17) {
            tolerance = 0;
        }


        var bbstr = ""; //bounding box string

        if (req.query.bb) {
            var bb = req.query.bb;
            bbstr = schema + "." + tname + ".geom && ST_MakeEnvelope(" + bb + ", 4326) ";
        } else {
            bbstr = " 1=1 ";
        } //bounding box example: "-105,40,-104,39" no spaces no quotes


        var lgid = req.query.lgid || ''; //comma delimited list of lgid's

        if (lgid !== '') {
            var lgidarray = lgid.split(",");
            var lgidstr = "";

            lgidarray.forEach(function(c) {
                lgidstr = lgidstr + " lgid='" + c + "' or";
            });

            lgidstr = lgidstr.slice(0, -2);
            lgidstr = "where (" + lgidstr + ")";

        } else {
            lgidstr = '';
        }


        var sql = "";

        if (req.query.lgid) {
            sql = "SELECT lgid, lastupdate, lgname, lgtypeid, lgstatusid, source, mail_address, alt_address, mail_city, mail_state, mail_zip, url, prev_name, abbrev_name, st_asgeojson(st_transform(ST_Simplify(geom," + tolerance + "),4326)) AS geojson from " + schema + "." + tname + " natural join " + schema + ".lgbasic " + lgidstr + ";";
        } else {
            sql = "SELECT lgid, lastupdate, lgname, lgtypeid, lgstatusid, source, mail_address, alt_address, mail_city, mail_state, mail_zip, url, prev_name, abbrev_name, st_asgeojson(st_transform(ST_Simplify(geom," + tolerance + "),4326)) AS geojson from " + schema + "." + tname + " natural join " + schema + ".lgbasic where " + bbstr + activestr + filterstr + " limit " + limit + ";";
        }

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
        var schtbl = "estimates.county_grants";
        
        //choice variable
        var categoryChoice = req.query.choice;
        

        //model query
        //SELECT countyfips, county,SUM(malepopulation) as malepopulation,SUM(femalepopulation) as femalepopulation,SUM(totalpopulation) as totalpopulation 
        //from estimates.county_sya WHERE year = 1991 or year = 1992 GROUP BY countyfips, county ORDER BY countyfips;
      
        //schema.table combination
        var basequery = "SELECT * from estimates.county_grants where " //+ yearstring + "and" + programstring " GROUP By countyfips, county, ORDER BY countyfips";
        var groupby = "GROUP By countyfips, county, ORDER BY countyfips";
       


        //county: (integers) : fips codes, comma separated
        //year: (integers) : comma separated
        

        var yearstring = "";
        var programstring = "";
        

        var sqlstring;

        var i, j; //iterators


        //exit if no county
        //if (!req.query.county) {
            //res.send('please specify a county (or comma separated list of counties)');
        //}

        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        }

        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
        //if (!validate(county, countydomain)) {
        //    res.send('one of your county inputs is not valid!');
        //    return;
        //}

        //create sql selector for years
        //for (j = 0; j < county.length; j++) {
        //    countystring = countystring + schtbl + ".countyfips = " + county[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        //countystring = countystring.substring(0, countystring.length - 3);


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

        //put it all together
        

            sqlstring = basequery + "(" + programstring + ") AND " + "(" + yearstring + ") AND " + groupby + ";";
            break;

            
            

console.log(sqlstring)

            break;
}



         
        // console.log(sqlstring);

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


    app.get('/grantYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select year, datatype from estimates.county_grants where countyfips=1  order by year asc;", function(err, result) {
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


    


    
