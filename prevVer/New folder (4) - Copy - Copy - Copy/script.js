path = [];
let dataobj = {};
counter = 0;
const checks = document.createRange().createContextualFragment(`
<div style="display: flex; align-items: center;">
&ensp;<input type="checkbox" id="dodeletepath"">
<label for="dodeletepath" style="display: block; text-align: center; color: white; font-family: Arial; font-weight: 300; font-size: 12px;">Attempt to keep current<br>path on upload?</label>
</div>`);
const button = document.createRange().createContextualFragment(`
&emsp;<button style="overflow: visible; display: inline-block font-weight: bold" class="box" type="button" onclick="if (!(document.getElementById('dodeletepath').checked)) path = []; setkeypathurl();">Load</button>`);


const getjsonfile = document.getElementById("jsonFile");
getjsonfile.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const jsonreader = new FileReader();
  jsonreader.onload = function (e) {
    try {
      const fileString = e.target.result;
      dataobj = JSON.parse(fileString);
      console.log("JSON successfully loaded into variable:", dataobj);
      document.getElementById("samelinething").append(checks);
      if (!(document.getElementById('dodeletepath').checked) && !(document.getElementById('dodeletepath'))) {
        path = [];
      }
      setkeypathurl();
    } catch (error) {
      console.error("Error parsing JSON. Make sure the file is valid.", error);
    }
  };
  jsonreader.readAsText(file);
});

function setkeypathurl() {
  const listofkeys = document.getElementById("listofkeys");
  counter = 0;
  listofkeys.innerHTML = render(path, dataobj);
  descholder.innerHTML =
    `<label style="color: yellow; font-family: Arial; font-weight: bold; font-size: 30px;">Description:</label><div class="box" style="flex-grow: 1"><label style="color: yellow; font-family: Arial;">` +
    (Array.isArray(path)
      ? path.length === 0
        ? "Select key"
        : path
            .flatMap((val, i) =>
              i < path.length - 1 ? [val, "children"] : [val],
            )
            .concat("description")
            .reduce((currentLevel, key) => {
              return currentLevel && currentLevel[key] !== undefined
                ? currentLevel[key]
                : undefined;
            }, dataobj)
      : "path is not valid. this is probably a mistake on my part") +
    `</label></div><div style="width: auto; height: 3px; background-color: #333; margin: 10px -4px; border-radius: 2px;"></div>`;
}
function myFunction(element) {
  element = document.getElementById(`key${element}`);
  const parents = [];
  while (element.parentElement.id != "listofkeys") {
    parents.push(element.parentElement.dataset.keyname);
    element = element.parentElement;
  }
  path = parents.toReversed();
}
function render(inputpath, obj, currpath = [], currentlist = [], under = true) {
  if (under) {
    var htmltoreturn = `<label style="color: lime; font-size: 12px">Root</label><br>`;
  } else {
    var htmltoreturn = "";
  }
  Object.entries(obj).forEach(([key, value], index) => {
    counter++;
    let gap = [currentlist]
      .join("")
      .replace(/true/g, "&thinsp;&thinsp;&ensp;")
      .replace(/false/g, "│&thinsp;");
    var testcurrpath = [...currpath, key];
    htmltoreturn =
      htmltoreturn +
      `<label style="color: lime;" data-keyname="${key}">${gap}${Object.keys(obj).length != 0 ? (index === Object.keys(obj).length - 1 ? "└" : "├") : ""}
        <span id="key${counter}">
            <a href="javascript:void(0)" onclick="myFunction(${counter}); setkeypathurl();" class="selectablekey${testcurrpath.length === inputpath.length && testcurrpath.every((val, index) => val === inputpath[index]) ? " selectedkey" : ""}">
                ${key}
            </a>
            <br>
        </span>
        ${render(inputpath, value["children"], testcurrpath, currentlist + [index === Object.keys(obj).length - 1], false)}
    </label>`;
  });

  return htmltoreturn;
}
