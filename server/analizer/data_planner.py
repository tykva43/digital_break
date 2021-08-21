import pandas as pd
import datetime

from data_scrapper import filter_df_in

PROGNOZ_PATH = '../../raw/aggregated_by_daytime.csv'
CONTRACTS_PATH = '../../raw/contracts.csv'
PLAN_OTS_PATH = '../../raw/plan_ots.csv'

BOARD_DETAILS_PATH = '../../raw/player_details.csv'
PLAN_FREQ_PATH = TIMETABLE_PATH = '../../raw/free_spaces.csv'
MAX_FREQ = 72
FREQS = [6, 9, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72]
PERIODS = {'morning': range(5, 11), 'day': range(11, 17), 'evening': range(17, 23), 'night': range(23, 5)}


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


def count_OTS(dates, hours, boards):
    ots = 0
    df = pd.read_csv(PROGNOZ_PATH)
    df = filter_df_in(df=df, filter_list=list(set([date.year for date in dates])), filter_field='year')
    df = filter_df_in(df=df, filter_list=list(set([date.month for date in dates])), filter_field='month')

    df = filter_df_in(df=df, filter_list=boards, filter_field='player')
    df = filter_df_in(df=df, filter_list=[date.weekday() for date in dates], filter_field='additional')
    df = filter_df_in(df=df, filter_list=hours, filter_field='hour')
    for index, row in df.iterrows():
        ots += row['total']
    return ots


def recount_freq(ots_old, ots_need):
    prev_ots = ots_old
    prev_freq = 72
    for fr in FREQS[-2:-len(FREQS)-1:-1]:
        new_ots = fr * ots_old / 72
        if new_ots > ots_need:
            prev_freq = fr
            prev_ots = new_ots
        else:
            return [prev_freq, prev_ots]


def check_if_freq_came_up(timetable, freq):
    for index, row in timetable.iterrows():
        if 72 - row['busy'] < freq:
            return False
    return True


def generate_ots_plan_file():
    boards = pd.read_csv(BOARD_DETAILS_PATH)
    now_date = datetime.datetime.now().date()
    days = 30
    plan = [{
        'player_id': board['PlayerId'],
        'date': now_date + datetime.timedelta(days=day),
        'ots': 0
    } for day in range(days + 1) for _, board in boards.iterrows()]
    pd.DataFrame(plan).to_csv(PLAN_OTS_PATH)
    return 0


def generate_freq_plan_file():
    boards = pd.read_csv(BOARD_DETAILS_PATH)
    now_date = datetime.datetime.now().date()
    days = 30
    plan = [{
        'player_id': board['PlayerId'],
        'date': now_date + datetime.timedelta(days=day),
        'hour': h,
        'freq': 0
    } for day in range(days + 1) for _, board in boards.iterrows() for h in range(24)]
    pd.DataFrame(plan).to_csv(PLAN_FREQ_PATH)
    return 0


def set_plan(id, freq, ots, dates, hours, boards):
    pd.DataFrame({'id_campaign': id, 'freq': freq}).to_csv(CONTRACTS_PATH, mode='a', header=False)
    df = pd.read_csv(PLAN_OTS_PATH)
    for date in dates:
        for board in boards:
            df.loc[(df.date == date and df.player_id == board), 'ots'] += ots
    df.to_csv(PLAN_FREQ_PATH)
    df = pd.read_csv(PLAN_FREQ_PATH)
    for date in dates:
        for board in boards:
            for hour in hours:
                df.loc[(df.date == date and df.player_id == board, df.hour == hour), 'freq'] += freq
    df.to_csv(PLAN_FREQ_PATH)




def new_plan(data):
    boards = data['addresses']
    dates, hours = get_hours_by_periods(data)
    # Filter timetable by boards, date, time
    timetable = get_boards_timetable_data(boards, dates, hours)
    if not check_free_spaces(df=timetable):
        return {'error_message': 'All selected hours are already taken by other advertising campaigns'}
    ots_sum = count_OTS(dates, hours, boards)
    if ots_sum < data['ots']:
        return {'error_message': 'The OTS value cannot be typed for the selected period of the advertising campaign'}
    else:
        [freq, ots_sum] = recount_freq(OTS_old=ots_sum, ots_need=data['ots'])
        # if check_if_freq_came_up(timetable=timetable, freq=freq):
        #     set_plan(id=data['id'], freq=freq, ots=ots_sum, dates=dates, hours=hours, boards=boards)
        # else:
        set_plan(id=data['id'], freq=freq, ots=ots_sum, dates=dates, hours=hours, boards=boards)
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


def generate_files():
    generate_timetable()
    generate_freq_plan_file()
    generate_ots_plan_file()


# generate_files()

print(get_hours_by_periods({'campany_start': '2021-08-21', 'campany_end': '2021-08-22', 'days_of_week': [6],
                            'time_period_start': 12, 'time_period_end': 13}))
