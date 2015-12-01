var mapDiv = "map-canvas";
var mapZoom = 13;
var mapLatitude = 29.94853759174361;
var mapLongitude = -90.06432839101564;
var mapTypes = ["hybrid", "roadmap"];
var CLIENT_ID = 'E50SAVRHC02R3Q3UQYTXR2Y5C1PUHRBF0SZSZIVLJUIMICUK';
var CLIENT_SECRET = 'QF5V3TVZNZBWKIGAFUO5TIPU5M3YO4BMEB1Q3XPE5W1JRBFO';

var locations = [
    {name: "Don Leoncio", lat: "29.951642", lng: "-90.066909", street: "430 Canal Street", city: "New Orleans", state: "LA", venueId: '4bc8d374af07a593d4c1812d', apiData: null, marker: null},
    {name: "Cigar Factory New Orleans", lat: "29.955068", lng: "-90.068914", street: "206 Bourbon Street", city: "New Orleans", state: "LA", venueId: '4c81c8acdc018cfa0595c96c', apiData: null, marker: null},
    {name: "Smokecignals", lat: "29.9621788", lng: "-90.1149227", street: "8135 Oleander Street", city: "New Orleans", state: "LA", venueId: '50ba82f1e4b06d86d9ef908b', apiData: null, marker: null},
    {name: "Crescent City Cigar Shop", lat: "29.959026 ", lng: "-90.065132", street: "730 Orleans Street", city: "New Orleans", state: "LA", venueId: '4b80209bf964a520a55430e3', apiData: null, marker: null},
    {name: "La Habana Hemingway Cigar Bar", lat: "29.956821", lng: "-90.064169", street: "533 Toulouse Street", city: "New Orleans", state: "LA", venueId: '4d894ae01508a1435d750b1e', apiData: null, marker: null},
    {name: "Esteli Cigar Shop", lat: "29.955736", lng: "-90.064512", street: "515 St Louis Street", city: "New Orleans", state: "LA", venueId: '4be457fbbcef2d7fbe6a02e5', apiData: null, marker: null},
    {name: "Mayan Import Company", lat: "29.924945", lng: "-90.084715", street: "3000 Magazine Street", city: "New Orleans", state: "LA", venueId: '4ad4c052f964a52022f520e3', apiData: null, marker: null},
    {name: "N'awlins Cigar & Coffee", lat: "29.959089", lng: "-90.063771", street: "635 St Ann Street", city: "New Orleans", state: "LA", venueId: '4baf7abaf964a5203a033ce3', apiData: null, marker: null},
    {name: "Tobacco Exchange", lat: "29.955211", lng: "-90.066817", street: "320 Exchange Place", city: "New Orleans", state: "LA", venueId: '4adfa1ddf964a520517c21e3', vmarker: null}
];