var map;

// callback to load app after successful google api load
function loadApp() {

    $(window).resize(function() {
        google.maps.event.trigger(map, "resize");
    });

    function setHeight() {
        // resize map if on mobile device at breakpoint to prevent unnecessary scrolling
        if ($(window).width() <= 992) {
            var h = $(window).height();
            var searchh = 83; // height of title and searchbar
            var listh = 84; // height of visible list
            $('#map-canvas').height(h - (searchh + listh));
        }
    }

    /* map is configured via the data in config.js and bound to #map-canvas     */
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        zoom: mapZoom,
        center: {
            lat: mapLatitude,
            lng: mapLongitude
        },
        disableDefaultUI: true
    });

    var ViewModel = function(locations, map) {
        var self = this;
        self.map = map;
        self.query = ko.observable("");
        self.locations = ko.observableArray([]); // locations
        self.mapBounds = new google.maps.LatLngBounds(); // boundaries of map determined by markers

        /* resets map bounds on resize event */
        google.maps.event.addDomListener(window, "resize", function() {
            self.adjustMapBounds();
        });

        /* set the api data for a specific location */
        self.setApiData = function(location) {
            function getInfoWindowText(responseVenue) {
                return "<p><strong>" + responseVenue.name + "</strong></p><div><a href=" + responseVenue.canonicalUrl + ">Visit on foursquare!</a></div>";
            }


            function getInfoWindowErrorText(location) {
                return "<p><strong>" + location.name + "</strong></p><div>Error in retrieving Foursquare API Data</div>";
            }

            $.ajax({
                url: "https://api.foursquare.com/v2/venues/" + location.venueId + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20130815',
                method: "GET",
                dataType: "jsonp",
                success: function(results) {
                    var infowindow = new google.maps.InfoWindow({
                        content: getInfoWindowText(results.response.venue)
                    });
                    location.infowindow = infowindow;
                },
                error: function(e) {
                    var infowindow = new google.maps.InfoWindow({
                        content: getInfoWindowErrorText(location)
                    });
                    location.infowindow = infowindow;
                }

            });
        };

        self.closeInfoWindows = function() {
            for (var i = 0; i < self.locations().length; i++) {
                if (self.locations()[i].infowindow) {
                    self.locations()[i].infowindow.close();
                }
            }
        };

        /* create a marker and give it a click event to open the location's infowindow */
        self.createMarker = function(location) {
            var markerPosition = new google.maps.LatLng(location.lat, location.lng);

            var marker = new google.maps.Marker({
                position: markerPosition,
                map: self.map,
                title: location.name
            });

            self.setApiData(location);

            marker.addListener("click", function() {

                self.closeInfoWindows();
                location.infowindow.open(self.map, marker);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 2000);
            });

            marker.visible = ko.observable(true);
            return marker;
        };

        /* takes the config location object and adds map information to it */
        self.createLocations = function(locations) {
            for (var i = 0; i < locations.length; i++) {
                //self.setApiData(locations[i]);
                locations[i].marker = self.createMarker(locations[i], null);
            }
            return locations;
        };

        /* toggles marker visibility for all markers */
        self.toggleMarkerVisibility = function(visibility) {
            for (var i = 0; i < self.locations().length; i++) {
                self.locations()[i].marker.visible(visibility);
            }
        };

        /* adjust the map bounds so that the map adjusts to the markers.  If all markers are hidden, show the default map */
        self.adjustMapBounds = function() {
            var locCount = 0;
            for (var i = 0; i < self.locations().length; i++) {
                if (self.locations()[i].marker.visible()) {
                    locCount++;
                    self.mapBounds.extend(self.locations()[i].marker.position);
                }
            }

            if (locCount > 0) {
                self.map.fitBounds(self.mapBounds);
            } else {
                self.mapBounds = new google.maps.LatLngBounds();
                self.map.setCenter(getMapCenter());
            }
        };

        /* get map and api data and feed config to an observable */
        self.locations = ko.observableArray(self.createLocations(locations));
        self.adjustMapBounds();

        /* filters locations by business name or street address... important in New Orleans where the streets are short and plentiful */
        self.filteredLocations = ko.computed(function() {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                // sometimes we don't remember the shop name, but remember the street it was on
                var matchName = location.name.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
                var matchStreet = location.street.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;

                return (matchName || matchStreet);

            });
        }, self);

        /* subscribe the locations to the search and filter them when necessary */
        self.filteredLocations.subscribe(function() {
            var locationDiff = ko.utils.compareArrays(self.locations(), self.filteredLocations());
            for (var i = 0; i < locationDiff.length; i++) {
                if (locationDiff[i].status == "deleted") {
                    locationDiff[i].value.marker.visible(false);
                    locationDiff[i].value.marker.setMap(null);
                } else {
                    locationDiff[i].value.marker.visible(true);
                    locationDiff[i].value.marker.setMap(self.map);
                }
            }
            self.mapBounds = new google.maps.LatLngBounds();
            self.adjustMapBounds();
        });

        /* this features a marker upon a click of the address list */
        self.revealMarker = function(location) {
            self.closeInfoWindows();
            var markerPosition = new google.maps.LatLng(location.lat, location.lng);
            location.infowindow.open(self.map, location.marker);
            location.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                location.marker.setAnimation(null);
            }, 2000);
            self.map.setCenter(markerPosition);
        };
    };
    /* apply viewmodel bindings to the configured locations and map */
    ko.applyBindings(new ViewModel(locations, map));

}

function googleFail() {
    alert('Could not load Google Maps API');
}