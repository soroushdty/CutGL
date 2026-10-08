# File formats

What CutGL reads and writes. The desktop formats were worked out from projects
written by GEM Cutter III; the fixtures in `tests/fixtures/desktop/` are small examples of
each, made with the JDK's own classes by `scripts/java/MakeFixture.java`.

## A project folder

```
myproject/
  myproject.xml                     the GEM III document (written on every save)
  guideline.pdf                     the guideline: .pdf, .rtf, .html, .htm or plain text
  resources/
    project.properties              ProjectSourceFile=guideline.pdf
    GEMCutterTreeModel.xml          the element tree
    linkbean                        passage links (desktop only; may be absent)
    cutgl.json                      passage links (this page only)
  Report.html, *_Report.html        reports the desktop application saved; ignored here
```

The page opens such a folder, a zip of one, or a folder dropped on the window. The project
name is the folder's name. If `resources/GEMCutterTreeModel.xml` is missing, the page looks
for a GEM XML file in the folder instead (a GEM Cutter II project keeps its links in
`projects/linkbean`, which is read too).

Saving writes the same layout as a zip, without `linkbean`. The desktop application opens
a project without that file; it simply shows no highlights.

## GEMCutterTreeModel.xml

The Swing tree, written by `java.beans.XMLEncoder`:

```xml
<java version="…" class="java.beans.XMLDecoder">
 <object class="javax.swing.tree.DefaultTreeModel">
  <object class="javax.swing.tree.DefaultMutableTreeNode">
   <void property="userObject">
    <object class="gemc.UserObjectBean">
     <void property="attributeCodeSetProperty"><string>SNOMED-CT</string></void>
     <void property="attributeIDProperty"><string>1</string></void>
     <void property="attributeSourceProperty"><string>explicit</string></void>
     <void property="elementProperty"><string>&lt;GuidelineTitle&gt; The title </string></void>
    </object>
   </void>
   <void method="add"> … a child node, the same shape … </void>
  </object>
 </object>
</java>
```

- `elementProperty` holds the element name and its text in one string: `<Name> text `.
  The name is what is between the first `<` and `>`; the text is the rest, trimmed.
- `attributeSourceProperty` is `explicit`, `inferred` or `nd`.
- `attributeCodeSetProperty` is present only once a code set has been chosen.
- This file, not the `.xml` beside it, is what the desktop application loads.

## linkbean

A Java-serialised `ArrayList` (older projects: a `Hashtable`) of `gemc.LinkBean`:

| Field | Meaning |
|---|---|
| `start`, `end` | Character offsets of the passage in the desktop text pane |
| `index` | The element's position among its siblings |
| `treepath` | A `TreePath` to the element: a snapshot of the tree nodes when the link was made |

`src/javaser.js` reads the object stream (class descriptors, back-references, objects with
their own `writeObject` data) and returns each link's offsets, the path of child indexes to
its element, and the element's label at the time.

Placing a link:

- **Plain text and RTF.** The page builds the same text the desktop pane held (CRLF read as
  one line break; RTF paragraphs ending in a line break), so the offsets apply directly.
- **HTML.** The desktop's HTML document counts characters differently from a browser, so
  the page looks for the element's text near the stored offset and links that.
- **PDF.** The desktop application took PDF text through the clipboard and stored offsets
  of `0`. There is nothing to restore; use *Link element text to passages*.

## The GEM III document

Written exactly as the desktop application writes it:

```xml
<?xml version="1.0" encoding="UTF-8"?><GuidelineDocument xmlns="http://gem.yale.edu" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://gem.yale.edu gemschemaiii.xsd">
<Identity id="1" source="nd">
<GuidelineTitle id="1" source="explicit">The title</GuidelineTitle>
…
</Identity>
</GuidelineDocument>
```

- One element per line, no indentation. An element with text and children has its first
  child on the same line as the text.
- Attributes in the order `codeset`, `id`, `source`. `codeset` appears only on elements
  whose name ends in `Code`, and only once a code set has been chosen.
- Text is trimmed. Empty elements are written `<Name id="1" source="nd"/>`.
- Every element starts with `id="1"`. A copy made with *Subtree* takes the next number for
  its element name. (The schema types `id` as `xs:ID`; the desktop application's output
  does not satisfy that, and this page writes what the desktop application writes.)

Reading a GEM XML file: element names and nesting become the tree; an element's own text
is its text; `source`, `id` and `codeset` are kept; anything else is ignored. A file with
none of the elements GEM III added is offered the GEM II ⇒ GEM III step.

## cutgl.json

```json
{ "format": 1, "name": "myproject", "saved": "2026-10-07T00:00:00.000Z", "zoom": 1,
  "links": [ { "path": [0, 0], "name": "GuidelineTitle", "page": 0, "start": 12, "end": 53, "quote": "…" } ] }
```

- `path` is the element's position: child indexes from the root. `name` guards against a
  tree changed elsewhere; a link whose element no longer matches is dropped.
- `page` is the PDF page (from 0), or `null` for text, HTML, RTF and Word guidelines.
- `start` and `end` count characters in the page's text (PDF) or the document's text.
- `quote` is the linked text. If the offsets no longer cover those words, the page finds
  the words again and moves the link.

## Logic statements

The text of a `<Logic>` element, as the logic window writes it:

```
If 
<the If pane>
Then 
<the Then pane>
```

`AND` and `OR` go on lines of their own. For an Imperative the If pane is empty.
