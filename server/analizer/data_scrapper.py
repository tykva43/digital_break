import calendar
import datetime

import pandas as pd

player_file_path = '../../raw/crowd/player=40/'
crowd_file_path = '../../raw/crowd/player=40/'
crowd_filename_template = 'month={}-{}.{}'
player_filename_template = 'month={}-{}_player.{}'
param = {'month': '11', 'year': '2020', 'in_format': 'parquet', 'out_format': 'csv'}

# filename = filename_template.format('2020', '11', 'parquet')
pd.set_option('display.max_columns', None)


def aggregate_by_month(raw_df):
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
        date = datetime.date(year=year, month=month, day=day)
        if date.weekday() + 1 == weekday:
            weekday_dates.append(date)
    return [len(weekday_dates), weekday_dates]


def filter_df_in(df, filter_field, filter_list):
    new_df = pd.DataFrame()
    for filter_value in filter_list:
        temp = df[df[filter_field] == str(filter_value)]
        new_df = pd.concat([new_df, temp], ignore_index=True)
    return new_df


def aggregate_by_weekday(raw_df):
    date = raw_df['AddedOnDate'].iloc[0].to_pydatetime().date()
    l_by_month = []
    for weekday in range(1, 8):
        [_, dates] = get_all_weekdays_dates(month=date.month, year=date.year, weekday=weekday)
        filtered_df = filter_df_in(df=raw_df, filter_field='AddedOnDate', filter_list=dates)
        l_by_month.append({'type': 'week_day',
                           'param': 'by_month',
                           'month': date.month,
                           'year': date.year,
                           'additional': weekday,
                           'total': filtered_df.Mac.count() / len(filtered_df.AddedOnDate.unique())})

    return l_by_month


raw_df = pd.read_parquet(path=crowd_file_path + crowd_filename_template.format(
    param['year'], param['month'], param['in_format']), engine='pyarrow')

aggregated_data = aggregate_by_weekday(raw_df) + aggregate_by_month(raw_df)
print('ready')
pd.DataFrame(aggregated_data).to_csv(player_file_path + 'aggr.csv')
