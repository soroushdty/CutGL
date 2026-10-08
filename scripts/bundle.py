"""Packs index.html and src/ into one self-contained file.

Not needed to run or host the page: index.html works as it is. The single file is for places
that take one HTML file, such as a Claude artifact or an email attachment.

    python3 scripts/bundle.py        -> dist/cutgl.html  (a full page)
                                        dist/cutgl.fragment.html  (no <html>/<head>/<body>, for hosts that add their own)
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(*parts):
    with open(os.path.join(ROOT, *parts), encoding='utf-8') as f:
        return f.read()


page = read('index.html')
title = re.search(r'<title>.*?</title>', page, re.S).group(0)
fonts = re.search(r'<link rel="stylesheet" href="https://fonts[^>]+>', page).group(0)
body = re.search(r'<body>(.*)</body>', page, re.S).group(1)
scripts = re.findall(r'<script src="(src/[^"]+)"></script>', body)
body = re.sub(r'<script src="src/[^"]+"></script>\n?', '', body).strip('\n')
code = '\n'.join(read(*s.split('/')) for s in scripts)
assert '</script' not in code.lower(), 'a script would end the inline block early'
inner = '%s\n%s\n<style>\n%s</style>\n%s\n<script>\n%s\n</script>\n' % (title, fonts, read('src', 'styles.css'), body, code)

os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
with open(os.path.join(ROOT, 'dist', 'cutgl.fragment.html'), 'w', encoding='utf-8') as f:
    f.write(inner)
with open(os.path.join(ROOT, 'dist', 'cutgl.html'), 'w', encoding='utf-8') as f:
    f.write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '</head>\n<body>\n' + inner + '</body>\n</html>\n')
print('wrote dist/cutgl.html and dist/cutgl.fragment.html (%d KB)' % (len(inner) // 1024))
