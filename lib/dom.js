const MReact = (function() {
   function createElement(type, atr = {}, ...children) {
        return {
            type,
            children,
            props: atr
        }
   }

   return {
       createElement
   }
}());