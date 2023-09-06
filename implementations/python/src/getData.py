import pandas as pd

def getData(fileName):
  df = pd.read_csv(
    filepath_or_buffer=fileName,
    sep=";",
    names=["timestamp", "memory", "cpu"]
  )

  df["timestamp"] = pd.to_datetime(df["timestamp"])

  return df