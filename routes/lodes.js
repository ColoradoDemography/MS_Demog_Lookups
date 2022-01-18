// LODES.js calls the census lodes data from SDO postgres tables  A Bickford. January 2022
// LODES Call 
// https://gis.dola.colorado.gov/lookups/lodes?geo=[county,place]&geonum=[fips code]&year=2018,2019&choice=[summary,place]
//The database tables 
//otm_county_summary : County Summary data for the venn diagram
//otm_county_place : County In and out migration for transaction tables
//otm_place_summary : Place Summary data for the venn diagram
//otm_place_place : Place In and out migration for transaction tables


module.exports = function(app, pg, conString) {


    app.get('/lodes', function(req, res) {


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



        //gathering inputs
		 var geotype = req.query.geo;
		 var geonum = req.query.geonum;
		 var datayear = req.query.year;
		 var tabchoice = req.query.choice;
		
       //building sql statement
	   //Table selection
	   if(geo == 'county'){
		   if(choice == 'summary'){
              var basequery = 'SELECT fips, place, year, livein_workout, liveout_workin, livein_work_in FROM data.otm_county_summary ';
		   }
		   if(choice == 'place'){
			    var basequery = 'SELECT fips, place, year, type, location, "number", percent FROM data.otm_county_place ';
	   };
      if(geo == 'place'){
		   if(choice == 'summary'){
              var basequery = 'SELECT fips, place, year, livein_workout, liveout_workin, livein_work_in FROM data.otm_place_summary ';
		   }
		   if(choice == 'place'){
			    var basequery = 'SELECT fips, place, year, type, location, "number", percent FROM data.otm_place_place ';
		   }
	   }

      //Geo and year selection
	  var sqlstring = basequery + 'WHERE fips IN (' geonum + ') AND year = ' + datayear;

        // send to database 

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
