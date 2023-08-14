
// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with options.
let map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3,
});

streetmap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    function mapStyle(feature) {
        return {
            fillColor: earthquakeColor(feature.geometry.coordinates[2]),
            radius: earthquakeRadius(feature.properties.mag),
            opacity: 1,
            fillOpacity: 1,
            color: "black",
            weight: 0.5
        }
    }
    function earthquakeColor(depth) {
        if (depth > 90) {
            return "#d73027"
        }
        if (depth > 70) {
            return "#fc8d59"
        }

        if (depth > 50) {
            return "#fee08b"
        }

        if (depth > 40) {
            return "#d9ef8b"
        }

        if (depth > 10) {
            return "#91cf60"
        }
        return "#1a9850"
    }
    function earthquakeRadius(mag) {
        return mag * 4
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: mapStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map)

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [10, 40, 50, 70, 90],
            labels = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + earthquakeColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
})

