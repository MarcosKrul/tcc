import os
from getData import getData
from generateFig import generateFig

def run(server, contentFileName, id=None):
  BASE_PATH = os.path.abspath(f"../server/tmp/{server}")

  df = getData(
    fileName=f"{BASE_PATH}/{contentFileName}"
  )

  generateFig(
    title="Gráfico Tempo X Consumo de RAM",
    x_label="Tempo",
    y_label="Memória (MB)",
    fileName=f"{BASE_PATH}/memory_usage{f'_{id}' if id is not None else ''}.png",
    x=df["timestamp"],
    y=df["memory"]
  )

  generateFig(
    title="Gráfico Tempo X Consumo de CPU",
    x_label="Tempo",
    y_label="CPU (%)",
    fileName=f"{BASE_PATH}/cpu_usage{f'_{id}' if id is not None else ''}.png",
    x=df["timestamp"],
    y=df["cpu"]
  )