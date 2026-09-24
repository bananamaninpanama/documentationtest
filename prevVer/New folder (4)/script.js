path = []
let dataobj = {}
counter = 0
const buttons = document.createRange().createContextualFragment(`<br>
    <button type="button" onclick="setkeypathurl();">
        load and attempt to keep current path
    </button>
    <button type="button" onclick="path = []; setkeypathurl();">
        load and delete current path
    </button>`);

const getjsonfile = document.getElementById('jsonFile');
getjsonfile.addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    if (!file) return; 
    const jsonreader = new FileReader();
    jsonreader.onload = function(e) {
        try {
            const fileString = e.target.result; 
            dataobj = JSON.parse(fileString); 
            console.log("JSON successfully loaded into variable:", dataobj);
            document.getElementById('filestuff').append(buttons)
        } catch (error) {
            console.error("Error parsing JSON. Make sure the file is valid.", error);
        }
    };
    jsonreader.readAsText(file);
});

function setkeypathurl() {
    const listofkeys = document.getElementById("listofkeys");
    counter = 0
    listofkeys.innerHTML = render(path,dataobj);
}
function myFunction(element) {
    element = document.getElementById(`key${element}`);
    const parents = []
    while (element.parentElement.id != "listofkeys") {
      parents.push(element.parentElement.dataset.keyname);
      element = element.parentElement
    }
    path = parents.toReversed();
}
function render(inputpath,obj,currpath = []) {
    var htmltoreturn = ""
    Object.entries(obj).forEach(([key, value]) => {
    counter++
    var testcurrpath = [...currpath, key]
    htmltoreturn = htmltoreturn + `
    <label data-keyname="${key}">${('&ensp;').repeat(currpath.length)}
        <span id="key${counter}">
            <a href="javascript:void(0)" onclick="myFunction(${counter}); setkeypathurl();" class="selectablekey${(testcurrpath.length === inputpath.length && testcurrpath.every((val, index) => val === inputpath[index])) ? ' selectedkey' : ''}">
                ${key}
            </a>
            <br>
        </span>
        ${render(inputpath,(value["children"]),testcurrpath)}
    </label>`
    });
    
    return (htmltoreturn);
}