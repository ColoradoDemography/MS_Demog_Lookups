module.exports = function(app, pg, conString){
  
// respond with "Hello World!" on the homepage
app.get('/profile', function(req, res) {

    //table name
    var schtbl = "estimates.county_profiles";

  //list of demographic variables
  var stats = req.query.vars;
  var statarray=[];
  
  if(!req.query.vars){
    stats="births,censusbuildingpermits,deaths,groupquarterspopulation,householdpopulation,households,householdsize,naturalincrease,netmigration,totalhousingunits,vacancyrate,vacanthousingunits";
    statarray=["births","censusbuildingpermits","deaths","groupquarterspopulation","householdpopulation","households","householdsize","naturalincrease","netmigration","totalhousingunits","vacancyrate","vacanthousingunits"];
  }else{
    var statarray=(req.query.vars).split(",");
    var statdomain = ["births", "censusbuildingpermits", "deaths", "groupquarterspopulation", "householdpopulation", "households", "householdsize", "naturalincrease", "netmigration", "totalhousingunits", "vacancyrate", "vacanthousingunits"];
    if (!validate(statarray, statdomain)) {
        res.send('one of your statistic inputs is not valid!');
        return;
    }
  }
  
  
    //schema.table combination
    var basequery = "SELECT countyfips,year," + stats + " from " + schtbl + " WHERE ";
    var groupby = "";


    //GROUP BY
    //opt0: = none or all = base query
    //opt1: year
    //opt2: county_fips


    if (req.query.group) {
      
      //break down statarray into sumlist
      var statstring="";
      var statlist="";
      
      for(var k=0;k<statarray.length;k++){
        statstring=statstring+"SUM("+statarray[k]+") as "+statarray[k]+", ";  
        statlist=statlist+statarray[k]+", ";  
      }
      statstring = statstring.slice(0, -2);
      statlist = statlist.slice(0, -2);      

      
        //opt1: year
        if (req.query.group === "opt1") {
            basequery = "SELECT year, " + statstring + " from " + schtbl + " WHERE ";
            //"SELECT county,county_fips,year,age,race,count from " + schtbl + " WHERE ";
            groupby = " GROUP BY year ORDER BY year, " + statlist;
        }
        //opt2: county_fips
        if (req.query.group === "opt2") {
            basequery = "SELECT countyfips, " + statstring + " from " + schtbl + " WHERE ";
            //"SELECT county,county_fips,year,age,race,count from " + schtbl + " WHERE ";
            groupby = " GROUP BY countyfips ORDER BY countyfips, " + statlist;
        }
 
    }

    var yearstring = "";
    var countystring = "";

  
    var sqlstring;

    var i, j; //iterators


    //exit if no county
    if (!req.query.county) {
        res.send('please specify a county (or comma separated list of counties)');
        return;
    }

    //exit if no year
    if (!req.query.year) {
        res.send('please specify a year (or comma separated list of years)');
        return;
    }


  
    //VALIDATE ALL INPUT ONCE IN ARRAYS
    //county: (integers) : fips codes, comma separated
    //year: (integers) : comma separated (valid range: 1985-2014)


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

    //create array of county fips codes
    var county = (req.query.county).split(",");
    var countydomain = ["1", "3", "5", "7", "9", "11", "13", "14", "15", "17", "19", "21", "23", "25", "27", "29", "31", "33", "35", "37", "39", "41", "43", "45", "47", "49", "51", "53", "55", "57", "59", "61", "63", "65", "67", "69", "71", "73", "75", "77", "79", "81", "83", "85", "87", "89", "91", "93", "95", "97", "99", "101", "103", "105", "107", "109", "111", "113", "115", "117", "119", "121", "123", "125"];
    if (!validate(county, countydomain)) {
        res.send('one of your county inputs is not valid!');
        return;
    }

    //create sql selector for years
    for (j = 0; j < county.length; j++) {
        countystring = countystring + schtbl + ".countyfips = " + county[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    countystring = countystring.substring(0, countystring.length - 3);


    //create array of years
    var year = (req.query.year).split(",");
    var yeardomain = ["1985","1986","1987","1988","1989","1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011", "2012", "2013", "2014"];
    if (!validate(year, yeardomain)) {
        res.send('one of your year inputs is not valid!');
        return;
    }

    //create sql selector for years
    for (j = 0; j < year.length; j++) {
        yearstring = yearstring + schtbl + ".year = " + year[j] + " OR ";
    }
    //remove stray OR from end of sql selector
    yearstring = yearstring.substring(0, yearstring.length - 3);



    //put it all together
    sqlstring = basequery + "(" + countystring + ") AND " + "(" + yearstring + ") " + groupby + ";";

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
