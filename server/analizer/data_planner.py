import pandas as pd
import datetime


BOARD_DETAILS_PATH = '../../raw/player_details.csv'
FREE_SPACES_PATH = '../../raw/free_spaces.csv'
MAX_FREQ = 72


def get_hours_by_periods(data):
    # todo: учет дня недели
    base_date = datetime.date.fromisoformat(data['campany_start'])
    days = (datetime.date.fromisoformat(data['campany_end']) - base_date).days
    date_list = [base_date + datetime.timedelta(days=x) for x in range(days+1)]
    t1 = data['time_period_start']
    t2 = data['time_period_end']
    hours = [datetime.datetime(year=d.year, month=d.month, day=d.day, hour=t, minute=0)
             for t in range(t1, t2)
             for d in date_list]
    return hours


def get_board_timetable_data(board_id):
    # взять данные по билбордам (прогноз по OTS) и по времени
    return


def new_plan(data):
    boards = data['addresses']
    hours = get_hours_by_periods(data)
    for board in boards:
        board_data = get_board_timetable_data(board_id=board)

    return


def generate_timetable(month=True):
    boards = pd.read_csv(BOARD_DETAILS_PATH)
    now_date = datetime.datetime.now().date()
    if month:
        days = 30
    timetable = [{
        'player_id': board['PlayerId'],
        'date': now_date + datetime.timedelta(days=day),
        'hour': hour,
        'busy': 0,
        'total': 0
    } for day in range(days+1) for _, board in boards.iterrows() for hour in range(24)]
    pd.DataFrame(timetable).to_csv(FREE_SPACES_PATH)
    return 0


print(get_hours_by_periods({'campany_start': '2021-08-15', 'campany_end': '2021-08-21',
                            'time_period_start': 12, 'time_period_end': 17}))
generate_timetable()
