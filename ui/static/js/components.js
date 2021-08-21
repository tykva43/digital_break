const SchedulePicker = ({ onValueChange, target }) => {
    let w = $('<div>').addClass('schedule-picker')
    const selectedDays = {}

    target.forEach(item => {
        let dayEl = $('<div>').text(item)
        dayEl.on('click', function() {
            if ($(this).hasClass('selected')) {
                selectedDays[item] = false
            } else {
                selectedDays[item] = true
            }
            $(this).toggleClass('selected')
            onValueChange(
                Object.keys(selectedDays).filter(
                    x => selectedDays[x] == true
                )
            )
        })
        w.append(dayEl)
    })



    return w
}

const NewContractForm = (view) => {

    const formState = {}

    const adressPicker = AdressPicker({
        onSelectAdress: value => {
            formState['adresses'] = value
            console.log(formState)
        }
    })
    const countPicker = CountPicker({
        onValueChange: value => formState['count'] = value,
        title: 'Желаемое количество рекламных контактов',
        target: [500, 1000, 2000, 5000, 10000]
    })
    const freqPicker = CountPicker({
        onValueChange: value => formState['count'] = value,
        title: 'Частота показов в час',
        target: [6, 9, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72]
    })
    const weekPicker = SchedulePicker({
        onValueChange: value => formState['schedule'] = {
            ...formState['schedule'],
            days: value
        },
        target: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    })
    const hourPicker = SchedulePicker({
        onValueChange: value => formState['schedule'] = {
            ...formState['schedule'],
            hours: value
        },
        target: new Array(24).fill('').map((_, index) => index)
    })

    view.append($('<h4>Адресная программа</h4>'))
    view.append($('<div class="map-frame">')
        .append(adressPicker)
    )

    view.append(countPicker)

    view.append($('<h4>Период</h4>'))
    view.append($('<h4>Дни недели</h4>'))
    view.append(weekPicker)
    view.append($('<h4>Часовой интервал</h4>'))
    view.append(hourPicker)
    view.append(freqPicker)

    view.append($('<div>').addClass('footer')
        .append($('<button>').text('Сохранить').addClass('accent'))
        .append($('<button>').text('Отменить'))
    )

}

const CountPicker = ({ onValueChange, title, target }) => {
    const id = 'slider_' + new Date().getTime()
    const view = $('<div>')
    const valueview = $('<h4>').text(target[0]).css({
        margin: 0,
        marginLeft: 4
    })
    const slider = $('<div class="slider">')
        .attr('id', id)

    view.append($('<h4>').text(title + ':').append(valueview)
        .css({
            display: 'flex',
        })
    )

    view.append(slider)
    slider.slider({
        min: 0,
        max: target.length - 1,
        range: 'min',
        value: 0,
        slide: (event, ui) => {
            valueview.text(target[ui.value])
            onValueChange(target[ui.value])
        }
    })

    return view
}

const AdressPicker = ({ onSelectAdress }) => {
    const id = 'id_' + new Date().getTime()
    const view = $('<div class="map">')
        .attr("id", id)
    const adresses = {}
    let waiter = () => {
        if ($('#' + id).length != 0) {
            $(document).off('DOMSubtreeModified', waiter)
            const map = new mapboxgl.Map({
                container: id, // container ID
                style: '/ui/static/js/style.json', // style URL
                // style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [55.030204, 82.920430].reverse(), // starting position [lng, lat]
                zoom: 9.6, // starting zoom,
                pitch: 60
            });
            console.log(map)
            players.forEach(player => {
                let el = $('<div>').addClass('player')

                el.on('click', function() {

                    if ($(this).hasClass('selected')) {
                        adresses[player.PlayerId] = false
                    } else {
                        adresses[player.PlayerId] = true
                    }
                    onSelectAdress(
                        Object.keys(adresses).filter(
                            x => adresses[x] == true
                        )
                    )
                    $(this).toggleClass('selected')

                })

                let marker = new mapboxgl.Marker(el.get(0))
                    .setLngLat([player.GeoLon, player.GeoLat])
                    .addTo(map)
            })
        }

    }
    $(document).on('DOMSubtreeModified', waiter)

    return view
}