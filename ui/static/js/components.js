

const WeekPicker = ({}) => {
    let w = $('<div>').addClass('week-picker')
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const selectedDays = []

    days.forEach(day => {
        w.append($('<div>'))
    })



    return w
}