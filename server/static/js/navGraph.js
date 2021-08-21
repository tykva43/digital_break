class ValueAnimator{
    constructor(){
        this.from = 0
        this.to = 0
        this.duration = 0
        this.delay = 0
        this.onchange = function(value){}
        this.onStop = function(){}
        this.onStart = function(){}
        this.func = Easing.linear
        this.fps = 10
    }
    setEasing(easing){
        this.func = easing
        return this
    }
    ofValues(from, to){
        this.from = from
        if (from == null)
            this.from = this.value
        this.to = to
        return this
    }
    stop(){
//        clearInterval(this.interval)
        this.onStop = ()=>{}
//        this.onStop()
    }
    setDelay(delay){
        this.delay = delay
        return this
    }
    setDuration(duration){
        this.duration = duration
        return this
    }
    setOnChange(handler){
        this.onchange = handler
        return this
    }
    setOnStop(handler){
        this.onStop = handler
        return this
    }
    setOnStart(handler){
        this.onStart = handler
        return this
    }
    start(){

        let va = this
        va.onStart()
        let get_value = function(k){
            // k in 0..20
            return va.from - - (va.to - va.from) * (va.func(k / 100))
        }
        let values = []
        va.h = (va.to - va.from) / (va.duration / va.fps)
        let v = va.from
        for (let k = 0; k <= 100; k += 1){
            values.push(get_value(k))
        }
        let duration = 200

        anime({
//            duration: 5000,
//            duration: va.duration,
            duration: duration,
            easing: "linear",
            delay: 0,
            update: function(progress) {
                va.onchange(values[Math.round(progress.progress)])
            },
            complete: function(){
                va.onStop()
            },
        });
//        let va = this

//        let k_ = 0
//        va.value = va.from
//        va.onchange(va.value)
//        va.onStart()
//        let frame = requestAnimationFrame(function(){
//        va.interval = setInterval(
//            function(){
//
//
//                    k_ += 1
//    //                va.value = get_value(k_)
//                    va.value = values[k_]
//                    let v = va.value
//                    let run = async ()=>{
//                        let fr = requestAnimationFrame(function(){va.onchange(v)})
//                        if ((va.to - va.value) * va.h / Math.abs(va.h) <= 0){
//                            cancelAnimationFrame(fr)
//                            va.onchange(va.to)
//                            va.onStop()
//                            clearInterval(va.interval)
//                            cancelAnimationFrame(frame)
//                        }
//                    }
//    //                if ((va.to - va.value) * va.h / Math.abs(va.h) <= 0){
//    //                    clearInterval(va.interval)
//    ////                    run = async()=>{}
//    //                    va.onStop()
//    //                }
//    //                else{
//    //                    run()
//    //                }
//                    run()
//    //                    va.value += va.h
//
//
//
//
//
//
//
//            }, va.duration / va.fps
//        )
//        })
    }
}


HEADER = {
    USER: 0b0001,
    BACK: 0b0010,
    HOME: 0b0100,
    SCN: 0b1000,
}

FOOTER = {
    NONE: 0b0000,
    ACCEPT: 0b0001,
    DECLINE: 0b0010,

}

TRANSITION = {
    SLIDERIGHT: 1,
    SLIDELEFT: 2,
    CLOSE: 3
}

