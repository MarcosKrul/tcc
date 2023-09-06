import os
import sys
import re
from readAndFigsGenerate import run

server = sys.argv[1]
BASE_PATH = os.path.abspath(f"../server/tmp/{server}")

csv_files = [f for f in os.listdir(f"{BASE_PATH}") if f.endswith('.csv')]

for index, file in enumerate(csv_files):
  run(
    contentFileName=file,
    server=server,
    id=index
  )