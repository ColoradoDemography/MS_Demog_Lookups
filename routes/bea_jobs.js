var validate = require("../modules/common_functions.js").validate;
var pad = require("../modules/common_functions.js").pad;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;
var construct_delimited_string = require("../modules/common_functions.js").construct_delimited_string;

var request = require('request');


module.exports = function(app, pg, conString) {


    app.get('/bea_jobs', function(req, res) {
        sendtodatabase("select * from estimates.bea_jobs order by fips asc;", pg, conString, res);
    });

    //endpoint to gather valid counties
    app.get('/bea_jobs_county', function(req, res) {
        sendtodatabase("select distinct fips from estimates.bea_jobs order by fips asc;", pg, conString, res);
    });

    //endpoint to gather valid regions
    //app.get('/base-analysis_region', function(req, res) {
    //    sendtodatabase("select distinct reg_num from estimates.base_analysis_region order by reg_num asc;", pg, conString, res);
    //});

}
