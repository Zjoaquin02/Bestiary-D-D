import os
import json
import re

data_dir = 'data'
img_dir = 'css/img'

referenced_images = set()

# Regex to find image paths in JSON files
img_pattern = re.compile(r'"imagen":\s*"css/img/([^"]+)"')

for filename in os.listdir(data_dir):
    if filename.endswith('.json'):
        with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
            content = f.read()
            matches = img_pattern.findall(content)
            for m in matches:
                referenced_images.add(m)

actual_images = set(os.listdir(img_dir))

# Check case-insensitively and also keep track of exact missing
missing = []
for ref in sorted(list(referenced_images)):
    if ref not in actual_images:
        missing.append(ref)

print(" ".join(missing))
