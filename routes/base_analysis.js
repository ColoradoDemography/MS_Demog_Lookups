
var validate = require("../modules/common_functions.js").validate;
var pad = require("../modules/common_functions.js").pad;
var sendtodatabase = require("../modules/common_functions.js").sendtodatabase;


module.exports = function(app, pg, conString) {


    app.get('/base-analysis', function(req, res) {

        var sqlstring;

        //table name
        var schtbl = "estimates.base_analysis";

        //schema.table combination
        var basequery = "SELECT * from " + schtbl + " WHERE ";

        //exit if no county
        if (!req.query.county) {
            res.send('please specify a county');
            return;
        }


        //create array of county fips codes
        var county = (req.query.county).split(",");
        var countydomain = ["0", "1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125", "500", "reg1", "reg2", "reg4", "reg5", "reg6", "reg7", "reg8", "reg9", "reg10", "reg11", "reg12", "reg13", "reg14", "reg15", "reg16", "reg18", "reg19"];
        if (!validate(county, countydomain)) {
            res.send('your county input is not valid!');
            return;
        }

        var regioncheck = (req.query.county.slice(0, 3));
        if (regioncheck === "reg") {
            //new querystring formation based upon region view
            sqlstring = "SELECT * from estimates.base_analysis_region WHERE (estimates.base_analysis_region.reg_num = '" + req.query.county.slice(3) + "' );";

        } else {

            var countystring = "";

            //create sql selector for years
            for (j = 0; j < county.length; j++) {
                countystring = countystring + schtbl + ".fips = '" + pad(county[j], 3) + "' OR ";
            }
            //remove stray OR from end of sql selector
            countystring = countystring.substring(0, countystring.length - 3);

            //put it all together
            sqlstring = basequery + "(" + countystring + ");";

        }

        console.log(sqlstring);
        sendtodatabase(sqlstring, pg, conString, res);



    });


}