
$(document).ready(_=>{
    const view = Modal({})
    NAVGRAPH.initMenu(view)
    $(NAVGRAPH).on('show', _=>{
        view.open()
    })
    return view
})

const ControlPanel = ({view}) => {



    const CheckPosition = ({bounds, center, map}) => {
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
        .append($('<i class="fa fa-map-marker" aria-hidden="true"></i>'))
        .click(function(){
            globalMap.flyTo({
                center: [55.030204, 82.920430].reverse(), // starting position [lng, lat]
                zoom: 9.6,
                pitch: 60
            })
        })
        .hide()
    mapContainer.append(flyToNsk)

    globalMap = new mapboxgl.Map({
        container: mapId, // container ID
        style: 'static/js/style.json', // style URL
        // style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [55.030204, 82.920430].reverse(), // starting position [lng, lat]
        zoom: 9.6, // starting zoom,
        pitch: 60
    });

    globalMap.on('load', _ => {
        players.forEach(player => {
            let el = $('<div>').addClass('big-player')

            el.on('click', function() {
                $(this).siblings().each(function(){
                    if ($(this).hasClass('selected'))
                        $(this).toggleClass('selected')
                })
//                $(this).addClass('selected')

                NAVGRAPH.doTransition({
                    from: NAVGRAPH.current.id == 'Player'
                        ? null
                        : NAVGRAPH.current.id,
                    to: 'Player',
                    transition: TRANSITION.SLIDERIGHT
                }, {player})
            })
            el.get(0).player = player

            let marker = new mapboxgl.Marker(el.get(0))
                .setLngLat([player.GeoLon, player.GeoLat])
                .addTo(globalMap)
        })
    })

    globalMap.on('move', function(){
        let visibleFlag = CheckPosition({
            bounds: globalMap.getBounds(),
            center: [55.030204, 82.920430].reverse(),
            map: globalMap
        })
        if (!visibleFlag && flyToNsk.get(0).style.display == 'none')
            flyToNsk.fadeIn(200)
        if (visibleFlag && flyToNsk.get(0).style.display != 'none')
            flyToNsk.fadeOut(200)
    })


}