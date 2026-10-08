# Sample projects

Three small projects the page offers under **Project → Open → Sample projects**. Each is
also here as a project folder in the desktop application's layout, to try
**Choose project folder** on, or to unzip next to `GemCutter.jar`.

The guidelines are **invented for the demonstration and are not clinical guidance**. They
were written for this repository; none of the text or markup comes from a real guideline
or from anyone's research project.

| Folder | Guideline | What it shows |
|---|---|---|
| `sample_hand_hygiene/` | `hand_hygiene.txt`, plain text | One imperative and one conditional recommendation with a logic statement; passages used by two elements (yellow) |
| `sample_inhaler_review/` | `inhaler_review.html`, HTML with a list and a table | Three recommendations, inclusion and exclusion criteria, two definitions |
| `sample_blood_pressure/` | `blood_pressure.pdf`, two pages | Text taken from a PDF, links on both pages, a conditional with its logic |

Each folder holds what the desktop application writes, plus one file of our own:

```
sample_x/
  sample_x.xml                      the GEM III document
  <guideline file>
  resources/GEMCutterTreeModel.xml  the element tree (Java XMLEncoder format)
  resources/project.properties      names the guideline file
  resources/cutgl.json              passage links (the desktop application ignores it)
```

The formats are described in [docs/formats.md](../docs/formats.md).

## Regenerating

The samples are defined in [`src/samples.js`](../src/samples.js): the guideline text and
the steps that fill in the tree. These folders are written from them and are checked by
the tests, so change the sample there and then run:

```bash
python3 scripts/make_sample_pdf.py   # only if the PDF sample's text changed (needs reportlab)
node scripts/make_demo.js
python3 scripts/make_report_refs.py  # reference text for the report tests (needs lxml)
```

The PDF embeds DejaVu Sans, which may be embedded and redistributed freely.
