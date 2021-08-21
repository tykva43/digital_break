

$(document).ready(function(){

    mapboxgl.accessToken = 'pk.eyJ1IjoibnpheWNldiIsImEiOiJjazhudXZnaGMwMmIzM2RvM2N3MDl2dmNwIn0.cNCktRFle2xX3PsaB-l0MQ';
    const map = new mapboxgl.Map({
        container: 'map-container', // container ID
        style: '/ui/static/js/style.json', // style URL
        // style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [55.030204, 82.920430].reverse(), // starting position [lng, lat]
        zoom: 9 // starting zoom
    });


    players.forEach(player => {
        let el = $('<div>').addClass('player')
        let marker = new mapboxgl.Marker(el.get(0))
            .setLngLat([player.GeoLon, player.GeoLat])
            .addTo(map)
    })


})
