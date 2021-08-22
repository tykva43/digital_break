const MakeRepositoty = _ => {

    const POST = ({url, data, returns = resp => resp}) => {
        let xhr = $.ajax({
            url,
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
        })
        let promise = Promise.resolve(xhr).then(data => { promise = null; return returns(data) }, error => { throw new Error(error.message + ' ' + url) });
        promise.abort = () => xhr.abort()
        let or_then = promise.then
        let or_finally = promise.finally
        promise.finally = function(_finally){
            let res = or_finally.call(this, _finally)
            return promise
        }
        promise.then = function(_then, _catch){
            let res = or_then.call(this, _then, _catch)
            return promise
        }
        return promise
    }

    const r = {}

    r.post_new_contract_form
        =   ({
            addresses,
            OTS,
            company_start,
            company_end,
            days_of_week,
            time_period_start,
            time_period_end
        }) =>
        POST({url: 'new_contract/', data: {addresses,
            OTS,
            company_start,
            company_end,
            days_of_week,
            time_period_start,
            time_period_end
        }, returns: resp => resp.success})

    r.get_company_list
    =   (_ = {}) =>
    POST({url: 'get_campany', data: {}, returns: resp => resp.list})

    return r

}

REPOSITORY = MakeRepositoty()
delete MakeRepositoty