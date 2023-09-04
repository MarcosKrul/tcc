import os
import sys
import re
from readAndFigsGenerate import run

server = sys.argv[1]
BASE_PATH = os.path.abspath(f"../server/tmp/{server}")

csv_files = [f for f in os.listdir(f"{BASE_PATH}") if f.endswith('.csv')]

for file in csv_files:
  worker_pid = re.search(r'memory_cpu_usage-worker_(\d+)', file).group(1)
  run(
    contentFileName=file,
    server=server,
    id=worker_pid
  )