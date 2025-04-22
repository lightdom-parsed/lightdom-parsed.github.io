/* 
    DISCLAIMER this a a sneak preview of one lesson from the Web Components course I am working on
    I cut some corners to get it only after a BlueSky conversation
*/

// **************************************************************************** urlParams
const urlParams = new URLSearchParams(window.location.search);
// **************************************************************************** createElement
const createElement = (
  /* string */ tag,
  /* Object */ options = {},
  /* Node   */ element = document.createElement(tag) // create or use existing element
) => {
    //console.error(`%c createElement <${tag}> `, "background:blue;color:white", this);
    const {
        prepend = [], // prepend at start
        append = [], // append at end
        classes = [], // set .classList
        styles = {}, // set .style
        attrs = {}, // set attributes
        ...props // catch remaining props, like listeners onclick, className, etc
    } = options;
    element.prepend(...prepend); // prepend children
    element.append(...append); // append children
    element.classList.add(...classes); // add classes
    Object.keys(attrs).forEach((key) => element.setAttribute(key, attrs[key])); // set attributes
    Object.assign(element.style, styles); // assign style
    return Object.assign(element, props); // assign remaining properties
}
const createTag = (tag, innerHTML, props = {}) => createElement(tag, { innerHTML, ...props })

// **************************************************************************** define <my-custom-element> A and B
function defineCustomElementsAandB() {
    let linenr = 1
    customElements.define(
        "my-custom-element",
        class extends HTMLParsedElement {
            // ================================================================ log
            log(...attrs) {
                let componentID = this.id || "B"; // no attributes yet on component B when constructor is called!
                let methodName = attrs.shift();
                let isConnected = this.isConnected;
                let has_lightDOM = this.textContent.length > 0;
                let explanationID = "explanations #" + componentID.split(" ")[0] + methodName;
                setTimeout(() => { // timeout ensure innerHTML is available to log
                    document.body.appendChild(
                        this.details = createElement("details", {
                            className: "component" + componentID,
                            append: [
                                createElement("summary", {
                                    append: [
                                        createTag("tag-linenr", linenr++),
                                        createTag("tag-methodname", methodName.split("__")[0]),
                                        createTag("tag-isconnected", (isConnected ? "TRUE" : "FALSE")),
                                        createTag("tag-lightdom", (has_lightDOM ? "" : "NOT") + " available"),
                                        createTag("tag-attrschanged", attrs),
                                    ]
                                }),
                                createElement("tag-explanation", {
                                    append: [
                                        document.querySelector(explanationID)?.cloneNode(true), // lightDOM gets slotted
                                    ]
                                })
                            ], // append
                            onclick: (e) => {
                                e.preventDefault();
                                let details = e.target.closest("details");
                                details.toggleAttribute("open", !details.hasAttribute("open"));
                            },
                        }) // details
                    ).toggleAttribute("open", urlParams.has('open')); // initial open state
                })
            }
            // ================================================================ constructor
            constructor() {
                super().log("constructor")
            }
            // ================================================================ observedAttributes
            static get observedAttributes() {
                return ["attr1", "attr2"]
            }
            // ================================================================ attributeChangedCallback
            attributeChangedCallback(name, oldValue, newValue) {
                this.log(`attributeChangedCallback__${name}`, `${name},${oldValue},${newValue}`)
            }
            // ================================================================ connectedCallback
            async connectedCallback() {
                this.log(`connectedCallback`)
                if (!this.isConnected) {
                    this.log("not connected in connectedCallback")
                    return
                }
                //this.render()
                requestAnimationFrame(() => {
                    let title = "rAF_triggered"
                    if (this.setTimeout_triggered) {
                        title = "rAF_triggered after setTimeout"
                    }
                    this.log(title)
                    this.addHTML("rAF");
                })
                setTimeout(() => {
                    this.setTimeout_triggered = true;
                    this.log("setTimeout_triggered")
                    this.addHTML("setTimeout");
                })
                setTimeout(() => {
                    this.setAttribute("attr2", "BAR")
                })
                await Promise.resolve()
                this.log("Promise_resolved")
            }
            // ================================================================ addHTML
            addHTML(method = "") {
                return
                document.body.append(
                    createElement("h3", {
                        innerHTML: `Component <b>${this.id}</b> : add HTML in ` + method,
                        className: "DOMevent"
                    }),
                )
            }
            // ================================================================ parsedCallback
            parsedCallback() {
                this.log("parsedCallback")
            }

        }, // class extends HTMLParsedElement
    ) // customElements.define("my-custom-element"
} // defineCustomElementsAandB
