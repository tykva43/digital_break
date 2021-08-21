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
const TimeRangePicker = ({ onValueChange }) => {
    let w = $('<div>').addClass('schedule-picker')
    var start, end
    var selectStarted = false
    const target = new Array(24).fill('').map((_, i) => i)
    target.forEach(item => {
        let dayEl = $('<div>').text(item)
        dayEl.on('click', function() {
            if (!selectStarted){
                dayEl.siblings().each(function(){
                    if ($(this).hasClass('selected'))
                        $(this).toggleClass('selected')
                })
                $(this).addClass('selected')
                selectStarted = $(this)
            } else{
                let i = selectStarted.index()
                if (i < $(this).index()){
                    start = target[i]
                    stop = target[$(this).index()]
                }
                else{
                    stop = target[i]
                    start = target[$(this).index()]
                }
                onValueChange(start, stop)
                let h = selectStarted.index() - $(this).index() < 0 ? 1 : -1
                while(i != $(this).index()){
                    console.log(i, $(this).index())
                    $(dayEl.parent().children().get(i)).addClass('selected')
                    i += h
                }
                $(this).addClass('selected')

                selectStarted = false
            }
        })
        dayEl.on('mouseenter', function(){
            console.log($(this).index())
            if (selectStarted){
                let i = selectStarted.index()

                let h = selectStarted.index() - $(this).index() < 0 ? 1 : -1
                while (i != $(this).index()){

                    $(dayEl.parent().children().get(i)).addClass('hover')
                    i += h
                }
            }
        })
        dayEl.on('mouseleave', _ => dayEl.siblings().each(function(){
            if ($(this).hasClass('hover'))
                $(this).toggleClass('hover')

        }))
        w.append(dayEl)
    })



    return w
}

const Modal = ({}) => {
    const component = {}
    const overlay = $('<div>').addClass('overlay')
    $('body').append(overlay)
    const overlayState = {
        overlayVisible: true,
        scrollPosition: 0
    }
    const wrapper = $('<div>').addClass('modal-wrapper')
    const vp = $('<div>').addClass('viewPort')
    const header = $('<div>').addClass('head')
    const footer = $('<div>').addClass('foot')
        .append($('<div class=bottomButtons>')
            .append($('<button class="accept">').text('Применить'))
            .append($('<button class="decline">').text('Отменить'))
            .append($('<button class="ok">').text('Ok'))
        )
    $('body').append(wrapper)
    $('body').animate({scrollTop: $('body').height() - 100}, 100)
    wrapper.append($('<div class="lock">'))
    wrapper.append(header)
    wrapper.append(vp)
    wrapper.append(footer)

    overlay.click(function(){
        if (overlayState.overlayVisible){
            $(this).fadeOut(100)
            overlayState.scrollPosition = $('body').scrollTop()
            $('body').animate({scrollTop: 0}, 100, 'swing', setTimeout(_=>$(document).bind('scroll', show), 150))
        }
        overlayState.overlayVisible = false
        wrapper.addClass('hidden')
    })
    let show = function(){
        $(document).unbind('scroll', show)
        if (!overlayState.overlayVisible){
            overlay.fadeIn(100)
            $('body').animate({scrollTop: overlayState.scrollPosition}, 100)
            overlayState.overlayVisible = true
        }
        if (wrapper.hasClass('hidden'))
            wrapper.toggleClass('hidden')

    }
    wrapper.on('click', show)
    wrapper.open = show
    return wrapper
}

const NewContractForm = ({onValueChange}) => {
    const view = $('<div>').addClass('form')
    const formState = {}

    const adressPicker = AdressPicker({
        onSelectAdress: value => {
            formState['addresses'] = value
            onValueChange(formState)
        }
    })
    const countPicker = CountPicker({
        onValueChange: value => {
            formState['count'] = value
            onValueChange(formState)
        },
        title: 'Желаемое количество рекламных контактов',
        target: [500, 1000, 2000, 5000, 10000]
    })
    const freqPicker = CountPicker({
        onValueChange: value => {
            formState['count'] = value
            onValueChange(formState)
        },
        title: 'Частота показов в час',
        target: [6, 9, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72]
    })
    const weekPicker = SchedulePicker({
        onValueChange: value => {
            formState['schedule'] = {
                ...formState['schedule'],
                days: value
            }
            onValueChange(formState)
        },
        target: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    })
//    const hourPicker = SchedulePicker({
//        onValueChange: value => {
//            formState['schedule'] = {
//                ...formState['schedule'],
//                hours: value
//            }
//            onValueChange(formState)
//        },
//        target: new Array(24).fill('').map((_, index) => index)
//    })
    const hourPicker = TimeRangePicker({
        onValueChange: (start, end) => {
            formState['schedule'] = {
                ...formState['schedule'],
                time_start: start,
                time_end: end
            }
            onValueChange(formState)
        }
    })
    const dateRangePicker = $('<input>').daterangepicker({
        minDate: new Date(),
        locale: {
            format: 'DD.MM.YYYY'
        }
    }, function(start, end){
        formState['schedule'] = {
            ...formState['schedule'],
            dateRange: [start, end]
        }
        onValueChange(formState)
    });

    view.append($('<h4>Адресная программа</h4>'))
    view.append($('<div class="map-frame">')
        .append(adressPicker)
    )

    view.append(countPicker)

    view.append($('<h4>Период</h4>'))
    view.append(dateRangePicker)
    view.append($('<h4>Дни недели</h4>'))
    view.append(weekPicker)
    view.append($('<h4>Часовой интервал</h4>'))
    view.append(hourPicker)
    view.append(freqPicker)



    return view

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
                style: '/static/js/style.json', // style URL
                // style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: [55.030204, 82.920430].reverse(), // starting position [lng, lat]
                zoom: 9.6, // starting zoom,
                pitch: 60
            });
            console.log(map)
            map.on('load', _ => {
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
            })

        }

    }
    $(document).on('DOMSubtreeModified', waiter)

    return view
}