var validate = require("../modules/common_functions.js").validate;
var pad = require("../modules/common_functions.js").pad;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;
var construct_delimited_string = require("../modules/common_functions.js").construct_delimited_string;

var request = require('request');


module.exports = function(app, pg, conString) {


    app.get('/base-analysis', function(req, res) {
      
           //short circuit to all
          if(req.query.all === 'yes'){
            sendtodatabase("SELECT * from estimates.base_analysis;", pg, conString, res);
          }else{
       

        //get valid counties
        var p1 = new Promise(function(resolve, reject) {
            request('https://gis.dola.colorado.gov/lookups/base-analysis_county', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var jsonResponse = JSON.parse(body) // Show the HTML for the Google homepage.
                    var cntyArray = jsonResponse.map(function(d) {
                        return d.fips;
                    });
                  
                    resolve(cntyArray);
                }
            });
        });

        //get valid regions
        var p2 = new Promise(function(resolve, reject) {
            request('https://gis.dola.colorado.gov/lookups/base-analysis_region', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var jsonResponse = JSON.parse(body) // Show the HTML for the Google homepage.
                    var rgnArray = jsonResponse.map(function(d) {
                        return 'reg' + d.reg_num;
                    });
                    resolve(rgnArray);
                }
            });
        });

        //once you have gathered all valid counties and regions, combine them into one array (valid_areas)
        Promise.all([p1, p2]).then(function(values) {
            var valid_areas = [].concat.apply([], values);
            //off to the main function, passing along the valid_areas
            main(valid_areas);
        }, function(reason) {
            //failure for whatever reason
            console.log(reason)
        });

        function main(valid_areas) {

            var sqlstring, basequery;
          
            //exit if no county
            if (!req.query.county) {
                res.send('please specify a county');
                return;
            }

            //create array of county fips codes
            var county = (req.query.county).split(",");

            //pad the areas (counties, since region areas are already formatted correctly on input, whereas counties are given as integers in querystring)
            var padcounty = county.map(function(d) {
                return pad(d, 3);
            });

            //compare areas input in the querystring to valid areas gathered from the database query.
            if (!validate(padcounty, valid_areas)) {
                res.send('your county/region input is not valid!');
                return;
            }

            //can either query regions or counties, not both at same time
            //determination to use region lookup or county lookup is determined by first area.
            var regioncheck = (req.query.county.slice(0, 3));
            if (regioncheck === "reg") {
                padcounty.forEach(function(d, i){
                  padcounty[i] = parseInt(d.replace('reg',''));
                });
                basequery = "SELECT * from estimates.base_analysis_region WHERE ";
                var regionstring = construct_delimited_string(padcounty, 'estimates.base_analysis_region', 'reg_num');
                sqlstring = basequery + "(" + regionstring + ");";
            } else {
                basequery = "SELECT * from estimates.base_analysis WHERE ";
                var countystring = construct_delimited_string(padcounty, 'estimates.base_analysis', 'fips');
                sqlstring = basequery + "(" + countystring + ");";
            }

            console.log("QUERY: " + sqlstring);
            sendtodatabase(sqlstring, pg, conString, res);
        }
    }
      
    });

    //endpoint to gather valid counties
    app.get('/base-analysis_county', function(req, res) {
        sendtodatabase("select distinct fips from estimates.base_analysis order by fips asc;", pg, conString, res);
    });

    //endpoint to gather valid regions
    app.get('/base-analysis_region', function(req, res) {
        sendtodatabase("select distinct reg_num from estimates.base_analysis_region order by reg_num asc;", pg, conString, res);
    });

}