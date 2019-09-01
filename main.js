var mymap = L.map('mapid').setView([43.72, -79.3832], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var geojson;

function getColor(x) {
    return  x <= 38.44 ? "#edf8fb":
            x <= 39.9 ? "#b2e2e2":
            x <= 41.52 ? "#66c2a4":
            x <= 43.66 ? "#2ca25f":
            "#006d2c";

} 

function style(feature) {
	return {
		fillColor: getColor(feature.properties.Age),
		weight: 2,
		opacity: 1,
		color: 'black',
		dashArray: '3',
		fillOpacity: 1
	};
}


function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#2DFDFF',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
    }
    info.update(layer.feature.properties);

}

var myChart;
function AddToChart(e) {
    var layer = e.target;
    if (myChart) {
        myChart.destroy();
    }
    mymap.fitBounds(e.target.getBounds());
    var ctx = document.getElementById('myChart').getContext('2d');
    
    var c0_4 = layer.feature.properties["0 to 4 years"]
    var c5_9 = layer.feature.properties["5 to 9 years"]
    var c10_14 = layer.feature.properties["10 to 14 years"]
    var c15_19 = layer.feature.properties["15 to 19 years"]
    var c20_24 = layer.feature.properties["20 to 24 years"]
    var c25_29 = layer.feature.properties["25 to 29 years"]
    var c30_34 = layer.feature.properties["30 to 34 years"]
    var c35_39 = layer.feature.properties["35 to 39 years"]
    var c40_44 = layer.feature.properties["40 to 44 years"]
    var c45_49 = layer.feature.properties["45 to 49 years"]
    var c50_54 = layer.feature.properties["50 to 54 years"]
    var c55_59 = layer.feature.properties["55 to 59 years"]
    var c60_64 = layer.feature.properties["60 to 64 years"]
    var c65_69 = layer.feature.properties["65 to 69 years"]
    var c70_74 = layer.feature.properties["70 to 74 years"]
    var c75_79 = layer.feature.properties["75 to 79 years"]
    var c80_84 = layer.feature.properties["80 to 84 years"]
    var c85_89 = layer.feature.properties["85 to 89 years"]
    var c90_94 = layer.feature.properties["90 to 94 years"]
    var c95_99 = layer.feature.properties["95 to 99 years"]
    var c100 = layer.feature.properties["100 years and over"]


    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['0 to 4', '5 to 9', '10 to 14', '15 to 19', '20 to 24', '25 to 29', '30 to 34', '35 to 39', '40 to 44', '45 to 49', '50 to 54', '55 to 59', '60 to 64', '65 to 69', '70 to 74', '75 to 79', '80 to 84', '85 to 89', '90 to 94', '95 to 99', '100+'],
            datasets: [{
                label: '# of People in Age Category',
                data: [c0_4, c5_9, c10_14, c15_19, c20_24, c25_29, c30_34, c35_39, c40_44, c45_49, c50_54, c55_59, c60_64, c65_69, c70_74, c75_79, c80_84, c85_89, c90_94, c95_99, c100],
                backgroundColor: '#2CE632',
                borderColor: '#0C400E',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: AddToChart
	});
}

geojson = L.geoJSON(torontoages, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);

var info = L.control();

info.onAdd = function (mymap) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>Toronto Age Map</h4>' +  (props ?
		'<b>Average Age: ' + props.Age + '</b>'
		: '- Hover over for Average Age <br>- Click to get a detailed breakdown');
};

info.addTo(mymap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (mymap) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [28.10, 38.44, 39.90, 41.52, 43.66, 80.10],
		labels = ['Legend'];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length - 1; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] + '<br>' : '');
    }
    
	return div;
};

legend.addTo(mymap);

function getFullExtent() {
    mymap.fitBounds(geojson.getBounds());
}
