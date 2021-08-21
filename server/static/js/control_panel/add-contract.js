$(document).ready(_=>{


    $(NAVGRAPH).on('show', function(e, {content, id}){
        if (id == 'AddContract'){
            var formValue = {}
            content.children().remove()
            content.append(NewContractForm({onValueChange: val => {
                formValue = val
            }}))
            $(NAVGRAPH).off('decline').on('decline', _=>{
                NAVGRAPH.back()
            })
            $(NAVGRAPH).off('accept').on('accept', _ => {

                NAVGRAPH.wait()
                REPOSITORY.post_new_contract_form({
                    addresses: formValue.addresses,
                    OTS: formValue.count,
                    company_start: formValue.schedule&&formValue.schedule.start,
                    company_end: formValue.schedule&&formValue.schedule.end,
                    days_of_week: formValue.schedule&&formValue.schedule.days,
                    time_period_start: formValue.schedule&&formValue.schedule.time_start,
                    time_period_end: formValue.schedule&&formValue.schedule.time_end
                })
                    .then(
                        success => {
                            if (success)
                                NAVGRAPH.back()
                            else
                                alert(error)
                        },
                        alert
                    )
                    .finally(_=> NAVGRAPH.stopWaiting())

            })
        }
    })

})