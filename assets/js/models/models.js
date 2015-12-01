function LocationModel(name, street, city, state, lat, lng, map) {
    this.name = name;
    this.street = street;
    this.city = city;
    this.state = state;
    this.lat = lat;
    this.lng = lng;

    this.marker = new googlemaps.Marker({
        position: new googlemaps.LatLng(this.lat, this.lng),
        title: this.name
    });
    this.apiData = ko.observable('');

    this.visible = ko.observable(false);
    this.visible.subscribe(function (visibility) {
        if (visibility) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
    });
    this.visible = ko.observable(true);

    this.streetAddress = ko.computed(function () {
        return this.street + " " + this.city + ", " + this.state;
    });

    this.fullAddress = ko.computed(function () {
        return name + " " + this.street + " " + this.city + ", " + this.state;
    });

    return this;
}
