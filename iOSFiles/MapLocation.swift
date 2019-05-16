//
//  MapLocation.swift
//  PracticalPrototpye
//
//  Created by Mike Spears on 2019-05-13.
//  Copyright © 2019 Mike Spears. All rights reserved.
//

import Foundation
import MapKit

// This class is our "Model" class that represents a map pin.
// It conforms to the Codable protocol so that we can endode/decode to/from JSON.
// It conforms to the MKAnnotation protcol and NSObject so that it can be shown directly on a MapView.

class MapLocation : NSObject, Codable, MKAnnotation {
    
    // the system uses this to print a readable version in the console
    override var description: String {
        return "\(self.title ?? "null")\n\t(\(self.latitude), \(self.longitude))\n"
    }
    
    // lets us create instances of MapLocation programmatically (e.g. when submitting a new location)
    init(coordinate: CLLocationCoordinate2D, title: String, subtitle: String) {
        self.latitude = String(coordinate.latitude)
        self.longitude = String(coordinate.longitude)
        self.title = title
        self.subtitle = subtitle
    }
    
    // converts the latitude and longitude strings to a CLLocationCoordinate2D type
    // in order to conform with the MKAnnotation protocol
    // the MapView reads this variable to know where to show the pin on the map
    var coordinate: CLLocationCoordinate2D {
        return CLLocationCoordinate2D(latitude: Double(latitude)!,
                                      longitude: Double(longitude)!)
    }
    
    // properties that are returned from / submitted to / the server
    var rowid: Int?
    var title: String?
    var subtitle: String?
    
    var latitude: String
    var longitude: String
    
    var value1: String?
    var value2: String?
  
}

