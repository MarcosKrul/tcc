import sys
from readAndFigsGenerate import run

run(
  server=sys.argv[1],
  contentFileName="memory_cpu_usage.csv"
)