import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter

def generateFig(x_label, y_label, x, y, fileName, start_x, start_y, end_x, end_y):
  plt.figure(figsize=(10, 5))
  plt.plot(x, y)
  plt.gca().xaxis.set_major_formatter(DateFormatter("%H:%M"))
  plt.scatter(start_x, start_y, color='green', marker='o', label="Início das solicitações")
  plt.scatter(end_x, end_y, color='red', marker='o', label="Término das solicitações")
  plt.xlabel(x_label)
  plt.ylabel(y_label)
  plt.grid(True)
  plt.legend()
  plt.savefig(fileName)