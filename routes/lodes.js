// LODES.js calls the OTM lodes data from SDO postgres tables  A Bickford. March 2024
// LODES Call 
// https://gis.dola.colorado.gov/lookups/lodes?geo=[county,place]&geonum=[fips code]&year=2021&choice=[summary,place]
//The database tables 
//otm_county_summary_sector : County Summary data for the venn diagram
//otm_county_place_sector : County In and out migration for transaction tables
//otm_place_summary_sector : Place Summary data for the venn diagram
//otm_place_place_sector : Place In and out migration for transaction tables

module.exports = function(app, pg, conString) {

    app.get('/lodes', function(req, res) {
		var geoarr = req.query.geonum;
		  
       //building sql statement
	   //Table selection
	   if(req.query.geo == 'county'){
		   if(req.query.choice == 'summary'){
              var basequery = 'SELECT * FROM data.otm_county_summary_sector ';
			  var geostring = "fips = '" + geoarr + "'";
		   }
		if(req.query.choice == 'place'){
			  var basequery = 'SELECT * FROM data.otm_county_place_sector ';
			  var geostring = "work_cty = '" + geoarr + "' OR home_cty = '" + geoarr + "'";
	      }
	   };
      if(req.query.geo == 'place'){
		   if(req.query.choice == 'summary'){
              var basequery = 'SELECT * FROM data.otm_place_summary_sector ';
			  var geostring = "fips = '" + geoarr + "'";
		   }
		   if(req.query.choice == 'place'){
			    var basequery = 'SELECT * FROM data.otm_place_place_sector ';
			    var geostring = "work_place = '" + geoarr + "' OR home_place = '" + geoarr + "'";
		   }
	   }

       //Geo and year selection
	  //Only 2021
	  var sqlstring = basequery + ' WHERE ( ' + geostring + ');'
     //After 2021, when more data is in files
	 // var sqlstring = basequery + ' WHERE ( ' + geostring + ') AND (' + yearstring + ');'
     // send to database 
     console.log(sqlstring)
     sendtodatabase(sqlstring,conString);
	 
	         function sendtodatabase(sqlstring, conString) {

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


})
}