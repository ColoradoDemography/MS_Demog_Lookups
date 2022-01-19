// LODES.js calls the census lodes data from SDO postgres tables  A Bickford. January 2022
// LODES Call 
// https://gis.dola.colorado.gov/lookups/lodes?geo=[county,place]&geonum=[fips code]&year=2018,2019&choice=[summary,place]
//The database tables 
//otm_county_summary : County Summary data for the venn diagram
//otm_county_place : County In and out migration for transaction tables
//otm_place_summary : Place Summary data for the venn diagram
//otm_place_place : Place In and out migration for transaction tables

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
              var basequery = 'SELECT * FROM data.otm_county_summary ';
		   }
		   if(req.query.choice == 'place'){
			    var basequery = 'SELECT * FROM data.otm_county_place ';
	   }
	   };
      if(req.query.geo == 'place'){
		   if(req.query.choice == 'summary'){
              var basequery = 'SELECT * FROM data.otm_place_summary ';
		   }
		   if(req.query.choice == 'place'){
			    var basequery = 'SELECT * FROM data.otm_place_place ';
		   }
	   }
// Checking inputs

  if(req.query.geo == 'place'){
		//create array of muni fips codes
        var muni = (req.query.geonum).split(",");
        var munidomain = [“760”, “925”, “1090”, “1530”, “2355”, “3235”, “3455”, “3620”, “3950”, “4000”, “4110”, “4935”,
            “5265”, “6090”, “6255”, “6530”, “7025”, “7190”, “7410”, “7571”, “7795”, “7850”, “8070”, “8345”, “8400”,
            “8675”, “9115”, “9280”, “9555”, “10105”, “10600”, “11260”, “11645”, “11810”, “12045”, “12387”,
            “12415”, “12635”, “12815”, “12855”, “12910”, “13460”, “13845”, “14175”, “14765”, “15330”, “15550”,
            “15605”, “16000”, “16385”, “16495”, “17375”, “17760”, “17925”, “18310”, “18420”, “18530”, “18640”,
            “18750”, “19080”, “19355”, “19630”, “19795”, “19850”, “20000”, “20440”, “20495”, “20770”, “21265”,
            “22035”, “22145”, “22200”, “22860”, “23025”, “23135”, “23740”, “24620”, “24785”, “24950”, “25115”,
            “25280”, “25610”, “26270”, “26600”, “26765”, “26875”, “27040”, “27425”, “27700”, “27810”, “27865”,
            “27975”, “28105”, “28305”, “28360”, “28690”, “28745”, “29185”, “29680”, “29735”, “29955”, “30340”,
            “30780”, “30835”, “31550”, “31605”, “31660”, “31715”, “32155”, “32650”, “33035”, “33310”, “33640”,
            “33695”, “34520”, “34740”, “34960”, “35070”, “36610”, “37215”, “37270”, “37380”, “37545”, “37600”,
            “37820”, “37875”, “38370”, “38535”, “38590”, “39195”, “39855”, “39965”, “40185”, “40515”, “40570”,
            “40790”, “41010”, “41560”, “41835”, “42055”, “42110”, “42330”, “42495”, “43000”, “43110”, “43550”,
            “43605”, “43660”, “44100”, “44320”, “44980”, “45255”, “45530”, “45695”, “45955”, “45970”, “46355”,
            “46465”, “47070”, “48060”, “48115”, “48445”, “48500”, “48555”, “49600”, “49875”, “50040”, “50480”,
            “50920”, “51250”, “51635”, “51690”, “51745”, “51800”, “52075”, “52350”, “52550”, “52570”, “53120”,
            “53175”, “53395”, “54330”, “54880”, “54935”, “55045”, “55155”, “55540”, “55705”, “55870”, “55980”,
            “56145”, “56365”, “56420”, “56475”, “56860”, “56970”, “57025”, “57245”, “57300”, “57400”, “57630”,
            “58235”, “59005”, “59830”, “60160”, “60600”, “61315”, “62000”, “62660”, “62880”, “63045”, “63265”,
            “64090”, “64200”, “64255”, “64970”, “65190”, “65740”, “66895”, “67005”, “67280”, “67830”, “68105”,
            “68655”, “68930”, “69040”, “69150”, “69645”, “69700”, “70195”, “70250”, “70360”, “70525”, “70580”,
            “70635”, “71755”, “72395”, “73330”, “73715”, “73825”, “73935”, “74485”, “74815”, “75640”, “75970”,
            “76795”, “77290”, “77510”, “78610”, “79270”, “80040”, “80865”, “81030”, “81690”, “82130”, “82350”,
            “82460”, “82735”, “83230”, “83450”, “83835”, “84440”, “84770”, “85045”, “85155”, “85485”, “85705”,
            “86090”, “86310”, “86475”, “86750”];

        if (!validate(muni, munidomain)) {
            res.send('one of your geography inputs is not valid!');
            return;
        }
	var geoarr = muni;
  }
  
  if(req.query.geo == 'county'){
        var cty = (req.query.geonum).split(",");	  
	    var ctydomain = [“1”, “3”, “5”, “7”, “9”, “11”, “13”, “14”, “15”, “17”, “19”, “21”, “23”, “25”, “27”, “29”, “31”, “33”, “35”, 
						“37”, “39”, “41”, “43”, “45”, “47”, “49”, “51”, “53”, “55”, “57”, “59”, “61”, “63”, “65”, “67”, “69”, “71”, 
						“73”, “75”, “77”, “79”, “81”, “83”, “85”, “87”, “89”, “91”, “93”, “95”, “97”, “99”, “101”, “103”, “105”, 
						“107”, “109”, “111”, “113”, “115”, “117”, “119”, “121”, “123”, “125”];

	         if (!validate(cty, ctydomain)) {
            res.send('one of your geography inputs is not valid!');
            return;
        }
		var geoarr = cty;
  }
  //create array of geocodes
  var geostring = ' fips = ' + geoarr[0];
        for (j = 1; j < geoarr.length; j++) {
            geostring = geostring + " OR fips = " + geoarr[j];
        }
 

  //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["2018", "2019"];
        if (!validate(year, yeardomain)) {
            res.send('one of your year inputs is not valid!');
            return;
        }
		
        //create sql selector for years
		var yearsting = ' year = ' + year[j];
        for (j = 1; j < year.length; j++) {
            yearstring = yearstring + " OR year = " + year[j];
        }
 
      //Geo and year selection
	  var sqlstring = basequery + ' WHERE ( ' + geostring + ') AND (' + yearstring + ');'

        // send to database 

        sendtodatabase(sqlstring);

}
}
