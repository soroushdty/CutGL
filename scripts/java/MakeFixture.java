import java.beans.XMLEncoder; import java.io.*; import java.nio.charset.StandardCharsets; import java.nio.file.*; import java.util.*;
import javax.swing.text.*; import javax.swing.text.html.*; import javax.swing.text.rtf.RTFEditorKit; import javax.swing.tree.*;
// Builds the small desktop-format projects in tests/fixtures/desktop/ (tree model, linkbean, properties). The link
// offsets come from the same Swing document classes the desktop app reads guidelines with, so the tests can check
// where the page places a desktop project's links. The guideline text is invented.
//
//   cd scripts/java && javac -d out gemc/*.java MakeFixture.java
//   java -Djava.awt.headless=true -cp out MakeFixture ../../tests/fixtures/desktop
public class MakeFixture {
    static DefaultMutableTreeNode node(String label, String src) {
        gemc.UserObjectBean u = new gemc.UserObjectBean(); u.setElementProperty(label); u.setAttributeIDProperty("1"); u.setAttributeSourceProperty(src);
        return new DefaultMutableTreeNode(u);
    }
    static void build(String dir, String file, Document doc, String[][] picks) throws Exception {
        String text = doc.getText(0, doc.getLength());
        Files.write(Paths.get(dir, "swing-text.txt"), text.getBytes(StandardCharsets.UTF_8));
        DefaultMutableTreeNode root = node("<GuidelineDocument>  ", "nd");
        DefaultMutableTreeNode identity = node("<Identity> ", "nd"), kc = node("<KnowledgeComponents> ", "nd");
        root.add(identity); root.add(kc);
        DefaultTreeModel model = new DefaultTreeModel(root);
        ArrayList<gemc.LinkBean> links = new ArrayList<>();
        StringBuilder exp = new StringBuilder("[");
        for (String[] p : picks) {
            int s = text.indexOf(p[1]); if (s < 0) throw new RuntimeException("phrase not in Swing text: " + p[1] + "\n---\n" + text);
            int e = s + p[1].length();
            String content = p[1].replaceAll("-\\r\\n", "").replaceAll("\\r\\n", " ");
            DefaultMutableTreeNode n = node("<" + p[0] + "> " + content + " ", "explicit");
            DefaultMutableTreeNode parent = p[0].equals("Recommendation") ? kc : identity;
            parent.add(n);
            links.add(new gemc.LinkBean(s, e, new TreePath(n.getPath()), parent.getIndex(n)));
            exp.append(exp.length() > 1 ? "," : "").append("{\"name\":\"" + p[0] + "\",\"start\":" + s + ",\"end\":" + e + "}");
        }
        exp.append("]");
        new File(dir, "resources").mkdirs();
        XMLEncoder enc = new XMLEncoder(new BufferedOutputStream(new FileOutputStream(new File(dir, "resources/GEMCutterTreeModel.xml")))); enc.writeObject(model); enc.close();
        ObjectOutputStream oo = new ObjectOutputStream(new FileOutputStream(new File(dir, "resources/linkbean"))); oo.writeObject(links); oo.close();
        Properties pr = new Properties(); pr.setProperty("ProjectSourceFile", file); pr.store(new FileOutputStream(new File(dir, "resources/project.properties")), "");
        Files.write(Paths.get(dir, "expected.json"), exp.toString().getBytes(StandardCharsets.UTF_8));
        System.out.println(dir + ": swing text length " + text.length() + ", links " + links.size());
    }
    public static void main(String[] a) throws Exception {
        String base = a[0];
        // --- plain text, CRLF line endings
        String txt = "Asthma Care in Adults\r\nIssued 2026 by the Example Respiratory Group\r\n\r\nRecommendation 1\r\nAdults with persistent asthma should be offered an inhaled cortico-\r\nsteroid as first-line controller therapy.\r\n\r\nRecommendation 2\r\nReview inhaler technique at every visit.\r\n";
        new File(base, "txtproj").mkdirs();
        Files.write(Paths.get(base, "txtproj", "guide.txt"), txt.getBytes(StandardCharsets.UTF_8));
        StyledEditorKit sk = new StyledEditorKit(); Document d1 = sk.createDefaultDocument(); d1.putProperty("__EndOfLine__", "\r");
        try (FileReader r = new FileReader(new File(base, "txtproj/guide.txt"))) { sk.read(r, d1, 0); }
        build(base + "/txtproj", "guide.txt", d1, new String[][] { {"GuidelineTitle", "Asthma Care in Adults"}, {"Recommendation", "Adults with persistent asthma should be offered an inhaled cortico-\nsteroid as first-line controller therapy."}, {"Recommendation", "Review inhaler technique at every visit."} });
        // --- RTF
        String rtf = "{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\fswiss Helvetica;}}{\\colortbl;\\red0\\green0\\blue0;}\r\n{\\info{\\title ignored title}}\\pard\\f0\\fs28\\b Asthma Care in Adults\\b0\\par\r\n\\fs22 Issued 2026 by the Example Respiratory Group\\par\\par\r\n{\\b Recommendation 1}\\par\r\nAdults with persistent asthma should be offered an inhaled corticosteroid as first\\_line controller therapy \\u8212?caf\\'e9 style\\u8212?.\\par\r\n{\\i Recommendation 2}\\par\r\nReview inhaler technique at every visit; don\\rquote t skip it.\\par\r\n}";
        new File(base, "rtfproj").mkdirs();
        Files.write(Paths.get(base, "rtfproj", "guide.rtf"), rtf.getBytes(StandardCharsets.ISO_8859_1));
        RTFEditorKit rk = new RTFEditorKit(); Document d2 = rk.createDefaultDocument();
        try (FileReader r = new FileReader(new File(base, "rtfproj/guide.rtf"))) { rk.read(r, d2, 0); }
        build(base + "/rtfproj", "guide.rtf", d2, new String[][] { {"GuidelineTitle", "Asthma Care in Adults"}, {"Recommendation", "Adults with persistent asthma should be offered an inhaled corticosteroid"}, {"Recommendation", "Review inhaler technique at every visit"} });
        // --- HTML
        String html = "<html><head><title>Asthma</title><style>p{color:red}</style></head><body>\n<h1>Asthma Care in Adults</h1>\n<p>Issued 2026 by the <b>Example Respiratory Group</b></p>\n<h2>Recommendation 1</h2>\n<p>Adults with persistent asthma should be offered an inhaled\n corticosteroid as first-line controller therapy.</p>\n<ul><li>Review inhaler technique at every visit.</li><li>Check adherence.</li></ul>\n<table><tr><td>Step</td><td>Controller</td></tr></table>\n</body></html>";
        new File(base, "htmlproj").mkdirs();
        Files.write(Paths.get(base, "htmlproj", "guide.html"), html.getBytes(StandardCharsets.UTF_8));
        HTMLEditorKit hk = new HTMLEditorKit(); HTMLDocument d3 = (HTMLDocument) hk.createDefaultDocument(); d3.putProperty("IgnoreCharsetDirective", Boolean.TRUE);
        try (FileReader r = new FileReader(new File(base, "htmlproj/guide.html"))) { hk.read(r, d3, 0); }
        build(base + "/htmlproj", "guide.html", d3, new String[][] { {"GuidelineTitle", "Asthma Care in Adults"}, {"Recommendation", "Adults with persistent asthma should be offered an inhaled corticosteroid as first-line controller therapy."}, {"Recommendation", "Review inhaler technique at every visit."} });
    }
}
