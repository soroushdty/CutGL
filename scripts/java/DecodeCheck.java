import java.beans.XMLDecoder; import java.io.*; import java.util.*; import java.util.regex.*;
import javax.swing.tree.*; import javax.xml.parsers.*; import javax.xml.transform.*; import javax.xml.transform.dom.DOMSource; import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Element;
// Reads a GEMCutterTreeModel.xml with the JDK's own XMLDecoder, then writes GEM XML the way the desktop app does
// (DOM + Transformer, indent=yes). Used to check that a project saved by the page decodes in Java.
//
//   cd scripts/java && javac -d out gemc/*.java DecodeCheck.java
//   java -Djava.awt.headless=true -cp out DecodeCheck <GEMCutterTreeModel.xml> <out.xml>
public class DecodeCheck {
    static String content(String s) { Matcher m = Pattern.compile("(.*?>\\s*)(.*)", Pattern.DOTALL).matcher(s); return m.find() ? m.group(2).trim() : s; }
    static String name(String s) { Matcher m = Pattern.compile("^<(.*?)>\\s*(.*)", Pattern.DOTALL).matcher(s); return m.find() ? m.group(1).trim() : ""; }
    static int count = 0;
    static void add(org.w3c.dom.Document d, Element parent, DefaultMutableTreeNode t) {
        Enumeration<TreeNode> ch = t.children();
        while (ch.hasMoreElements()) {
            DefaultMutableTreeNode n = (DefaultMutableTreeNode) ch.nextElement(); count++;
            gemc.UserObjectBean u = (gemc.UserObjectBean) n.getUserObject();
            Element e = d.createElement(name(n.toString()));
            e.setAttribute("source", u.getAttributeSourceProperty()); e.setAttribute("id", u.getAttributeIDProperty());
            if (e.getNodeName().endsWith("Code") && u.getAttributeCodeSetProperty() != null) e.setAttribute("codeset", u.getAttributeCodeSetProperty());
            e.setTextContent(content(n.toString()));
            parent.appendChild(e); add(d, e, n);
        }
    }
    public static void main(String[] a) throws Exception {
        XMLDecoder dec = new XMLDecoder(new BufferedInputStream(new FileInputStream(a[0])));
        DefaultTreeModel model = (DefaultTreeModel) dec.readObject(); dec.close();
        DefaultMutableTreeNode root = (DefaultMutableTreeNode) model.getRoot();
        org.w3c.dom.Document d = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
        Element r = d.createElement(name(root.toString()));
        r.setAttribute("xmlns", "http://gem.yale.edu"); r.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance"); r.setAttribute("xsi:schemaLocation", "http://gem.yale.edu gemschemaiii.xsd");
        add(d, r, root); d.appendChild(r);
        Transformer t = TransformerFactory.newInstance().newTransformer(); t.setOutputProperty("indent", "yes");
        FileOutputStream os = new FileOutputStream(a[1]); t.transform(new DOMSource(d), new StreamResult(os)); os.close();
        System.out.println("decoded nodes: " + (count + 1) + ", root label: [" + root + "]");
    }
}
