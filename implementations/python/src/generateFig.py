import matplotlib.pyplot as plt

def generateFig(title, x_label, y_label, x, y, fileName):
  plt.figure(figsize=(10, 5))
  plt.plot(x, y)
  plt.xlabel(x_label)
  plt.ylabel(y_label)
  plt.title(title)
  plt.grid(True)
  plt.savefig(fileName)