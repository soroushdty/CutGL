package gemc;
public class LinkBean implements java.io.Serializable {
    static final long serialVersionUID = 6443347464941399799L;
    private int start, end; private javax.swing.tree.TreePath treepath; private int index;
    public LinkBean(int start, int end, javax.swing.tree.TreePath treepath, int index) { this.start = start; this.end = end; this.treepath = treepath; this.index = index; }
}
