import calendar
import datetime as dt
import os

import pandas as pd

player_file_path = '../../raw/player_log/'
dir_template = 'player={}'
path_to_save = '../../raw/aggregated_by_daytime.csv'
crowd_file_path = '../../raw/crowd/'
filename_template = 'month={}-{}.{}'
player_filename_template = 'month={}-{}_player.{}'
ENGINE = 'fastparquet'
pd.set_option('display.max_columns', None)
PERIODS = {'morning': range(5, 11), 'day': range(11, 17), 'evening': range(17, 23), 'night': range(23, 5)}


def aggregate_by_month(raw_df, player):
    date = raw_df['AddedOnDate'].iloc[0].to_pydatetime().date()
    return [{'type': 'by_month',
             'param': None,
             'additional': None,
             'month': date.month,
             'year': date.year,
             'total': raw_df.Mac.count() / len(raw_df.AddedOnDate.unique())}]


def get_all_weekdays_dates(month, year, weekday):
    weekday_dates = []
    days_in_month = calendar.monthrange(year, month)[1]
    for day in range(1, days_in_month + 1):
        date = dt.date(year=year, month=month, day=day)
        if date.weekday() + 1 == weekday:
            weekday_dates.append(date)
    return [len(weekday_dates), weekday_dates]


def filter_df_in(df, filter_field, filter_list):
    new_df = pd.DataFrame()
    for filter_value in filter_list:
        temp = df[df[filter_field] == str(filter_value)]
        new_df = pd.concat([new_df, temp], ignore_index=True)
    return new_df


def filter_by_timestamp(df):
    idxs = []
    for index, row in df.iterrows():
        time = dt.datetime.fromtimestamp(int(row['AddedOnTick']) / 1000).time()
        seconds = dt.timedelta(minutes=time.minute, seconds=time.second).seconds
        t = int(seconds // 55)
        if (55 * t <= seconds) and (seconds <= 55 * t + 5):
            idxs.append(index)
    return df.iloc[idxs]


def aggregate_by_weekday(path, player, i):
    raw_df = pd.read_parquet(path, engine=ENGINE)
    date = raw_df['AddedOnDate'].iloc[0].to_pydatetime().date()
    l_by_month = []
    for weekday in range(1, 8):
        [_, dates] = get_all_weekdays_dates(month=date.month, year=date.year, weekday=weekday)
        filtered_df = filter_df_in(df=raw_df, filter_field='AddedOnDate', filter_list=dates)
        filtered_df = filter_by_timestamp(filtered_df)
        l_by_month.append({'player': player,
                           'type': 'week_day',
                           'param': 'by_month',
                           'month': date.month,
                           'year': date.year,
                           'additional': weekday,
                           'total': filtered_df.Mac.count() / len(filtered_df.AddedOnDate.unique())})
    if i > 0:
        pd.DataFrame(l_by_month).to_csv(path_to_save, mode='a', header=False)
    else:
        pd.DataFrame(l_by_month).to_csv(path_to_save, header=True)
    i = 1
    # l_by_month.clear()
    return i


def aggregate_by_daytime(path, player, i):
    raw_df = pd.read_parquet(path, engine=ENGINE)
    date = raw_df['AddedOnDate'].iloc[0].to_pydatetime().date()
    l_by_week = []
    for weekday in range(1, 8):
        [_, dates] = get_all_weekdays_dates(month=date.month, year=date.year, weekday=weekday)
        filtered_df = filter_df_in(df=raw_df, filter_field='AddedOnDate', filter_list=dates)
        # df = filter_by_timestamp(df)
        for h in range(24):
            filtered_df['time'] = pd.to_datetime(filtered_df['AddedOnTick'], unit='ms')
            filtered_df['hour'] = filtered_df['time'].dt.hour
            filtered_df1 = filter_df_in(df=filtered_df, filter_field='hour', filter_list=[h])
            # filtered_df1 = filtered_df[filtered_df['hour'] == h]
            # filtered_df[datetime.datetime.fromtimestamp(int(filtered_df['AddedOnTick'])/1000).hour == h]
            l_by_week.append({'player': player,
                              'type': 'daytime',
                              'param': 'by_week',
                              'month': date.month,
                              'year': date.year,
                              'hour': h,
                              'total': filtered_df1.Mac.count()})
    if i > 0:
        pd.DataFrame(l_by_week).to_csv(path_to_save, mode='a', header=False)
    else:
        pd.DataFrame(l_by_week).to_csv(path_to_save, header=True)
    i = 1
    # l_by_month.clear()
    return i


def get_all_files_in_dirs(path):
    file_list = []
    for root, dirs, files in os.walk(path):
        for dir in dirs:
            for root, dirs, files in os.walk(os.path.join(path, dir)):
                file_list.append({'dir': dir, 'files': files})
    return file_list


def get_players(path):
    file_list = []
    for root, dirs, files in os.walk(path):
        for dir in dirs:
            for root, dirs, files in os.walk(os.path.join(path, dir)):
                file_list.append({'dir': dir, 'files': files})
    return file_list


def get_player_id_by_dir_name(dir_name):
    return int(dir_name.split('=', 1)[1].lstrip())


def aggregate_crowd():
    dirs = get_all_files_in_dirs(crowd_file_path)
    pd.DataFrame()
    i = 0
    for dir in dirs:
        player_id = get_player_id_by_dir_name(dir['dir'])
        print('started ', player_id)
        for file in dir['files']:
            i = aggregate_by_daytime(path=os.path.join(crowd_file_path, dir['dir'], file), player=player_id, i=i)
            # i = aggregate_by_weekday(path=os.path.join(crowd_file_path, dir['dir'], file), player=player_id, i=i)


# print(get_all_files_in_dirs(crowd_file_path))
aggregate_crowd()
# print('ready_crowd')
