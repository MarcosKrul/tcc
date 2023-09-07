import os
import json
from getData import getData
from generateFig import generateFig
from datetime import timedelta

def run(server, contentFileName, id=None):
  BASE_PATH = os.path.abspath(f"../server/tmp/{server}")

  df = getData(
    fileName=f"{BASE_PATH}/{contentFileName}"
  )

  end = -1
  start = -1

  with open(f"{BASE_PATH}/requests.json", "r") as json_file:
    content = json.load(json_file)
    start = content['start'] - 1000
    end = content['end'] - 1000

  target_start = df['timestamp'][0] + timedelta(milliseconds=start)
  target_end = df['timestamp'][0] + timedelta(milliseconds=end)

  start_time = min(df['timestamp'], key=lambda x: abs((x - target_start).total_seconds()))
  end_time = min(df['timestamp'], key=lambda x: abs((x - target_end).total_seconds()))

  start_usage = df[df['timestamp'] == start_time]
  end_usage = df[df['timestamp'] == end_time]

  generateFig(
    x_label="Tempo",
    y_label="Memória (MB)",
    fileName=f"{BASE_PATH}/{server}_memory_usage{f'_{id}' if id is not None else ''}.png",
    x=df["timestamp"],
    y=df["memory"],
    start_x=start_time,
    start_y=start_usage["memory"],
    end_x=end_time,
    end_y=end_usage["memory"]
  )

  generateFig(
    x_label="Tempo",
    y_label="CPU (%)",
    fileName=f"{BASE_PATH}/{server}_cpu_usage{f'_{id}' if id is not None else ''}.png",
    x=df["timestamp"],
    y=df["cpu"],
    start_x=start_time,
    start_y=start_usage["cpu"],
    end_x=end_time,
    end_y=end_usage["cpu"]
  )