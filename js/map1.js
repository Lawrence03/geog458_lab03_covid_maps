const layers = [
    '0% - 19%',
    '20% - 39%',
    '40% - 59%',
    '60% - 79%',
    '80% - 100%',
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70'
];
const legend = document.getElementById('legend');
const sourceItem = document.createElement('div');
const source =
    '<p style="text-align: left; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a>, <a href="https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">the U.S. Census Bureau</a></p>';
sourceItem.innerHTML = source;
mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
    container: 'map',
    projection: 'albers',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5,
    center: [-100, 40]
}
);
map.on('load', function loadingData() {
    map.addSource('covid-rates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });
    map.addLayer({
        'id': 'covid-rates-layer',
        'type': 'fill',
        'source': 'covid-rates',
        'paint': {
            'fill-color': [
                'step',      
                ['get', 'rates'],  
                '#FFEDA0',   
                20,          
                '#FED976',   
                40,          
                '#FEB24C',   
                60,          
                '#FD8D3C',   
                80,         
                '#FC4E2A'   
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });
});


map.on('click', 'covid-rates-layer', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.lngLat)
        .setHTML(`<strong>${event.features[0].properties.county}, ${event.features[0].properties.state}</strong>
                <br><strong>Cases:</strong> ${event.features[0].properties.cases}
                <br><strong>Deaths:</strong> ${event.features[0].properties.deaths}
                <br><strong>Case Rates:</strong> ${event.features[0].properties.rates}%`)
        .addTo(map);
});
legend.innerHTML = "<strong>COVID-19 Case Rates</strong><br>";
layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

legend.appendChild(sourceItem);