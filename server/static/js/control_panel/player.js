$(document).ready(_=>{

    var player

    $(NAVGRAPH).on('hide', (_, {id}) => {
        if (id == 'Player'){
            globalMap._markers.forEach(function(item){
                let view = item._element
                if ($(view).hasClass('selected'))
                    $(view).toggleClass('selected')
            })
        }
    })

    $(NAVGRAPH).on('preview', (_, {content, id}, {player: pl, map: m} = {}) => {
        if (id == "Player"){
            player = pl
            map = m
        }
    })

    $(NAVGRAPH).on('show', function(e, {content, id}){
        if (id == 'Player'){
            NAVGRAPH.setTitle(player.PlayerNumber)
            let marker = globalMap._markers.find(x => x._element.player.PlayerId == player.PlayerId)
            $(marker._element).addClass('selected')
            content.children().remove()
            content.append($('<button class="btn-primary">')
                .css('margin', '16px 32px')
                .text('Загрузить данные для банера ' + player.PlayerNumber)
                .click(_ => window.open('/csv/))
            )
        }
    })

})