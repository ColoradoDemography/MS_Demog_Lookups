module.exports = function(app, pg, conString) {

    // respond with "Hello World!" on the homepage
    app.get('/historicalcensus', function(req, res) {


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

        //schema.table combination
        var schtbl = "estimates.historical_census";
        var basequery = "SELECT area_name, area_type, population_year";
        // var statlist = "total_population"; 


        //population_year: 1870:2010 : comma separated
        //compress: explicit yes or no


        var yearstring = "";
        var geostring = "";
        // var typestring = "";
      //  var statstring = "";
        var year;
        var geo;
        // var type;
        //var countyfips;
       // var slist = [];
        var sqlstring;

        var i, j; //iterators

        var yeardomain = [];
        var geodomain = [];
        //  var typedomain = [];



        //exit if no year
        if (!req.query.year) {
            res.send('please specify a year (or comma separated list of years)');
        } else {
            yeardomain = ["1870", "1880", "1890", "1900", "1910", "1920", "1930", "1940", "1950", "1960", "1970", "1980", "1990", "2000", "2010"];
            //create array of years
            year = (req.query.year).split(",");
            //validate year input
            if (!validate(year, yeardomain)) {
                res.send('one of your year inputs is not valid!');
                return;
            }
        }

        //exit if no geo identifier
        if (!req.query.geo) {
            //no countyfips or placefips specified
            res.send('please specify a geography');
        }

        //validate geostring, if entered
        if (req.query.geo) {
        //    geodomain = [ "Adams", "Aguilar", "Akron", "Alamosa", "Alma", "Altman", "Anaconda", "Animas City", "Antonito", "Arapahoe", "Archuleta", "Arriba", "Arrowhead", "Artesia", "Arvada", "Aspen", "Ault/Bergdorf", "Aurora", "Avon", "Baca", "Basalt", "Bayfield", "Belview", "Bennett", "Bent", "Berkely", "Berthoud", "Bethune", "Black Hawk", "Blanca", "Blue River", "Bonanza", "Boone", "Boulder", "Bow Mar", "Branson", "Breckenridge", "Brighton", "Brookside", "Broomfield", "Brush", "Buena Vista", "Burlington", "Calhan", "Cameron", "Campo", "Canon City", "Carbonateville", "Carbondale", "Caribou", "Castle Rock", "Cedaredge", "Centennial", "Center", "Central City", "Central Pueblo", "Chaffee", "Cheraw", "Cherry Hills Village", "Cheyenne", "Cheyenne Wells", "Chihuahua", "Chihuahua ", "Chivington", "City of Castle ", "Clear Creek", "Coal Creek", "Cokedale", "Collbran", "COLORADO", "Colorado City", "Colorado Springs", "Columbine Valley", "Commerce City", "Como", "Como ", "Conejos", "Cortez", "Costilla", "Craig", "Crawford", "Creede", "Crested Butte", "Crestone", "Cripple Creek", "Crook", "Crowley", "Custer", "Dacono", "Dallas", "De Beque", "Deer Trail", "Del Norte", "Delagua", "Delta", "Denver", "Dillon", "Dinosaur", "Dolores", "Douglas", "Dove Creek", "Durango", "Eads", "Eagle", "East Canon", "Eaton", "Eckley", "Edgewater", "El Paso", "Elbert", "Eldora", "Elizabeth", "Elyria", "Empire", "Englewood", "Erie", "Estes Park", "Eureka", "Evans", "Fairplay", "Federal Heights", "Firestone", "Flagler", "Fleming", "Florence", "Florissant", "Fort Collins", "Fort Lupton", "Fort Morgan", "Fountain", "Fowler", "Foxfield", "Fraser", "Frederick", "Fremont", "Freshwater", "Frisco", "Fruita", "Garden City", "Garfield", "Genoa", "Georgetown", "Gilcrest", "Gillett", "Gilpin", "Glendale", "Glenwood Springs", "Globeville", "Golden", "Goldfield", "Granada", "Granby", "Grand", "Grand Junction", "Grand Lake", "Grand Valley", "Gray Creek", "Greeley", "Green Mountain Falls", "Greenwood Village", "Grover", "Guadalupe", "Gunnison", "Gypsum", "Harman", "Hartman", "Haswell", "Haxtun", "Hayden", "Hillrose", "Hinsdale", "Holly", "Holyoke", "Hooper", "Hot Sulphur Springs", "Hotchkiss", "Hudson", "Huerfano", "Hugo", "Idaho Springs", "Ignacio", "Iliff", "Irondale", "Ironton", "Irwin", "Jackson", "Jamestown", "Jefferson", "Johnstown", "Julesburg", "Keenesburg", "Keota", "Kersey", "Kim", "Kiowa", "Kit Carson", "Kokomo", "Kremmling", "La Jara", "La Junta", "La Plata", "La Salle", "La Veta", "Lafayette", "Lake City", "Lake", "Lakeside", "Lakewood", "Lamar", "Lariat", "Larimer", "Larkspur", "Las Animas", "Lawrence", "Leadville", "Limon", "Lincoln", "Littleton", "Lochbuie", "Log Lane Village", "Logan", "Lone Tree", "Longmont", "Louisville", "Loveland", "Lyons", "Malta", "Manassa", "Mancos", "Manitou Springs", "Manzanola", "Marble", "Maysville", "Mead", "Meeker", "Merino", "Mesa", "Milliken", "Mineral", "Minturn", "Moffat", "Montclair vi", "Montclair village", "Monte Vista", "Montezuma", "Montrose", "Monument", "Morgan", "Morrison", "Mount Crested Butte", "Mountain View", "Mountain Village", "Naturita", "Nederland", "Nevadaville", "New Castle", "North Longmont", "Northglenn", "Norwood", "Nucla", "Nunn", "Oak Creek", "Ohio City", "Olathe", "Olney Springs", "Ophir", "Orchard City", "Ordway", "Oro", "Otero", "Otis", "Ouray", "Ovid", "Pagosa Springs", "Palisade", "Palmer Lake", "Paoli", "Paonia", "Parachute", "Park", "Parker", "Peetz", "Phillips", "Pierce", "Pitkin", "Platteville", "Poncha Springs", "Pritchett", "Prospect He", "Prospect Heights", "Prowers", "Pueblo", "Ramah", "Ramona", "Rangely", "Raymer", "Red Cliff", "Red Mountain", "Rico", "Ridgway", "Rifle", "Rio Blanco", "Rio Grande", "Robinson", "Rockvale", "Rocky Ford", "Romeo", "Rosedale", "Rosita", "Routt", "Ruby", "Rye", "Saguache", "Salida", "San Juan", "San Luis", "San Miguel", "San Raphael", "Sanford", "Sawpit", "Sedgwick", "Seibert", "Severance", "Sheridan", "Sheridan Lake", "Silt", "Silver Cliff", "Silver Plume", "Silverthorne", "Silverton", "Simla", "Snowmass Village", "South Canon", "South Denver", "South Fork", "Spencer", "Springfield", "St. Elmo", "Starkville", "Steamboat Springs", "Sterling", "Stratton", "Sugar City", "Summit", "Superior", "Swink", "Teller", "Telluride", "Thornton", "Timnath", "Trinidad", "Two Buttes", "Vail", "Valverde", "Victor", "Vilas", "Virginia City/Tin Cup", "Vona", "Walden", "Walsenburg", "Walsh", "Ward", "Washington", "Weld", "Wellington", "Westcliffe", "Westminster", "Wheat Ridge", "White Pine", "Wiggins", "Wiley", "Williamsburg", "Windsor", "Winter Park", "Woodland Park", "Wray", "Yampa", "Yuma"];
            geo = (req.query.geo).split(",");
        
        //validate place input
        //    if (!validate(geo, geodomain)) {
        //        res.send('one of your geography inputs is not valid!');
        //        return;
        //    }
        }
        
                //validate type, if entered
        // if (req.query.type) {
        //     typedomain = ["M", "C" ];
        //     type = (req.query.type).split(",");
        //     //validate place input
        //     if (!validate(type, typedomain)) {
        //         res.send('one of your type inputs is not valid!');
        //         return;
        //     }
        // }


        //create sql selector for years
        for (j = 0; j < year.length; j++) {
            yearstring = yearstring + schtbl + ".population_year = " + year[j] + " OR ";
        }
        //remove stray OR from end of sql selector
        yearstring = yearstring.substring(0, yearstring.length - 3);
        
        // geography sql selector
        for (i = 0; i < geo.length; i++) {
                geostring = geostring + schtbl + ".name_type = " + "'" + geo[i]+ "'" + " OR ";
            }
            geostring = geostring.substring(0, geostring.length - 3);
            
            // typestring=  typestring + schtbl + ".area_type = " + "'" + type + "'";

        //full sql string selector

            sqlstring = basequery + ', total_population ' + ' FROM ' + schtbl + ' WHERE (' + yearstring + ') AND (' + geostring + ');';
            sendtodatabase(sqlstring);
            
            console.log(sqlstring)

    


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
                    // res.send(JSON.stringify(result.rows));
                res.send(JSON.parse(JSON.stringify(result.rows).replace(/"\s+|\s+"/g,'"')));


                    client.end();

                });
            });
        }

    });



    app.get('/historicalmuni', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select area_name from estimates.historical_census where area_type='M' and population_year=2010  order by area_name asc;", function(err, result) {
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
    });
    
        app.get('/historicalcounty', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select area_name from estimates.historical_census where area_type='C' and population_year=2010 order by area_name asc;", function(err, result) {
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
    });
        app.get('/historicalYRS', function(req, res) {

        var client = new pg.Client(conString);
        client.connect(function(err) {
            if (err) {
                return console.error('could not connect to postgres', err);
            }
            client.query("select population_year from estimates.historical_census where area_name='Adams' order by population_year asc;", function(err, result) {
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
    });


}
