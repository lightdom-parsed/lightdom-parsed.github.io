/* 
    DISCLAIMER this a a sneak preview of one lesson from the Web Components course I am working on
    I cut some corners to get it online after a BlueSky conversation
*/


// Hierarchy: 
// HTMLElement -> TagBaseClass -> TagLabelClass -> tag-name

// **************************************************************************** TagBaseClass
// BaseClass for all custom elements, to attach shadowDOM and CSS/HTML
class TagBaseClass extends HTMLElement {
    connectedCallback(html = this.html) {
        this.attachShadow({
            mode: "open"
        }).innerHTML = `<style>:host{display:inline-block}</style>` + html
    }
}
// **************************************************************************** <tag-name>
// display tag-name in blue as <tag-name>
customElements.define("tag-name", class extends TagBaseClass {
    html = `<style>:host{color:blue}</style>` +
        `<<slot></slot>>`
});
// **************************************************************************** <tag-attr>
// display tag-attr in black as name="value"
customElements.define("tag-attr", class extends TagBaseClass {
    html = `<style>` +
        `:host{color:var(--attrhighlight)}` +
        `span{color:black}` +
        `is{color:grey}` +
        `slot{font-weight:bold}` +
        `</style>` +
        `<span>${this.getAttribute("name")}</span><is>=</is>"` +
        `<slot></slot>"`
});
// **************************************************************************** <tag-script>
// display tag-script in black as <script>...</script>
customElements.define("tag-script", class extends TagBaseClass {
    html = `<style>` +
        `:host{margin:.3em;font-size:140%}` +
        `</style>` +
        `<tag-name>script</tag-name>` +
        `<slot></slot>` +
        `<tag-name>script</tag-name>`;
})
// **************************************************************************** class
class TagLabelClass extends TagBaseClass {
    connectedCallback() {
        this.init && this.init()
        let [background = "red", color = "black"] = (this.colors || "").split(",")
        super.connectedCallback(`<style>` +
            `:host{display:inline-block;background:${background};color:${color};padding:0 4px;` +
            //(this.style || "") +
            `}` +
            (this.css || "") +
            `</style>` +
            (this.prefix || "") +
            `<slot></slot>`)
    }
}
// **************************************************************************** <tag-methodname>
// display tag-methodname in black as methodname
customElements.define("tag-methodname", class extends TagLabelClass {
    init() {
        const methodName = this.innerHTML.trim();
        const defaultmethods = ["constructor", "connectedCallback", "disconnectedCallback", "adoptedCallback", "attributeChangedCallback"];
        const isDefault = defaultmethods.includes(methodName);
        const isTrigger = methodName.includes("trigger");
        const isAfter = methodName.includes("after");

        if (isDefault) {
            this.colors = "green,beige";
        } else if (isTrigger) {
            if (isAfter) {
                this.colors = "orangered,beige";
            } else {
                this.colors = "gold";
            }
            setTimeout(() => {
                if (this.colors == "gold") {
                    RAFLATE.style.display = "none";
                    RAFEARLY.style.display = "block";
                } else {
                    RAFLATE.style.display = "block";
                    RAFEARLY.style.display = "none";
                }
            }, 100); // WTF? wsn't applied correctly
        }
    }
});
// **************************************************************************** <tag-isconnected>
// display tag-isconnected in black as isConnected=true
customElements.define("tag-isconnected", class extends TagLabelClass {
    init() {
        this.colors = this.innerHTML.includes("TRUE") ? "lightgreen" : "var(--warningcolor),beige";
    }
    prefix = `<label>this.isConnected=</label>`
});
// **************************************************************************** <tag-linenr>
// display tag-linenr in black as #linenr
customElements.define("tag-linenr", class extends TagLabelClass {
    colors = "none";
    css = `:host{text-align:center}`;
    prefix = `<label>#</label>`
});
// **************************************************************************** <tag-lightdom>
// display tag-lightdom in black as lightDOM available
customElements.define("tag-lightdom", class extends TagLabelClass {
    prefix = `<label>lightDOM </label>`;
    connectedCallback() {
        if (this.innerHTML.includes("NOT")) {
            this.colors = "var(--warningcolor),beige";
        } else {
            this.colors = "lightgreen";
        }
        super.connectedCallback();
    }
});
// **************************************************************************** <tag-attrs>
// display tag-attrs HTML "name,oldValue,newValue" as name="value" ...
customElements.define("tag-attrschanged", class extends TagBaseClass {
    connectedCallback() {
        let [name, oldValue, newValue] = this.innerHTML.split(",");
        let html = (label, str) => label + `=<b>${str == "null" ? `<span>${str}</span>` : str}</b>`;
        this.innerHTML = "";// clear lightDOM
        if (name) {
            super.connectedCallback(`<style>` +
                `:host{grid-column:2/span 3}` +
                `span{color:var(--warningcolor,firebrick)}` +
                `</style>` +
                [html("name", name), html("oldValue", oldValue), html("newValue", newValue)].join(" - "));
        }
    }
})
// **************************************************************************** <tag-explanation>
// display tag-explanation in black as <tag-explanation>...</tag-explanation>
customElements.define("tag-explanation", class extends TagBaseClass {
    style = `:host{display:inline-block;margin:3px 0 0 42px;font-size:var(--explanationFontSize)}` +
        `:host{grid-column:2/span 3}`;
    html = `<slot part="explanation"></slot>`
})
// **************************************************************************** <component-html>
// display Component A and B as visible HTML
customElements.define(
    "component-html",
    class extends TagBaseClass {
        connectedCallback() {
            let id = this.getAttribute("component");
            this.classList.add("component" + id)
            // ---------------------------------------------------------------- HTML
            let tagname = `<tag-name>my-custom-element</tag-name>`;
            let attr = (name, value) => `<tag-attr name="${name}">${value}</tag-attr>`;

            this.html = `<style>` +
                `:host{display:block;background:var(--h1background)}` +
                `h{display:block;font-size:140%;padding-bottom:.2em}` +
                `.description{font-size:140%}` +
                `.highlight{font-size:100%;color:var(--attrhighlight);font-weight:bold}` +
                `</style>` +
                `<h>${tagname} ${attr("id", id)} ${attr("attr1", "foo")}>lightDOM${tagname}></h>` +
                `<span class="description">is in the DOM, <span class="highlight">${id == "A" ? "BEFORE" : "AFTER"}</span> Element ${id} is defined with script</span>`

            super.connectedCallback();
        }
    },
)
