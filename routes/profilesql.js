module.exports = function(app, pg, conString) {
//profilesql reads a url with a table specification, a geography specification (county or place fips code), and a year specification

    app.get('/profilesql', function(req, res) {


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
//This is the main program
        //schema.table combination
        var tablestr = req.query.table;
        var basequery = "SELECT * ";
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
            yeardomain = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"];
            //create array of years
            year = (req.query.year).split(",");
            //validate year input
            if (!validate(year, yeardomain)) {
                res.send('one of your year inputs is not valid!');
                return;
            }
        }

      //exit if no geo identifier
        if (!req.query.geo) {
             //no countyfips or placefips specified
             res.send('please specify a geography');
         }

        //validate geostring, if entered
//        if (req.query.county) {
//            countydomain = ["000", "001", "003", "005", "007", "009", "011", "013", "014", "015", "017", "019", "021", "023", "025", "027", "029", "031", "033", "035", "037", "039", "041", "043", "045", "047", "049", "051", "053", "055", "057", "059", "061", "063", "065", "067", "069", "071", "073", "075", "077", "079", "081", "083", "085", "087", "089", "091", "093", "095", "097", "099", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
//           county = (req.query.county).split(",");
            //validate place input
//            if (!validate(county, countydomain)) {
//                res.send('one of your county inputs is not valid!');.
//                return;
//            }
//        }
        
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


                
        // geography and year sql selector
		var geostr = req.query.geo;
		var yearstring = "year IN ("+ req.query.year +")";
        //full sql string selector
		
		//building the geo selection component
		const areacodelist = ["estimates.bea_jobs", "estimates.household_projections", "estimates.labor_force_participation"];
		const ctyfipslist = ["estimates.county_muni_timeseries","estimates.county_profiles","estimates.jobs_by_sector", "estimates.jobs_forecast"]
		const fipslist = ["data.netmigrbyage", "data.otm_county_place_sector", "data.otm_county_summary_sector", 
						"data.otm_place_place_sector", "data.otm_place_summary_sector", 
						"estimates.base_analysis",  "estimates.bls_unemployment", "estimates.firm_count", "estimates.weekly_wages"]; 
		const placefipslist = ["estimates.muni_pop_housing", "estimates.county_muni_timeseries", "estimates.muni_jobs_long"]; 


        if(areacodelist.includes(tablestr)){
			var geoselstr = "area_code IN (" + geostr + ")";
		}
		if(ctyfipslist.includes(tablestr)){
			var geoselstr = "countyfips IN (" + geostr + ")";
		}
		if(fipslist.includes(tablestr)){
			var geoselstr = "fips IN (" + geostr + ")";
		}
		if(placefipslist.includes(tablestr)){
			var geoselstr = "placefips IN (" + geostr + ")";
		}
            sqlstring = basequery + ' FROM ' + tablestr + ' WHERE (' + yearstring + ') AND (' + geoselstr + ');';
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
        }  //sendtodatabase

    });

}

