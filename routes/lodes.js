// LODES.js calls the OTM lodes data from SDO postgres tables  A Bickford. March 2024
// LODES Call 
// https://gis.dola.colorado.gov/lookups/lodes?geo=[county,place]&geonum=[fips code]&year=2021&choice=[summary,place]
//The database tables 
//otm_county_summary_sector : County Summary data for the venn diagram
//otm_county_place_sector : County In and out migration for transaction tables
//otm_place_summary_sector : Place Summary data for the venn diagram
//otm_place_place_sector : Place In and out migration for transaction tables

var validate = require("../modules/common_functions.js").validate;
var pad = require("../modules/common_functions.js").pad;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;
var construct_delimited_string = require("../modules/common_functions.js").construct_delimited_string;

var request = require('request');

module.exports = function(app, pg, conString) {

    app.get('/lodes', function(req, res) {
		
       //building sql statement
	   //Table selection
	   if(req.query.geo == 'county'){
		   if(req.query.choice == 'summary'){
              var basequery = 'SELECT * FROM data.otm_county_summary_sector ';
		   }
		   if(req.query.choice == 'place'){
			    var basequery = 'SELECT * FROM data.otm_county_place_sector ';
	   }
	   };
      if(req.query.geo == 'place'){
		   if(req.query.choice == 'summary'){
              var basequery = 'SELECT * FROM data.otm_place_summary_sector ';
		   }
		   if(req.query.choice == 'place'){
			    var basequery = 'SELECT * FROM data.otm_place_place_sector ';
		   }
	   }

  //create array of geocodes
  
  var geoarr = req.query.geonum
   //Table selection
	   if(req.query.geo == 'county'){
		   if(req.query.choice == 'summary'){
              var geostring = 'fips = ' + geoarr;
		   }
		   if(req.query.choice == 'place'){
			    var geostring = 'work_cty = ' + geoarr + ' OR home_cty = ' + geoarr;
	   }
	   };
      if(req.query.geo == 'place'){
		   if(req.query.choice == 'summary'){
              var geostring = 'fips = ' + geoarr;
		   }
		   if(req.query.choice == 'place'){
			    var geostring = 'work_place = ' + geoarr + ' OR home_place = ' + geoarr;
		   }
	   }
 
        //create sql selector for years AFTER 2021
		//var yearsting = ' year = 2021'

 
      //Geo and year selection
	  //Only 2021
	  var sqlstring = basequery + ' WHERE ( ' + geostring + ');'
     //After 2021, when more data is in files
	 // var sqlstring = basequery + ' WHERE ( ' + geostring + ') AND (' + yearstring + ');'
        // send to database 

        sendtodatabase(sqlstring);

}
}