class Navgraph{
    constructor(dict){
        let w = this
        for (let key in dict){
            w[key] = dict[key]
        }
        $(this).on('refresh', ()=>{
            this.initView(this.current)
        })
    }
    initMenu(view){
        let w = this
        let home = w.getViewById(w.start)
        if (home == null){
            console.error("Menu must be init first")
            return -1
        }
        for (let i in w.views){
            w.views[i].content = $(w.views[i].content)
            if (w.views[i].id != w.start)
                w.views[i].content.hide(0)
        }
        w.host = view
        w.initView(home)
    }
    doTransition(transition, exData){
        let w = this
        if (typeof(transition) == 'string')
            for(let i in w.transitions)
                if (w.transitions[i].id == transition){
                    transition = w.transitions[i]
                    w.backstack.unshift(transition.from)
                } else{}
        else{
            if (transition.from)
                if (!transition.native)
                    w.backstack.unshift(transition.from)
                else{}
            else
                transition.from = this.current
        }
        if (!!transition == false){
            console.error('incorrect transition')
            return
        }
        let head = w.host.children('.head')
        let foot = w.host.children('.foot')
        let vp = w.host.children('.viewPort')
//        let firstview = vp.children(':not(.ui-resizable-handle)')
        let firstview = w.getViewById(transition.from)
        if (!!firstview == false)
            firstview = transition.from
        if (!!firstview == false){
            console.error("incorrect transition", transition)
            return -1
        }
        let secondview = w.getViewById(transition.to)
        if (!!secondview == false)
            secondview = transition.to
        if (!!secondview == false){
            console.error("incorrect transition", transition)
            return -1
        }

        head.children('').each(function(){
            $(this).fadeOut(200)
        })
        let first = $('<div>').append(firstview.content).css({
            "position": "absolute",
            "width": "100%",
            "height": "100%",
        })
        let second = $('<div>').append(secondview.content).css({
            "position": "absolute",
            "width": "100%",
            "height": "100%",
        })
        let frame = $('<div>').append(second).append(first)
        frame.css({
            'position': 'relative',
            'overflow': 'hidden',
            'height': '100%'
        })
        vp.children(':not(.ui-resizable-handle)').remove()
        vp.append(frame)
        let args = [...arguments]
        args.splice(0, 1)
        args = [secondview].concat(args)

        $(w).trigger('preview', args)
        $(w).trigger('hide', firstview)
        let animator = new ValueAnimator()
            .setDuration(400)
            .setEasing(Easing.easeOutApprox)
            .setOnStart(function(){
                secondview.content.css('display', '')
//                second.css({opacity: 0})
            })
            .setOnStop(function(){
                vp.children().each(function(){
                    if ($(this) != second && $(this).hasClass('ui-resizable-handle') == false)
                        $(this).remove()
                })
                vp.append(secondview.content)
                w.initView(secondview)

            })
        switch (transition.transition){
            case TRANSITION.SLIDELEFT:
                animator
                    .ofValues(100, 0)
                    .setOnStart(function(){
                        secondview.content.css('display', '')
                        second.css({'z-index': '1', opacity: 0})
                        first.css({'z-index': '0'})
                    })
                    .setOnChange(function(value){
                        first.css({
                            'transform': 'scale(' + (value/100) + ')',
                            'filter': 'opacity(' + (value/100) + ')'})
                        second.css({'left': (- (value / 2)) + '%',
                            'opacity': 1 - (value) / 500})
                    })

                break
            case TRANSITION.SLIDERIGHT:
                animator
                    .ofValues(100, 0)
                    .setOnStart(function(){
                        secondview.content.css('display', '')
                        second.css({'z-index': '1', opacity: 0})
                        first.css({'z-index': '0'})
                    })
                    .setOnChange(function(value){
                        first.css({
                                    'transform': 'scale(' + (value/100) + ')',
                                    'filter': 'opacity(' + (value/100) + ')'})
                        second.css({'left': (value / 2) + '%',
                            'opacity': 1 - (value) / 500})
                    })
                break
            case TRANSITION.CLOSE:
                animator
                    .ofValues(100, 0)
                    .setOnChange(function(value){
                        first.css({
                            'transform': 'scale(' + (value / 200) + ')',
                            'filter': 'opacity(' + (value/100) + ')'
                        })
                        second.css({
                            'filter': 'opacity(' + (1 - (value/100)) + ')'
                        })
                    })
                break
            default:
                animator
                    .ofValues(100, 0)
                    .setOnChange(function(value){
                        first.css({'transform': 'translate(0, ' + value + '%)'})
                    })
                break
        }
        animator.start()
    }
    toHome(){
        this.doTransition({from:this.current,to:NAVGRAPH.start,transition:TRANSITION.CLOSE, native: true})
        this.backstack = []
    }
    back(){
        this.host.find('.head .back').trigger('click')
    }

