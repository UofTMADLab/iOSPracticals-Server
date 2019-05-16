import UIKit
import MapKit


struct MapLocation : Codable {
    var title: String
    var latitude: String
    var longitude: String
}

var getLocation = URL(string: "https://grey-stamp.glitch.me/getLocations")!
var getLocationRequest = URLRequest(url: getLocation)

URLSession.shared.dataTask(with: getLocationRequest) { (data, response, error) in
    let locations = try! JSONDecoder.init().decode(Array<MapLocation>.self, from: data!)
    print(locations)
}.resume()

// uploading

var newLocation = MapLocation(title: "New Playground Location", latitude: "43.77029220", longitude: "-79.39235010");

var addLocation = URL(string: "https://grey-stamp.glitch.me/addLocation")!
var addLocationRequest = URLRequest(url: addLocation)
addLocationRequest.httpMethod = "POST"
addLocationRequest.allHTTPHeaderFields = ["Content-Type": "application/json"]
addLocationRequest.httpBody = try! JSONEncoder.init().encode(newLocation)

URLSession.shared.dataTask(with: addLocationRequest) { (data, response, error) in
    
}.resume()
