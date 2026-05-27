#!/usr/bin/env python3

"""Lisp bracket checker for .meta files.

Independent of any project build tools. Validates that every file
has balanced brackets, ignoring content inside strings and
semicolon comments.

Usage:
    python3 check-brackets.py <file1.meta> [file2.meta ...]
    python3 check-brackets.py src/**/*.meta

Exit code: 1 if any file has unbalanced brackets.
"""

import os
import sys
from pathlib import Path


def strip_strings_and_comments(line: str) -> str:
    """Remove string contents and semicolon comments from a line,
    returning a mask where only structural brackets remain.

    We can't simply strip because that would shift column positions.
    Instead we replace non-structural chars with spaces so column
    numbers stay accurate.
    """
    result = []
    i = 0
    in_string = False
    escape = False
    prev = '\0'

    while i < len(line):
        c = line[i]

        if escape:
            escape = False
            if in_string:
                result.append(' ')
            else:
                result.append(c)
            i += 1
            prev = c
            continue

        if c == '\\' and in_string:
            escape = True
            result.append(' ')
            i += 1
            prev = c
            continue

        if c == '"':
            in_string = not in_string
            result.append(' ')  # the quote itself is structural but we mask it
            i += 1
            prev = c
            continue

        if in_string:
            result.append(' ')
        elif c == ';':
            # rest of line is comment
            result.extend([' '] * (len(line) - i))
            break
        elif c in '()':
            result.append(c)
        else:
            result.append(' ')

        prev = c
        i += 1

    return ''.join(result)


def check_file(filepath: str) -> bool:
    """Check a single file. Returns True if balanced."""
    try:
        with open(filepath, 'r') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f'{filepath}: FILE NOT FOUND', file=sys.stderr)
        return True  # not a bracket error
    except Exception as e:
        print(f'{filepath}: READ ERROR — {e}', file=sys.stderr)
        return True

    depth = 0
    last_open_line = None
    last_open_col = None

    for lineno, raw_line in enumerate(lines, start=1):
        masked = strip_strings_and_comments(raw_line)

        for col, c in enumerate(masked):
            if c == '(':
                depth += 1
                last_open_line = lineno
                last_open_col = col
            elif c == ')':
                depth -= 1
                if depth < 0:
                    # Negative depth: extra closing bracket
                    ruler = ' ' * col + '^'
                    print(f'{filepath}:{lineno}:{col + 1}  EXTRA ) — depth went negative (-1)')
                    print(f'  L{lineno}: {raw_line.rstrip()}')
                    print(f'         {ruler}')
                    return False

    if depth > 0:
        # Positive residual: unmatched open brackets
        print(f'{filepath}:{len(lines)}  UNMATCHED OPEN — {depth} open bracket(s) never closed')
        if last_open_line is not None:
            print(f'  Last opened: L{last_open_line}:{last_open_col + 1 if last_open_col is not None else "?"}')
            if last_open_line <= len(lines):
                print(f'  L{last_open_line}: {lines[last_open_line - 1].rstrip()}')
        return False

    open_count = sum(1 for line in lines for c in strip_strings_and_comments(line) if c == '(')
    close_count = sum(1 for line in lines for c in strip_strings_and_comments(line) if c == ')')
    print(f'{filepath}: OK ({open_count} open, {close_count} close, depth 0)')
    return True


def main() -> int:
    if len(sys.argv) < 2:
        print('Usage: python3 check-brackets.py <file1.meta> [file2.meta ...]', file=sys.stderr)
        print('       python3 check-brackets.py src/**/*.meta', file=sys.stderr)
        return 1

    all_ok = True
    for arg in sys.argv[1:]:
        p = Path(arg)
        # Direct paths (absolute or with wildcards like /dev/stdin)
        if p.exists() or os.path.isabs(arg):
            if not check_file(str(p)):
                all_ok = False
        else:
            paths = sorted(Path('.').glob(arg))
            if not paths:
                print(f'{arg}: NO FILES MATCHED', file=sys.stderr)
                all_ok = False
                continue
            for mp in paths:
                if not check_file(str(mp)):
                    all_ok = False

    return 0 if all_ok else 1


if __name__ == '__main__':
    sys.exit(main())
