/** @jsx MReact.createElement */ 

const root = document.getElementById("root");

var Step1 = (
    <div>
        <h1 class="className">Hello tine</h1>
        <p onClick={()=> alert("Hello")}>Click</p>
    </div>
);

var Step2 = (
    <div>
        <h1 class="className">Hello Masha</h1>
        <p onClick={()=> alert("Hello")}>Click</p>
    </div>
);
MReact.render(Step1, root);

setTimeout(() => {
    alert("Re-rendering");
    MReact.render(Step2, root);
}, 4000);