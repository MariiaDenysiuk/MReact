const MReact = (function() {
   function createElement(type, atr = {}, ...children) {
       let childElement = [].concat(...children).reduce(
           (acc, child) => {
               if(child !=null && child !== true && child !==false) {
                   if(child instanceof Object) {
                       acc.push(child);
                   } else {
                       acc.push(createElement("text", {
                           textContent: child
                       }))
                   }
               }
               return acc;
           }, [])
        return {
            type,
            children: childElement,
            props: Object.assign({children: childElement}, atr)
        }
   }

   const render = function(vdom, container, oldDom = container.firstChild) {
     diff(vdom, container, oldDom);
   }

   const diff = function(vdom, container, oldDom) {
    let oldvdom = oldDom && oldDom._virtualElement;
    if(!oldDom) {
        mountElement(vdom, container, oldDom);
      } else if (oldDom.type === "text") {
          updateTextNode(oldDom, vdom, oldvdom);
      } else {
          updateDomElement(oldDom, vdom, oldvdom);
      }

      // Set a reference to updated vdom;
     
      oldDom._virtualElement = vdom;

      vdom.children.forEach((child, i) => {
          diff(child, oldDom, oldDom.chldNodes[i]);
      })
   }

   const mountElement = function(vdom, container, oldDom) {
      return mountSimpleNode(vdom, container, oldDom);
   }

   const mountSimpleNode = function(vdom, container, oldDomElement, parentComponent) {
       let newDomNode = null;

       const nextSibling = oldDomElement && oldDomElement.nextSibling;

       if(vdom.type === "text") {
           newDomNode = document.createTextNode(vdom.props.textContent);
       } else {
           newDomNode = document.createElement(vdom.type);
           updateDomElement(newDomNode, vdom);
       }


       //Setting reference to vdom to dim
       newDomNode._virtualElement =  vdom;
       if(nextSibling) {
           container.insertBefore(newDomNode, nextSibling);
       } else {
           container.appendChild(newDomNode);
       }

       vdom.children.forEach(element => {
           mountElement(element, newDomNode);
       });

       // Remove old dom nodes
       let oldNodes = oldDom.chldNodes;
       if(oldNodes.length > vdom.children.length) {
           for(let i = oldNodes.length -1; i >= vdom.children.length; i -= 1) {
               let nodeToBeRemoved = oldNodes[i];
               unmountNode(nodeToBeRemoved, oldDom)
           }
       }
   }

   function unmountNode(domElement, parentComponent) {
       domElement.remove();
   }

   function updateTextNode(domElement, newVirtualElement, oldVirtualElement) {
       if(newVirtualElement.props.textContent !== oldVirtualElement.props.textContent) {
          domElement.textContent = newVirtualElement.props.textContent;
       }
       domElement._virtualElement = newVirtualElement;
   }


   const updateDomElement = function(domElement, newVirtualEl, oldVirtualElement = {}) { 
    
    const newProps = newVirtualEl.props || {};
    const oldProps = oldVirtualElement.props || {};

        Object.keys(newProps).forEach(propname => {
            const newProp = newProps[propname];
            const oldProp = oldProps[propname];

            if(newProp !== oldProp) {
               if(propname.slice(0, 2) === "on") {
                   const eventName = propname.toLowerCase().slice(2);
                   domElement.addEventListener(eventName, newProp, false);
                   if(oldProp) {
                       domElement.removeEventListener(eventName, oldProp, false)
                   }
               } else if(propname === "value" || propname === "checked") {
                   domElement[propname] = newProp;
               } else if(propname !== "children") {
                   if(propname === "className") {
                       domElement.setAttribute("class", newProps[propname]);
                   } else {
                       domElement.setAttribute(propname, newProps[propname]);
                   }
               }
            }
        });

        Object.keys(oldProps).forEach(propname => {
            const newProp = newProps[propname];
            const oldProp = oldProps[propname];

            if(!newProp) {
                if(propname.slice(0, 2) === "on") {
                    domElement.removeEventListener(propname, oldProp, false);
                } else if(propname !== "children") {
                    domElement.removeAttribute(propname);
                }
            }
        })
   }

   return {
       createElement,
       render
   }
}());