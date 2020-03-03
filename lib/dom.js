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
     if(!oldDom) {
       mountElement(vdom, container, oldDom);
     }
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
           newDomNode = document.createElement(vdom.type)
       }

       newDomNode._virtualElement =  vdom;
       if(nextSibling) {
           container.insertBefore(newDomNode, nextSibling);
       } else {
           container.appendChild(newDomNode);
       }

       vdom.children.forEach(element => {
           mountElement(element, newDomNode);
       });
   }

   return {
       createElement,
       render
   }
}());