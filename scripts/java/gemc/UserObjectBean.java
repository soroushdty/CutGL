package gemc;
// Stand-in written for testing: same property names as the desktop bean, none of its code.
public class UserObjectBean implements java.io.Serializable {
    static final long serialVersionUID = 4665304180768010916L;
    private String elementProperty, attributeIDProperty, attributeVersionProperty, attributeCodeSetProperty, attributeSourceProperty, attributeLangProperty;
    private java.beans.PropertyChangeSupport propertySupport = new java.beans.PropertyChangeSupport(this);
    public String getElementProperty() { return elementProperty; }
    public void setElementProperty(String v) { elementProperty = v; }
    public String getAttributeIDProperty() { return attributeIDProperty; }
    public void setAttributeIDProperty(String v) { attributeIDProperty = v; }
    public String getAttributeSourceProperty() { return attributeSourceProperty; }
    public void setAttributeSourceProperty(String v) { attributeSourceProperty = v; }
    public String getAttributeCodeSetProperty() { return attributeCodeSetProperty; }
    public void setAttributeCodeSetProperty(String v) { attributeCodeSetProperty = v; }
    public String toString() { return elementProperty == null ? "" : elementProperty; }
}
