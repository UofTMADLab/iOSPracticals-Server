// for getLocations endpoint

db.all('SELECT * from Locations', 
       function(err, rows) {
          response.send(JSON.stringify(rows));
       }
);