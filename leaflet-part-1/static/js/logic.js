// API endpoint
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// create layerGroup
var earthquakes = L.layerGroup();

// create base layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// create baseMap object
var baseMap = {
    "Street Map": street
};

// create overlay object
var overlayMaps = {
    Earthquakes: earthquakes,
};

// create map to display on load
var myMap = L.map("map", {
    center: [
        36.731337792070654, -4.6214974225825785
    ],
    zoom: 3,
    layers: [street, earthquakes]
});

// GET request for earthquake data
d3.json(earthquakesURL).then(data => {

    // function to populate popup for each feature
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h3>${feature.properties.title}</h3>
            <hr>
            <p>${new Date(feature.properties.time)}</p>
            <p>latitude: ${feature.geometry.coordinates[0]}, longitude: ${feature.geometry.coordinates[1]}, depth:${feature.geometry.coordinates[2]} km</p>`);
    };

    // function to convert markers to circle shape
    function pointToLayer(feature, latlng) {

        // parameters for circle markers
        var markerOptions = {
        radius: feature.properties.mag**3/4, // radius by magnitude
        fillColor: getColor(latlng.alt), // color gradient by depth
        color: "#808080", // grey outline
        opacity: 0.5,
        fillOpacity: 0.5,
        weight: 1,
        };

        return L.circleMarker(latlng, markerOptions);
    };

    // create GeoJSON layer with created features
    L.geoJSON(data, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
    }).addTo(earthquakes);

    earthquakes.addTo(myMap);
});

// Set up the legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        altitudes = [-10, 50, 150, 200, 250, 300, 350, 400, 450],
        labels = [];
    let from, to;

    for (let i = 0; i < altitudes.length; i++) {
        from = altitudes[i];
        to = altitudes[i + 1];

        labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
    }

    div.innerHTML = '<h3 style="text-align: center">Depth (km)</h3>'+ labels.join('<br>');
    return div;
};

legend.addTo(myMap);

// function to assign color for markers
function getColor(alt) {
    return  alt >= 450  ?   "#552a58": 
            alt >= 400  ?   "#73315c":
            alt >= 350  ?   "#8e3a5d":
            alt >= 300  ?   "#a7465a":
            alt >= 250  ?   "#bb5654":
            alt >= 200  ?   "#ca6a4e":
            alt >= 150  ?   "#d48148":
            alt >= 100  ?   "#d89945":
            alt >= 50   ?   "#d5b348":
                            "#cdcd55"
};