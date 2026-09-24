path = [];
let dataobj = {};
counter = 0;
const checks = document.createRange().createContextualFragment(`
<div style="display: flex; align-items: center;">
&ensp;<input type="checkbox" id="dodeletepath"">
<label for="dodeletepath" style="user-select: none; display: block; text-align: center; color: white; font-family: Arial; font-weight: 300; font-size: 12px;">Attempt to keep current<br>path on upload?</label>
</div>`);
const showjsonbutton = document.createRange().createContextualFragment(`<button class="showjsonbutton" id="showcurrentjson" onclick="document.getElementById('currentjsonobjecttext').textContent = JSON.stringify(dataobj, null, 2); (document.getElementById('currentobjjsonthing')).showModal();">Show Current <br> JSON</button>`);

//i copied this from the dino game code thing i made
function copyCode() {
        const range = document.createRange();
        const selection = window.getSelection();
        const statusMessage = document.getElementById('statusMessage');
        range.selectNode(document.getElementById('currentjsonobjecttext'));
        selection.removeAllRanges();
        selection.addRange(range);
    
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                statusMessage.textContent = "Copied to clipboard!";
                statusMessage.style.color = "green";
            } else {
                statusMessage.textContent = "Failed to copy automatically.";
                statusMessage.style.color = "red";
            }
        } catch (err) {
            statusMessage.textContent = "Failed to copy automatically.";
            statusMessage.style.color = "red";
        }
        selection.removeAllRanges();
        setTimeout(function() {
            statusMessage.textContent = '';
        }, 2500);
  }

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
      document.getElementById("oppositeends").append(showjsonbutton);
      if (
        !document.getElementById("dodeletepath").checked ||
        !document.getElementById("dodeletepath")
      ) {
        path = [];
      }
      setkeypathurl();
    } catch (error) {
      console.error("Error parsing JSON. Make sure the file is valid.", error);
    }
  };
  jsonreader.readAsText(file);
});

function editdecripion() {
  let temppath = path.flatMap((val, i) =>
              i < path.length - 1 ? [val, "children"] : [val],
            ).concat("description")

  const deepTarget = temppath.slice(0, (temppath.length - 1)).reduce((currentDepth, key) => {
    // If the next nested object doesn't exist, create it
    if (!(key in currentDepth)) {
      console.error('... this is probably your fault for editing dataobj or path while editing an the description');
    }
    return currentDepth[key];
  }, dataobj);
deepTarget[temppath[temppath.length - 1]] = document.getElementById('editdescriptionbox').value;
document.getElementById('descriptionbox').textContent = document.getElementById('editdescriptionbox').value;
}

function setkeypathurl() {
  const listofkeys = document.getElementById("listofkeys");
  counter = 0;
  listofkeys.innerHTML = render(path, dataobj);
  descholder.innerHTML =
    `<div style="display: flex; overflow-y: auto; align-items: center; justify-content: space-between;"><label style="color: yellow; font-family: Arial; font-weight: bold; font-size: 30px;">Description:</label> <button onclick="(document.getElementById('testeditor')).showModal();" class="editbutton" type="button" style="height: 25px; width: 25px; font-size: 15px;" id="editbutton">🖉</button> </div><div class="box" style="white-space: pre-line;"><label id="descriptionbox" style="color: yellow; font-family: Arial;">` +
    (Array.isArray(path)
      ? path.length === 0
        ? "Select key"
        : path.flatMap((val, i) =>
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
  if (path.length === 0) {
    document.getElementById("editbutton").style.display = "none";
    document.getElementById('editdescriptionbox').value = "WHAT ARE YOU DOING HERE?! I GOT RID OF THE EDIT DESCRIPTION BUTTON FOR A REASON! (or maybe you tried to like, get the description from an invalid array(i dont think i implemented that, but like, i ran it when it tried to get the element with id 'select key' instead of 'descriptionbox' and it gave me this message), either way:) YOU SHOULDN'T BE HERE!!!!!"
  } else {
    document.getElementById('editdescriptionbox').value = document.getElementById('descriptionbox').textContent
  }
  
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
