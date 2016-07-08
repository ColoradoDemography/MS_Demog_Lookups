//node modules
var express = require('express');
var app = express();
var pg = require('pg');
var conString = "postgres://codemog:demography@gis.dola.colorado.gov:5433/dola";

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');

    next();
}

app.use(allowCrossDomain);

require('./routes/base_analysis.js')(app, pg, conString);
require('./routes/components_change.js')(app, pg, conString);
require('./routes/county_profiles.js')(app, pg, conString);
require('./routes/county_race_by_age_forecast.js')(app, pg, conString);
require('./routes/county_sya.js')(app, pg, conString);
require('./routes/county_sya_race_estimates.js')(app, pg, conString);
require('./routes/household_projections.js')(app, pg, conString);
require('./routes/jobs_by_sector.js')(app, pg, conString);
require('./routes/labor_force_participation.js')(app, pg, conString);
require('./routes/muni_pop_housing.js')(app, pg, conString);


var server = app.listen(4001, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://', host, port);
});