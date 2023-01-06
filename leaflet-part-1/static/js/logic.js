// API endpoint
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// GET request for data
d3.json(queryURL).then(data => {
    createFeatures(data.features);
});

// function to create popup tooltip for each feature
// markers should reflect the size and depth of earthquake by color
// higher magnitude - larger
// greater depth - darker (3rd coordinate)
function createFeatures(data) {

    // function to populate popup for each feature
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // create GeoJSON layer with created features
    var earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature
    });

    // call function to add features to map
    createMap(earthquakes);
};

// function to create map with layers
function createMap(earthquakes) {

    // create base layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // create baseMap object
    var baseMap = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // create overlay object
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // create map to display on load
    var myMap = L.map("map", {
        center: [
            36.731337792070654, -4.6214974225825785
        ],
        zoom: 3,
        layers: [street, earthquakes]
    });

    // layer control to pass baseMap and overlayMap to the map
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}