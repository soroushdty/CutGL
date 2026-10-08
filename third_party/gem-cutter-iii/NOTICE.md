# GEM Cutter III schema and report stylesheets

These files are from the GEM Cutter III distribution (Yale Center for Medical Informatics,
2012). They are here unchanged, so that the page can build the GEM III element tree, show
each element's definition, and produce the six reports exactly as the desktop application
does.

| File | What it is | Where it was in the distribution |
|---|---|---|
| `gemschemaiii.xsd` | The GEM III schema | `gemschemaiii.xsd`, also `props/gemschemaiii.xsd` inside `GemCutter.jar` |
| `xsl/recs.xsl` | Recommendations report | `xsl/` inside `GemCutter.jar` |
| `xsl/detailed.xsl` | Detailed report | same |
| `xsl/rules.xsl` | Rules report | same |
| `xsl/dvs.xsl` | Decision Variables report | same |
| `xsl/action.xsl` | Actions report | same |
| `xsl/gem-cogs.xsl` | GEM-COGS report | same |

They are **not** covered by this repository's MIT license. Copyright stays with their
authors; `detailed.xsl` carries the line "Copyright 2006 Yale Center for Medical
Informatics".

`src/resources.js` is a generated copy of these files as one script
(`python3 scripts/build_resources.py`). The page changes two things at run time, without
touching the files: the Detailed report's date, which the stylesheet asked a Yale server
for and the page now supplies, and the `version="2.0"` that two stylesheets declare
although they use XSLT 1.0 only.

Nothing else from GEM Cutter III is in this repository: no Java code, no other libraries.
