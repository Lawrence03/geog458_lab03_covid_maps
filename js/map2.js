const legend = document.getElementById('legend');
const source =
    '<p style="text-align: left; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
let labels = ['<strong>Cases:</strong>'];
let vbreak = null;
const grades = [100, 1000, 10000, 100000];
const colors = ['rgb(254,240,217)',
    'rgb(253,204,138)',
    'rgb(252,141,89)',
    'rgb(215,48,31)'];
const radii = [2.5, 7.5, 10, 20];
mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
    container: 'map',
    projection: 'albers',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5,
    center: [-100, 40]
}
);
map.on('load', () => {
    map.addSource('covid-cases', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });
    map.addLayer({
        'id': 'covid-cases-point',
        'type': 'circle',
        'source': 'covid-cases',
        'paint': {
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]],
                    [grades[3], radii[3]],
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 0.8,
            'circle-opacity': 0.6
        }
    });
});
map.on('click', 'covid-cases-point', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>${event.features[0].properties.county}, ${event.features[0].properties.state}</strong>
                <br><strong>Cases:</strong> ${event.features[0].properties.cases}
                <br><strong>Deaths:</strong> ${event.features[0].properties.deaths}`)
        .addTo(map);
});
for (let i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    let dot_radius = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radius +
        'px; height: ' +
        dot_radius + 'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' + vbreak +
        '</span></p>');
}
legend.innerHTML = labels.join('') + source;