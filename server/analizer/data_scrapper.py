import pandas as pd

file_path = '../../raw/crowd/player=40/'
filename_template = 'month={}-{}.{}'
filename = filename_template.format('2020', '11', 'parquet')

pd.read_parquet(path=file_path+filename, engine='pyarrow').\
    to_csv(file_path+filename_template.format('2020', '11', 'csv'))
