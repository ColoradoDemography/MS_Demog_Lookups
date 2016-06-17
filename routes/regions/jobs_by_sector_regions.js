
module.exports = function(app, pg, conString){

// respond with "Hello World!" on the homepage
app.get('/jobs_region', function(req, res) {

    //table name
    var schtbl = "estimates.jobs_by_sector_reg";
  
    //schema.table combination
    var basequery = "SELECT area_code,sector_id,sector_name,population_year,total_jobs from " + schtbl + " where ";
  
    //reg_num: (integers) : region numbers, comma separated
    //year: (integers) : comma separated

    var yearstring = "";
    var reg_numstring = "";
    var sectorstring = "";
  
    var sqlstring;

    var i, j, k; //iterators

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
  
  
    //exit if no region number
    if (!req.query.reg_num) {
        res.send('please specify a region number (or comma separated list of region numbers)');
    }
  
    //exit if no year
    if (!req.query.year) {
        res.send('please specify a year (or comma separated list of years)');
    }


    //create array of region numbers
    var reg_num = (req.query.reg_num).split(",");
    var reg_numdomain = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    if (!validate(reg_num, reg_numdomain)) {
        res.send('one of your reg_num inputs is not valid!');
        return;
    }
  
    //create sql selector for years
    for (j = 0; j < reg_num.length; j++) {
        reg_numstring = reg_numstring + schtbl + ".area_code = " + reg_num[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    reg_numstring = reg_numstring.substring(0, reg_numstring.length - 3);


    //create array of years
    var year = (req.query.year).split(",");
    var yeardomain = ["2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014"];
    if (!validate(year, yeardomain)) {
        res.send('one of your year inputs is not valid!');
        return;
    }
    //create sql selector for years
    for (j = 0; j < year.length; j++) {
        yearstring = yearstring + schtbl + ".population_year = " + year[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    yearstring = yearstring.substring(0, yearstring.length - 3);



    //create array of years
  
    if(!req.query.sector){
      sectorstring = "5=5"; //rather than explicitly list every sector
    }else{
      var sector = (req.query.sector).split(",");
      var sectordomain = ["00000","01000","01010","01020","02000","02010","02020","02030","03000","03030","04000","04010","04020","04030","05000","05010","05020","05030","05040","05050","05060","05070","05080","05090","05100","05110","05120","06000","06010","07000","07010","07020","07030","07040","07050","07060","07070","07080","07090","07100","08000","08010","08020","08030","08040","08050","08060","08070","08080","08090","09000","09010","09030","09050","10000","10010","10020","10100","10150","10200","11000","11020","11025","11030","11050","11090","11100","12000","12010","12015","12020","12030","12040","12050","13000","13010","13015","13020","13030","14000","14010","14020","14030","14040","15000","15010","15014","15020","15030"];
      if (!validate(sector, sectordomain)) {
        res.send('one of your sector inputs is not valid!');
        return;
      }

      //create sql selector for years
      for (k = 0; k < sector.length; k++) {
          sectorstring = sectorstring + schtbl + ".sector_id = '" + sector[k] + "' OR ";
      }
      //remove stray OR from end of sql selector
      sectorstring = sectorstring.substring(0, sectorstring.length - 3);
    }

  
  
    //put it all together
    sqlstring = basequery + "(" + reg_numstring + ") AND " + "(" + yearstring + ") AND (" + sectorstring + ") ORDER BY area_code, population_year, sector_id;";
  
    console.log(sqlstring);
  
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