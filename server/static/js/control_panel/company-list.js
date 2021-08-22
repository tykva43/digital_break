$(NAVGRAPH).on("hide", (e, view) => {

})
$(NAVGRAPH).on("preview", (e, view, {company: name} = {}) => {
    if (view.id == 'Company'){
        if (name)
            company = name
    }
})
$(NAVGRAPH).on("show", (e, view) => {
    if (view.id == 'Home'){
        console.log(view.content)
        view.content.children().remove()
        view.content.append($('<ul>').addClass('flat-list selectable').append(
            Array.prototype.map.call(['com.1','com.2','com.3','com.4','com.5'], item => {
                let li = $('<li>').text(item)
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
        view.content.append($('<Button>')
            .text('Скачать полный план')
            .css('margin', '16px 32px')
        )
    }
    if (view.id == 'Company'){
        view.content.children().remove()
        view.content.append($('<p>').text(company))
        NAVGRAPH.setTitle(company)
    }
})


const CompanyInfo = ({company}) => {
    return $('<p>').text(company)
}