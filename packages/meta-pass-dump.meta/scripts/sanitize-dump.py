import sys
import os
import re

script_dir = os.path.dirname(os.path.realpath(sys.argv[0]))
pkg_dir = os.path.dirname(script_dir)

def replace(m):
    path = m.group(1)
    rel = os.path.relpath(path, pkg_dir)
    return f'"{rel}"'

for filepath in sys.argv[1:]:
    with open(filepath, 'r') as f:
        content = f.read()
    content = re.sub(r'"(/[^"]*)"', replace, content)
    with open(filepath, 'w') as f:
        f.write(content)