    initView(view){
        let w = this
        let head = w.host.children('.head')
        let foot = w.host.children('.foot')
        let fb = w.host.children('.floatButton')
//        let w = w
        let vp = w.host.children('.viewPort')
//            .show()


        w._initheader(view)
        if (!!view.footer == true && view.footer != FOOTER.ADD && view.footer != 0){
    //        foot.slideDown(200)
            if (view.footer&FOOTER.ACCEPT || view.footer&FOOTER.DECLINE)
                foot.children('.bottomButtons').slideDown(200)
            else
                foot.children('.bottomButtons').slideUp(200)
            foot.find('button').hide()
            if (view.footer&FOOTER.ACCEPT)
                foot.find('.accept').show()
                    .off('click').on('click', _=>$(NAVGRAPH).trigger('accept'))
            if (view.footer&FOOTER.DECLINE)
                foot.find('.decline').show()
                .off('click').on('click', _=>$(NAVGRAPH).trigger('decline'))


        }
        else{
    //        foot.slideUp(200)
            foot.children().slideUp(200)
        }
        let fbclick = function(){
            $(w).trigger('add')
        }
        if (view.footer&FOOTER.ADD){
            fb.show(200)
            fb.off('click').on('click', fbclick)
        }
        else{
            fb.off('click', fbclick)
            fb.hide(200)
        }
        vp.append(view.content)
        view.content.css('display', '')
        $(w).trigger('show', view)
        view.content.find('*[transition]').each(function(){
            let transition = w.getTransitionById($(this).attr("transition"))
            if (transition == null){
                console.error("incorrect transition at", $(this))
                return null
            }
            $(this).click(function(){
                w.backstack.unshift(view)
                w.doTransition({...transition, native: true})
            })
        })
    }
    _initheader(view, header = view.header){
        let w = this
        let head = NAVGRAPH.host.children('.head')
        let foot = NAVGRAPH.host.children('.foot')
        head.html('')

        w.current = view
//        let collapse = $('<label>').html('<i class="fa fa-minus" aria-hidden="true"></i>').addClass('collapseButton').css('display', 'none').attr('title', 'Свернуть меню')
//        head.append(collapse)
//        collapse.fadeIn(200)
//        var expand = $('body > .expand')
//        if (expand.length == 0)
//            expand = $('<label>').addClass('expand').html('<i class="fa fa-bars" aria-hidden="true"></i>').hide().attr('title', 'Развернуть меню')
//        $('body').append(expand)
        var l, t, ll, tt
        var xmax
        var ymax
        var min_h
        var max_h
        var min_w
        var max_w

        if (header&HEADER.SCN){
    //        let cancel = $('<label>').addClass('cancel')
    //            .append($('<i class="fa fa-ban" aria-hidden="true"> Отменить</i>'))
            let cancel = foot.find('.cancel')
            let name = $('<input>').addClass('name').attr('placeholder', 'Имя группы')
    //        let save = $('<label>').addClass('save')
    //            .append($('<i class="fa fa-floppy-o" aria-hidden="true"> Сохранить</i>'))
            let save = foot.find('.save')
            let bstack = $('<i class="fa fa-undo" aria-hidden="true"></i>')
                .click(function(){
                    $(w).trigger('backStack')
                })
                .css({
                    position: 'absolute',
                    height: '100%',
                    width: '40px',
                    //display: 'flex',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    cursor: 'pointer',
                })
            head.append(name)
//            head.append(bstack)
    //        foot.children().hide()
    //        foot.append(cancel)
    //        foot.append(save)
    //        name.show(200)
    //        save.show(200)
            foot.slideDown(200)
            foot.children('.saveCancel').slideDown(200)
            cancel.off('click').on('click', function(){
                $(w).trigger('cancel')
            })
            save.off('click').on('click', function(){
                $(w).trigger('save')
            })
            name.off('change').on('change', function(){
                $(w).trigger('change_name', $(this).val())
            })
        }
        else{
            foot.children('.saveCancel').slideUp(200)
            if (view.footer == 0 || !!view.footer == false){
    //            foot.slideUp(200)
            }
    //        foot.children('.bottomButtons').slideUp(200)
    //        foot.children().slideDown(200)
            if (header&HEADER.BACK){
                let back = $('<label>').html('<i class="fa fa-chevron-left" aria-hidden="true"> <p>' + (w.backstack.length == 1 ? "Домой" : "Назад") + '</p></i>').addClass('back').css('display', 'none')
                let b = function(){
                    back.off('click', b)
                    w.doTransition({
                        from: view,
                        to: w.backstack.shift(),
                        transition: TRANSITION.SLIDELEFT,
                        native: true
                    })
                }

                back.off('click', b).on('click', b)
                head.append(back)
                back.fadeIn(200)
            }
            if (!!view.content.attr('title') == true){
                view.title = view.content.attr('title')
                $(NAVGRAPH).trigger('title_change')
                let title = $('<label>').addClass('title').addClass('static').attr('title', view.content.attr('title'))
                    .append($('<p>').text(view.content.attr('title'))).css('display', 'none')
                head.append(title)
                title.fadeIn(200)
            }
            if (header&HEADER.HOME){
                let home = $('<label>').addClass('home').html('<i class="fa fa-home" aria-hidden="true"></i>').css('display', 'none')
                home.click(function(){
                    while (w.backstack.length > 0)
                        w.backstack.shift()
                    let home = w.getViewById(w.start)
                    w.doTransition({
                        from: view,
                        to: home,
                        transition: TRANSITION.CLOSE
                    })
                })
                head.append(home)
                home.fadeIn(200)
            }
            if (header&HEADER.USER){
                let user = $('<label>').css('display', 'none').css('display', 'none').attr('title',$("#userdata").attr('fio'))
                user.append($('<img>')
                        .attr('src', '/static/images/avatar.jpg'))
                    .append($('<p>').text($("#userdata").attr('fio')))
                    .append($('<i class="fa fa-sign-out" aria-hidden="true"></i>').click(function(){ location.href = '/logout' }).attr('title', "Выйти из аккаунта"))
                    .addClass('static')
                    .prop('id', 'user')
                head.append(user)
                user.fadeIn(200)
            }
        }
    }
    wait(){
        this.host.children('.lock').fadeIn(50)
    }
    stopWaiting(){
        this.host.children('.lock').fadeOut(50)
    }
    setTitle(text){
        let w = this

        w.current.title = text
        let head = w.host.children('.head')
        let title = $('<label>').addClass('title').addClass('static').attr('title', text)
            .append($('<p>').text(text)).hide()
        title.fadeIn(200)
        head.append(title)
        $(NAVGRAPH).trigger('title_change')
    }
    getViewTitle(id){
        return this.getViewById(id).title
    }
    getTransitionById(id){
        let w = this
        for (let i in w.transitions){
            if (w.transitions[i].id == id)
                return w.transitions[i]
        }
        return null
    }
    getViewById(id){
        let w = this
        for (let i in w.views){
            if (w.views[i].id == id)
                return w.views[i]
        }
        return null
    }
    setHeader(header){
        this._initheader(this.current, header)
    }
}

NAVGRAPH = new Navgraph(
    {
        start: "Home",
//        start: "AreaTotal",
        host: null,
        views: [
            {
                id: "Home",
                content: "#HomeView",
//                header: HEADER.USER,
            },
            {
                id: "Company",
                content: '#CompanyView',
                header: HEADER.BACK
            },
            {
                id: 'AddContract',
                content: '#AddContract',
                header: HEADER.BACK,
                footer: FOOTER.ACCEPT|FOOTER.DECLINE
            },
            {
                id: "Player",
                content: '#Player',
                header: HEADER.BACK
            }
        ],
        transitions: [
            {
                id: 'watchCompany',
                from: 'Home',
                to: 'Company',
                transition: TRANSITION.SLIDERIGHT
            },
            {
                id: 'addContract',
                from: 'Home',
                to: 'AddContract',
                transition: TRANSITION.SLIDERIGHT
            }
        ],
        backstack: []
    }
)
