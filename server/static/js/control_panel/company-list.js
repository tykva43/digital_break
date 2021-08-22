$(NAVGRAPH).on("hide", (e, view) => {
    if (view.id == 'Company'){
        globalMap._markers.forEach(pl =>
            $(pl._element).show()
        )
    }
})
$(NAVGRAPH).on("preview", (e, view, {company: cp} = {}) => {
    if (view.id == 'Company'){
        if (cp)
            company = cp
    }
})
$(NAVGRAPH).on("show", async (e, view) => {
    if (view.id == 'Home'){
        console.log(view.content)
        view.content.children().remove()
        NAVGRAPH.wait()
        const companies = await REPOSITORY.get_company_list()
        console.log('c', companies)
        NAVGRAPH.stopWaiting()
        view.content.append($('<ul>').addClass('flat-list selectable').append(
            Array.prototype.map.call(companies, item => {
                let li = $('<li>').text(item.name)
                li.get(0).onclick = _=>{
                    NAVGRAPH.doTransition(
                        'watchCompany',
                        {company: item}
                    )
                }
                return li
            })
        ).append(_=>{
            let add = $('<li>').text('+')
                .click(_=>
                    NAVGRAPH.doTransition('addContract')
                )

            return add
        }))
        view.content.append($('<Button class="btn-primary">')
            .text('Скачать полный план')
            .css('margin', '16px 32px')
            .click(_ => window.open('/csv/'))
        )
    }
    if (view.id == 'Company'){

        view.content.children().remove()
        view.content.append(
            $('<button class="btn-primary">')
                .css('margin', '16px 32px')
                .text("Загрузить данные для рекламной кампании " + company.name)
                .click(_ => window.open('/csv/'))
        )
//        globalMap._markers.filter(x => company.addresses.indexOf(x._element.player.PlayerId) == -1).forEach(pl =>
//            $(pl._element).hide()
//        )
        NAVGRAPH.setTitle(company.name)
    }
})


const CompanyInfo = ({company}) => {
    return $('<p>').text(company)
}