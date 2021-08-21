
const CompanyList = ({onSelect, onAdd}) => {
    return $('<ul>').addClass('flat-list').append(
        Array.prototype.map.call(['com.1','com.2','com.3','com.4','com.5'], item => {
            let li = $('<li>').text(item)
            li.get(0).onclick = _=>{
                onSelect(item)
            }
            return li
        })
    ).append(_=>{
        let add = $('<li>').text('+')
        add.get(0).onclick = onAdd
        return add
    })
}


const CompanyInfo = ({company}) => {
    return $('<p>').text(company)
}