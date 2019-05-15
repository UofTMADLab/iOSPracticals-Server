// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/locations2.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);   

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Locations (title, subtitle, latitude, longitude, value1, value2)');
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
    // // insert default dreams
    // db.serialize(function() {
    //   db.run('INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")');
    // });
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
  

// // http://expressjs.com/en/starter/basic-routing.html
// app.get('/', function(request, response) {
//   response.sendFile(__dirname + '/views/index.html');
// });

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getLocations', function(request, response) {
  db.all('SELECT rowid, title, subtitle, latitude, longitude, value1, value2 from Locations', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

app.post('/addLocation', function(request, response) {
  var location = request.body;
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

app.post('/deleteLocation', function(request, response) {
  var location = request.body;
  db.serialize(function() {
    db.run('DELETE from Locations WHERE rowid = ?',
           location.rowid);
  });
  response.end();
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
