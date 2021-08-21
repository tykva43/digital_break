

const MainHost = ({}) => {

    var state = {
        current: CompanyList({
            onSelect: company => navigate({
                component: CompanyInfo({company})
            }),
            onAdd: _ => navigate({
                component: NewContractForm({})
            })
        }),
        backStack: [],
        title: 'Лист компаний'
    }
    const navigate = ({component}) => {
        let old = {current: state.current, title: state.title}
        state.backStack.unshift(old)
        state.current = component
        setState(state)
    }
    const pop = () => {
        let old = state.backStack.pop(0)
        state.current = old.current
        state.title = old.title
        setState(state)
    }
    const setState = (newState) => {
        state = newState
        render()
    }
    const render = () => {
        content.children().remove()
        content.append(state.current)
        if (state.backStack.length > 0){
            view.setBack(_ => pop())
        }
        else{
            view.setBack(null)
        }
    }
    const content = $('<div>')
    const view = Modal({content})
    render()


    return view
}

const ControlPanel = ({view}) => {

    const mainHost = MainHost({})

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
    mapContainer.append(flyToNsk)

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