var validate = require("../modules/common_functions.js").validate;
var pad = require("../modules/common_functions.js").pad;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;
var construct_delimited_string = require("../modules/common_functions.js").construct_delimited_string;

var request = require('request');


module.exports = function(app, pg, conString) {
   
    app.get('/munijobs', function(req, res) {
        
        //table name
        var schtbl = "estimates.muni_jobs_long";


        //schema.table combination
        var basequery = "SELECT * from " + schtbl + " WHERE ";
        
        var munistring = "";

        var sqlstring;

        var j; //iterators
        
        //exit if no muni
        if (!req.query.fips) {
            res.send('please specify a municipality (or comma separated list of munipalities)');
            return;
        }
        
		//exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        }
        //create array of muni fips codes
        var muni = (req.query.fips).split(",");
       var munidomain = ["760", "925", "1090", "1530", "2355", "3235", "3455", "3620", "3950", "4000", "4110", "4935", "5265", 
						"6090", "6255", "6530", "7025", "7190", "7410", "7571", "7795", "7850", "8070", "8345", "8400", 
						"8675", "9115", "9280", "9555", "10105", "10600", "11260", "11645", "11810", "12045", "12387", 
						"12415", "12635", "12815", "12855", "12910", "13460", "13845", "14175", "14765", "15330", "15550", 
						"15605", "16000", "16385", "16495", "17375", "17760", "17925", "18310", "18420", "18530", "18640", 
						"18750", "19080", "19355", "19630", "19795", "19850", "20000", "20440", "20495", "20770", "21265", 
						"22035", "22145", "22200", "22860", "23025", "23135", "23740", "24620", "24785", "24950", "25115", 
						"25280", "25610", "26270", "26600", "26765", "26875", "27040", "27425", "27700", "27810", "27865", 
						"27975", "28105", "28305", "28360", "28690", "28745", "29185", "29680", "29735", "29955", "30340", 
						"30780", "30835", "31550", "31605", "31660", "31715", "32155", "32650", "33035", "33310", "33640", 
						"33695", "34520", "34740", "34960", "35070", "36610", "37215", "37270", "37380", "37545", "37600", 
						"37820", "37875", "38370", "38535", "38590", "39195", "39855", "39965", "40185", "40515", "40570", 
						"40790", "41010", "41560", "41835", "42055", "42110", "42330", "42495", "43000", "43110", "43550", 
						"43605", "43660", "44100", "44320", "44980", "45255", "45530", "45695", "45955", "45970", "46355", 
						"46465", "47070", "48060", "48115", "48445", "48500", "48555", "49600", "49875", "50040", "50480", 
						"50920", "51250", "51635", "51690", "51745", "51800", "52075", "52350", "52550", "52570", "53120", 
						"53175", "53395", "54330", "54880", "54935", "55045", "55155", "55540", "55705", "55870", "55980", 
						"56145", "56365", "56420", "56475", "56860", "56970", "57025", "57245", "57300", "57400", "57630", 
						"58235", "59005", "59830", "60160", "60600", "61315", "62000", "62660", "62880", "63045", "63265", 
						"64090", "64200", "64255", "64970", "65190", "65740", "66895", "67005", "67280", "67830", "68105", 
						"68655", "68930", "69040", "69150", "69645", "69700", "70195", "70250", "70360", "70525", "70580", 
						"70635", "71755", "72395", "73330", "73715", "73825", "73935", "74485", "74815", "75640", "75970", 
						"76795", "77290", "77510", "78610", "79270", "80040", "80865", "81030", "81690", "82130", "82350", 
						"82460", "82735", "83230", "83450", "83835", "84440", "84770", "85045", "85155", "85485", "85705", 
						"86090", "86310", "86475", "86750"];

        if (!validate(muni, munidomain)) {
            res.send('one of your municipality inputs is not valid!');
            return;
        }
  //Create Muni String
    var munistring = ' fips = ' + muni[0];
	for (j = 1; j < muni.length; j++) {
		munistring = munistring + " OR fips = " + muni[j];
	}

 //create array of years
        var year = (req.query.year).split(",");
        var yeardomain = ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
        if (!validate(year, yeardomain)) {
            res.send('one of your year inputs is not valid!');
            return;
        }
        //create sql selector for years
        for (j = 0; j < year.length; j++) {
            yearstring = yearstring + schtbl + " year = " + year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        yearstring = yearstring.substring(0, yearstring.length - 3);


        //create sql selector for years
		var yearsting = ' year = ' + year[j];
        for (j = 1; j < year.length; j++) {
            yearstring = yearstring + " OR year = " + year[j];
        }

                //put it all together
        var sqlstring = basequery + ' WHERE ( ' + munistring + ') AND (' + yearstring + ');'
       
        sendtodatabase(sqlstring, pg, conString, res);
    });

}
