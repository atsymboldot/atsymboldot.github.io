# Runs under Python 2.7
# When run from within AndorsTrail/res/raw, this compiles all of the JSON data files into a single giant JSON file
# If OUTPUT_SCHEMA is set to true, it instead produces a JSON schema file showing the data fields and their respective types (deduced from the data)

import collections
import json
import os
import re

TARGET_DIRECTORY = '.'
OUTPUT_SCHEMA = True # true for schema.json, false for data.json

data = collections.defaultdict(list)
schema = {}

for filename in os.listdir(TARGET_DIRECTORY):
    if filename[-4:] != 'json':
        continue
    with open(filename) as f:
        contents = json.load(f)
        filetype = re.split('[_.]', filename)[0]
        for element in contents:
            data[filetype].append(element)

def generateJsonSchema(schema, obj):
    for k, v in obj.items():
        if type(v) is dict:
            if k not in schema:
                schema[k] = {}
            generateJsonSchema(schema[k], v)
        elif type(v) is list:
            if k not in schema:
                schema[k] = {}
            for vv in v:
                generateJsonSchema(schema[k], vv)
        else:
            if k not in schema:
                schema[k] = str(type(v))

if OUTPUT_SCHEMA:
    generateJsonSchema(schema, data)
    print(json.dumps(schema, sort_keys=True, indent=2))
else:
    print(json.dumps(data, sort_keys=True, indent=2))
