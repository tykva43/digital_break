import pandas as pd
import datetime

from data_scrapper import filter_df_in


BOARD_DETAILS_PATH = '../../raw/player_details.csv'
TIMETABLE_PATH = '../../raw/free_spaces.csv'
MAX_FREQ = 72
FREQS = [6, 9, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72]


def get_hours_by_periods(data):
    base_date = datetime.date.fromisoformat(data['campany_start'])
    days = (datetime.date.fromisoformat(data['campany_end']) - base_date).days
    date_list = [base_date + datetime.timedelta(days=x) for x in range(days+1)]
    t1 = data['time_period_start']
    t2 = data['time_period_end']
    dates = [datetime.date(year=d.year, month=d.month, day=d.day)
             for d in date_list
             if d.weekday()+1 in data['days_of_week']]
    hours = [t for t in range(t1, t2)]
    return dates, hours


def get_boards_timetable_data(boards, dates, hours):
    timetable = pd.read_csv(TIMETABLE_PATH)
    filtered_timetable = filter_df_in(df=timetable, filter_field='player_id', filter_list=boards)
    filtered_timetable = filter_df_in(df=filtered_timetable, filter_field='date', filter_list=dates)
    return filter_df_in(df=filtered_timetable, filter_field='hour', filter_list=hours)


def check_free_spaces(df):
    free = 0
    for row in df.itterrows():
        if row['busy'] < 72:
            free += 1
    return free


def count_OTS(dates, hours, boards, timetable):
    return


def recount_freq(OTS_old, timetable, dates, hours, boards, freq):
    ...


def check_if_freq_came_up(board_id, ):
    ...


def set_plan(id, req):
    ...


def new_plan(data):
    boards = data['addresses']
    dates, hours = get_hours_by_periods(data)
    # Filter timetable by boards, date, time
    timetable = generate_timetable(boards, dates, hours)
    if not check_free_spaces(df=timetable):
        return {'error_message': 'All selected hours are already taken by other advertising campaigns'}
    OTS_sum = count_OTS(dates, hours, boards, timetable)
    if OTS_sum < data['OTS']:
        return {'error_message': 'The OTS value cannot be typed for the selected period of the advertising campaign'}
    elif OTS_sum:
        [freq, OTS_sum] = recount_freq(OTS_old=OTS_sum, timetable=timetable, dates=dates,
                                       hours=hours, boards=boards, freq=72)
        if check_if_freq_came_up(board_id=...):
            set_plan(data['id'], freq)
        else:
            ...
    # for board in boards:
    #     board_data = get_board_timetable_data(board_id=board)
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
        'busy': 0
    } for day in range(days+1) for _, board in boards.iterrows() for hour in range(24)]
    pd.DataFrame(timetable).to_csv(TIMETABLE_PATH)
    return 0


print(get_hours_by_periods({'campany_start': '2021-08-21', 'campany_end': '2021-08-22', 'days_of_week': [6],
                            'time_period_start': 12, 'time_period_end': 13}))
# generate_timetable()
