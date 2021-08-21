

const ControlPanel = ({view}) => {

    const CheckPosition = ({bounds, center}) => {
        if (map.getZoom() < 6)
            return false
        let poly = turf.bboxPolygon([
            bounds._sw.lng,
            bounds._sw.lat,
            bounds._ne.lng,
            bounds._ne.lat,
        ])
        return turf.pointsWithinPolygon(
            turf.points([ [center[0], center[1]] ]),
            poly
        ).features.length != 0
    }

    const mapId = 'map_' + new Date().getTime()
    const mapContainer = $('<div>').addClass('map')
        .attr('id', mapId)
    view.append(mapContainer)

    const flyToNsk = $('<div>').addClass('fly-to-nsk')
        .click(function(){
            map.flyTo({
                center: [55.030204, 82.920430].reverse(), // starting position [lng, lat]
                zoom: 9.6,
                pitch: 60
            })
        })
        .hide()
    view.append(flyToNsk)

    const map = new mapboxgl.Map({
        container: mapId, // container ID
        style: 'static/js/style.json', // style URL
        // style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [55.030204, 82.920430].reverse(), // starting position [lng, lat]
        zoom: 9.6, // starting zoom,
        pitch: 60
    });

    map.on('move', function(){
        let visibleFlag = CheckPosition({
            bounds: map.getBounds(),
            center: [55.030204, 82.920430].reverse()
        })
        if (!visibleFlag && flyToNsk.get(0).style.display == 'none')
            flyToNsk.fadeIn(200)
        if (visibleFlag && flyToNsk.get(0).style.display != 'none')
            flyToNsk.fadeOut(200)
    })

    console.log(map)

}