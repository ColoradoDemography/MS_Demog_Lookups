
//function to check all data input against valid values
module.exports.validate = function(data, check){
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

        function pad(n, width, z) {

        }
module.exports.pad = function(n, width, z){
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


module.exports.sendtodatabase = function(sqlstring, pg, conString, res){

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


module.exports.sortNumeric = function(){
  
  
}

