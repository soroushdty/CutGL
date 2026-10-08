"""Writes the reference text of every report for every demo project, using libxslt (through lxml).

The tests compare what the page produces, with the browser's own XSLT and with the bundled
replacement, against these files. Run after changing a sample:

    python3 scripts/make_report_refs.py        (needs: pip install lxml)
"""
import os, re
from lxml import etree

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XSL = os.path.join(ROOT, 'third_party', 'gem-cutter-iii', 'xsl')
OUT = os.path.join(ROOT, 'tests', 'fixtures', 'reports')
os.makedirs(OUT, exist_ok=True)

for name in sorted(os.listdir(os.path.join(ROOT, 'demo'))):
    xml_path = os.path.join(ROOT, 'demo', name, name + '.xml')
    if not os.path.exists(xml_path):
        continue
    xml = etree.parse(xml_path)
    for report in ['recs', 'detailed', 'rules', 'dvs', 'action', 'gem-cogs']:
        src = open(os.path.join(XSL, report + '.xsl'), encoding='utf-8').read()
        # the stylesheet asks a server that no longer exists for the date; the page supplies it instead
        src = src.replace("select=\"document('http://gem.med.yale.edu/date.php')/timestamp\"", "select=\"'DATE'\"")
        transform = etree.XSLT(etree.fromstring(src.encode('utf-8')), access_control=etree.XSLTAccessControl.DENY_ALL)
        html = etree.tostring(transform(xml), method='html', encoding='unicode')
        doc = etree.fromstring(html, etree.HTMLParser())
        for el in doc.xpath('//style|//script|//title'):
            el.getparent().remove(el)
        text = re.sub(r'\s+', '', ''.join(doc.itertext()))
        with open(os.path.join(OUT, name + '.' + report + '.txt'), 'w', encoding='utf-8') as f:
            f.write(text)
        print(name, report, len(text))
