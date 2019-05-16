// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// parse incoming request body data as JSON
app.use(bodyParser.json());

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/locations7.db';  
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);   

// if .db does not exist, create it, otherwise print records to console
db.serialize(function(){  
  if (!exists) {
    db.run('CREATE TABLE Locations (rowid integer primary key, title, subtitle, latitude, longitude, value1, value2)');
    console.log('New table Locations created!');
 
    db.serialize(function() {
      db.run('INSERT INTO Locations (title, subtitle, latitude, longitude, value1, value2) VALUES ($title, $subtitle, $latitude, $longitude, $value1, $value2)',
             {$title: "Goldstruck Coffee",
              $latitude:"43.67029220",
              $longitude:"-79.39235010",
              $subtitle:"(647) 345-0973",
              $value1:null,
              $value2:null      
      });
      db.run('INSERT INTO Locations (title, subtitle, latitude, longitude, value1, value2) VALUES ($title, $subtitle, $latitude, $longitude, $value1, $value2)',
             {$title: "Jimmy's Coffee",
              $latitude:"43.65847660",
              $longitude:"-79.38558230",
              $subtitle:"(416) 792-1141",
              $value1:"http://jimmyscoffee.ca",
              $value2:null      
      });
      db.run('INSERT INTO Locations (title, subtitle, latitude, longitude, value1, value2) VALUES ($title, $subtitle, $latitude, $longitude, $value1, $value2)',
             {$title: "Coffee Dak Lak",
              $latitude:"43.65758070",
              $longitude:"-79.40082070",
              $subtitle:"(647) 447-0097",
              $value1:"http://coffeedaklak.com",
              $value2:null      
      });
    });

  }
  else {
    console.log('Database "Locations" ready to go!');
    db.each('SELECT * from Locations', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  
  }
});


// endpoint to get all the items in the database
app.get('/getLocations', function(request, response) {
  // response.send("Locations go here.");
  db.all('SELECT * from Locations', 
         function(err, rows) {
            response.send(JSON.stringify(rows));
         }
  );
});

// endpoint to add an item to the database

app.post('/addLocation', function(request, response) {
  var location = request.body;
  // Note: Normally you would have to validate this data before adding it to the database!!
  // This is because this function could just as easily be called by a remote hacker running a script just as much as it 
  // could come from our official app. Same goes for the other endpoints.
  console.log(location);
  db.serialize(function() {
    db.run('INSERT INTO Locations(title, subtitle, latitude, longitude, value1, value2) VALUES (?, ?, ?, ?, ?, ?)',
          location.title,
           location.subtitle,
           location.latitude,
           location.longitude,
           location.value1, 
           location.value2);
  });
  response.end();
}); 

// endpoint to update properties for an item already in the database
app.post('/updateLocation', function(request, response) {
  var location = request.body;
  db.serialize(function() {
    db.run('UPDATE Locations SET (title, subtitle, latitude, longitude, value1, value2) = (?, ?, ?, ?, ?, ?) WHERE rowid = ?',
           location.title,
           location.subtitle,
           location.latitude,
           location.longitude,
           location.value1, 
           location.value2,
           location.rowid);
  });
  response.end();
});

// endpoint to delete an item from the database
app.post('/deleteLocation', function(request, response) {
  var location = request.body;
  db.serialize(function() {
    db.run('DELETE from Locations WHERE rowid = ?',
           location.rowid);
  });
  response.end();
});

// start running the server &
// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
