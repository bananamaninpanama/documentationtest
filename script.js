path = [];
let dataobj = {};
let predataobj = {}
counter = 0;
const checks = document.createRange()
  .createContextualFragment(`
<div style="display: flex; align-items: center;">
&ensp;<input type="checkbox" id="dodeletepath"">
<label for="dodeletepath" style="user-select: none; display: block; text-align: center; color: white; font-family: Arial; font-weight: 300; font-size: 12px;">Attempt to keep current<br>path on upload?</label>
</div>`);
const showjsonbutton = document.createRange()
  .createContextualFragment(`<button class="showjsonbutton" id="showcurrentjson" onclick="document.getElementById('currentjsonobjecttext').textContent = JSON.stringify(dataobj, null, 2); (document.getElementById('currentobjjsonthing')).showModal();">Show Current <br> JSON</button>`);

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




function loadjsonfilebutlikeactuallydoit__wait_idkifthisisdefinedanywhereelseandiwontcheckbutthisbeingreallylongisprobablynotnescisarry() {
    console.log(predataobj);
    dataobj = predataobj;
    document.getElementById('importmenu').close();
    document.getElementById("samelinething2thesequel:electricboogaloo")
        .append(checks);
      document.getElementById("oppositeends")
        .append(showjsonbutton);
      if (
        !document.getElementById("dodeletepath")
        .checked ||
        !document.getElementById("dodeletepath")
      ) {
        path = [];
      }
      setkeypathurl();
}


const dropArea = document.getElementById('thefropdownforthejsonfilesthatididntnamebeforeforsomereason');
const fileInput = document.getElementById('jsonFile');




function processFile(file) {
  if (!file) return;
  const jsonreader = new FileReader();
  jsonreader.onload = function(e) {
    try {
      const fileString = e.target.result;
      predataobj = JSON.parse(fileString)
      document.getElementById('jsonimporttextbox').textContent = JSON.stringify(predataobj, null, 2);
    } catch (error) {
      console.error("Error parsing JSON. Make sure the file is valid.", error);
    }
  };
  jsonreader.readAsText(file);
};

fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    processFile(file);
});


fileInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    processFile(file);
});

// Preventing default browser behavior when dragging a file over the container
dropArea.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
});
dropArea.addEventListener('dragenter', function(e) {
  e.preventDefault();
  e.stopPropagation();
});
dropArea.addEventListener('dragleave', function(e) {
  e.preventDefault();
  e.stopPropagation();
});

// Handling dropping files into the area
dropArea.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

  // Getting the list of dragged files


  // Checking if there are any files
  if (e.dataTransfer.files.length) {
    // Assigning the files to the hidden input from the first step
    document.getElementById('jsonFile').files = e.dataTransfer.files;
    const file = e.dataTransfer.files[0];
    processFile(file);
  }
});




function editdecripion() {
  let temppath = path.flatMap((val, i) =>
      i < path.length - 1 ? [val, "children"] : [val],
    )
    .concat("description")

  const deepTarget = temppath.slice(0, (temppath.length - 1))
    .reduce((currentDepth, key) => {
      if (!(key in currentDepth)) {
        console.error('... this is probably your fault for editing dataobj or path while editing an the description');
      }
      return currentDepth[key];
    }, dataobj);
  deepTarget[temppath[temppath.length - 1]] = document.getElementById('editdescriptionbox')
    .value;
  document.getElementById('descriptionbox')
    .textContent = document.getElementById('editdescriptionbox')
    .value;
}

function editname() {
  const newkeyname = document.getElementById('editnamebox')
    .value
  const currentkeyname = document.getElementById('namebox')
    .textContent
  if (newkeyname != currentkeyname) {
    let temppath = path.flatMap((val, i) =>
      i < path.length - 1 ? [val, "children"] : [val],
    )

    const deepTarget = temppath.slice(0, (temppath.length - 1))
      .reduce((currentDepth, key) => {
        if (!(key in currentDepth)) {
          console.error('... this is probably your fault for editing dataobj or path while editing an the description');
        }
        return currentDepth[key];
      }, dataobj);
    if (Object.hasOwn(deepTarget, newkeyname)) {
      if (confirm("A key with this name already exists, and if you continue, that key will be replaced with this one\n\nDo you want to proceed?")) {
        delete deepTarget[newkeyname]
      } else {
        return
      }
    }
    let updatedData = {}
    Object.entries(deepTarget)
      .forEach(([key, value]) => {
        if (key === currentkeyname) {
          updatedData[newkeyname] = value;
        } else {
          updatedData[key] = value;
        }
      });
    Object.entries(deepTarget)
      .forEach(([key, value]) => {
        delete deepTarget[key]
      });

    Object.entries(updatedData)
      .forEach(([key, value]) => {
        deepTarget[key] = value;
      });

    document.getElementById('namebox')
      .textContent = newkeyname;
    path[path.length - 1] = newkeyname;
    listofkeys.innerHTML = render(path, dataobj);
  }
}

function editchildren() {
  const newkeyname = document.getElementById('editnamebox')
    .value
  const currentkeyname = document.getElementById('namebox')
    .textContent
  if (newkeyname != currentkeyname) {
    let temppath = path.flatMap((val, i) =>
      i < path.length - 1 ? [val, "children"] : [val],
    )

    const deepTarget = temppath.slice(0, (temppath.length - 1))
      .reduce((currentDepth, key) => {
        if (!(key in currentDepth)) {
          console.error('... this is probably your fault for editing dataobj or path while editing an the description');
        }
        return currentDepth[key];
      }, dataobj);
    if (Object.hasOwn(deepTarget, newkeyname)) {
      if (confirm("A key with this name already exists, and if you continue, that key will be replaced with this one\n\nDo you want to proceed?")) {
        delete deepTarget[newkeyname]
      } else {
        return
      }
    }
    let updatedData = {}
    Object.entries(deepTarget)
      .forEach(([key, value]) => {
        if (key === currentkeyname) {
          updatedData[newkeyname] = value;
        } else {
          updatedData[key] = value;
        }
      });
    Object.entries(deepTarget)
      .forEach(([key, value]) => {
        delete deepTarget[key]
      });

    Object.entries(updatedData)
      .forEach(([key, value]) => {
        deepTarget[key] = value;
      });

    document.getElementById('namebox')
      .textContent = newkeyname;
    path[path.length - 1] = newkeyname;
    listofkeys.innerHTML = render(path, dataobj);
  }
}







function banana() {
  keypath = path.flatMap((val, i) =>
    i < path.length - 1 ? [val, "children"] : [val],
  );
  keyname = keypath.pop();

  keypath.reduce((currentLevel, key) => {
    return currentLevel && currentLevel[key] !== undefined ?
      (typeof currentLevel[key] === 'object' ? currentLevel[key] : key) :
      undefined;
  }, dataobj)
  return [keyname]
}

function getchildrenofcurrentkeyasbuttons() {

  let currentchildren = path.flatMap((val, i) =>
      i < path.length - 1 ? [val, "children"] : [val],
    )
    .concat("children")
    .reduce((currentLevel, key) => {
      return currentLevel && currentLevel[key] !== undefined ?
        currentLevel[key] :
        undefined;
    }, dataobj)

  if (Object.keys(currentchildren)
    .length === 0) {
    return `<label>no subkeys yet</label>`
  }
  valuetoreturn = `<div id="parent" style="display: flex; flex-direction: column;">`
  Object.entries(currentchildren)
    .forEach(([key, value]) => {
      let sliceidx1 = (value["description"])
        .indexOf("\n")
      let sliceidx2 = (value["description"])
        .indexOf("\n", sliceidx1 = -1 ? value["description"].length : sliceidx1 + 1)
      let insertvalue = (value["description"].slice(0, sliceidx2 = -1 ? value["description"].length : sliceidx2))
        .slice(0, 60)
      valuetoreturn = valuetoreturn + `
    <button class="childrenpath" onclick="path.push('${key}'); setkeypathurl();" style="flex: 1; margin: 4px; display: flex; flex-direction: column;"><label style="font-size: 20px;">${key}</label><label style="font-size: 8px; display: inline-block; color: #fffd6ee9">${insertvalue}${(insertvalue.length === value["description"].length ? '' : '...')}</label></button>`
    });
  valuetoreturn = valuetoreturn + "</div>"
  return valuetoreturn
}

function getparentofcurrentkeyasbuttons() {

  let currentparent = path.flatMap((val, i) =>
    i < path.length - 1 ? [val, "children"] : [val],
  )
  let parentkey = currentparent.at(-3)
  currentparent = currentparent.slice(0, -2)
    .reduce((currentLevel, key) => {
      return currentLevel && currentLevel[key] !== undefined ?
        currentLevel[key] :
        undefined;
    }, dataobj)
  let sliceidx1 = (currentparent["description"])
    .indexOf("\n")
  let sliceidx2 = (currentparent["description"])
    .indexOf("\n", sliceidx1 = -1 ? currentparent["description"].length : sliceidx1 + 1)
  let insertvalue = (currentparent["description"].slice(0, sliceidx2 = -1 ? currentparent["description"].length : sliceidx2))
    .slice(0, 60)
  valuetoreturn = `<div id="parent" style="display: flex; flex-direction: column;">
  <button class="childrenpath" onclick="path.pop(); setkeypathurl();" style="flex: 1; display: flex; flex-direction: column;">
    <label style="font-size: 20px;">${parentkey}</label>
    <label style="font-size: 8px; display: inline-block; color: #fffd6ee9">${insertvalue}${(insertvalue.length === currentparent["description"].length ? '' : '...')}</label>
  </button>`




  valuetoreturn = valuetoreturn + "</div>"
  return valuetoreturn
}


function setkeypathurl() {
  const listofkeys = document.getElementById("listofkeys");
  counter = 0;
  listofkeys.innerHTML = render(path, dataobj);
  if (Array.isArray(path)) {
    if (path.length === 0) {
      descholder.innerHTML = `<label style="color: yellow; font-family: Arial; font-weight: bold; font-size: 22px;">Select a key</label>`
      
      let errmessage =  "WHAT ARE YOU DOING HERE?! I GOT RID OF THE EDIT 𝖣̶𝖤̶𝖲̶𝖢̶𝖱̶𝖨̶𝖯̶𝖳̶𝖨̶𝖮̶𝖭̶ BUTTON(s) FOR A REASON! (or maybe you tried to like, get the description from an invalid array(i dont think i implemented that, but like, i ran it when it tried to get the element with id 'select key' instead of 'descriptionbox' and it gave me this message), either way:) YOU SHOULDN'T BE HERE!!!!!"
      
      document.getElementById('editdescriptionbox')
        .value = errmessage
      document.getElementById('editnamebox')
        .value = errmessage
      document.getElementById('editchildrenbox')
        .value = errmessage

     /* This code is probably redundant now, but i wont delete it incase i need it later.
     if (document.getElementById("editbutton")) {
        document.getElementById("editbutton")
          .style.display = "none";
      }
      if (document.getElementById("editnamebutton")) {
        document.getElementById("editnamebutton")
          .style.display = "none";
      }
      if (document.getElementById("editchildrenbutton")) {
        document.getElementById("editchildrenbutton")
          .style.display = "none";
      }
      */

    } else {
      descholder.innerHTML =
        `<div style="display: flex; overflow-y: auto; align-items: center; justify-content: space-between;">
            <label style="color: yellow; font-family: Arial; font-weight: bold; font-size: 30px;">Name:</label>
            <button onclick="(document.getElementById('testnameeditor')).showModal();" class="editbutton" type="button" style="height: 25px; width: 25px; font-size: 15px;" id="editnamebutton">🖉</button>
        </div>
        <div class="box">
            <label id="namebox" style="color: yellow; font-family: Arial; font-size: 40px; white-space: pre;">`
                + banana() +
            `</label>
        </div>
        <div style="width: auto; height: 3px; background-color: #333; margin: 10px -4px; border-radius: 2px;"></div>
        <div style="display: flex; overflow-y: auto; align-items: center; justify-content: space-between;">
            <label style="color: yellow; font-family: Arial; font-weight: bold; font-size: 30px;">Description:</label>
            <button onclick="(document.getElementById('testeditor')).showModal();" class="editbutton" type="button" style="height: 25px; width: 25px; font-size: 15px;" id="editbutton">🖉</button>
        </div>
        <div class="box">
            <label id="descriptionbox" style="color: yellow; font-family: Arial; white-space: pre;">`
                + path.flatMap((val, i) =>
                  i < path.length - 1 ? [val, "children"] : [val],
                )
                .concat("description")
                .reduce((currentLevel, key) => {
                  return currentLevel && currentLevel[key] !== undefined ?
                    currentLevel[key] :
                    undefined;
                }, dataobj) +
            `</label>
        </div>
        <div style="width: auto; height: 3px; background-color: #333; margin: 10px -4px; border-radius: 2px;"></div>
        <div style="display: flex; overflow-y: auto; align-items: center; justify-content: space-between;">
            <label style="color: yellow; font-family: Arial; font-weight: bold; font-size: 30px;">Parent:</label>`
            + ((path.length < 2) ? "[Um. Well... lack of parents]" : getparentofcurrentkeyasbuttons()) +
        `</div>
        <div style="width: auto; height: 3px; background-color: #333; margin: 10px -4px; border-radius: 2px;"></div>
        <div style="display: flex; overflow-y: auto; align-items: center; justify-content: space-between;">
            <label style="color: yellow; font-family: Arial; font-weight: bold; font-size: 30px;">Children:</label>
            <button onclick="(document.getElementById('testchildreneditor')).showModal();" class="editbutton" type="button" style="height: 25px; width: 25px; font-size: 15px;" id="editchildrenbutton">🖉</button>
        </div>
        <div class="box" style="padding 8px; white-space: pre; display:flex; justify-content: center; align-items: center; flex-direction: column;" id="childrenbox">`
            + getchildrenofcurrentkeyasbuttons() +
        `</div>`;
    
      document.getElementById('editnamebox')
        .value = document.getElementById('namebox')
        .textContent;

      document.getElementById('editnamebox')
        .value = document.getElementById('namebox')
        .textContent;

      document.getElementById('editdescriptionbox')
        .value = document.getElementById('descriptionbox')
        .textContent
    }
  } else {
    descholder.innerHTML = `<label style="color: red; font-weight: bold">path is not valid. this is probably a mistake on my part.          UNLESS YOU CHANGED IT!</label>`
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
  Object.entries(obj)
    .forEach(([key, value], index) => {
      counter++;
      let currentvalue = value
      let gap = [currentlist]
        .join("")
        .replace(/true/g, "&thinsp;&thinsp;&ensp;")
        .replace(/false/g, "│&thinsp;");
      var testcurrpath = [...currpath, key];
      let outerindex = index
      key.split(/\r?\n/)
        .forEach((line, index) => {
          if (index === 0) {
            htmltoreturn =
              htmltoreturn +
              `<label style="color: lime;" data-keyname="${key}">${gap}${Object.keys(obj).length != 0 ? (outerindex === Object.keys(obj).length - 1 ? "└" : "├") : ""}
        <span id="key${counter}">
            <a href="javascript:void(0)" onclick="myFunction(${counter}); setkeypathurl();" class="selectablekey${testcurrpath.length === inputpath.length && testcurrpath.every((val, outerindex) => val === inputpath[outerindex]) ? " selectedkey" : ""}">
                ${line}
            </a>
            <br>
        </span>
        ${(index === key.split(/\r?\n/).length - 1) ? render(inputpath, currentvalue["children"], testcurrpath, currentlist + [outerindex === Object.keys(obj).length - 1], false) : ""}
    </label>`
          } else {
            htmltoreturn =
              htmltoreturn +
              `<label style="color: lime;" data-keyname="${key}">${gap}${Object.keys(obj).length != 0 ? (outerindex === Object.keys(obj).length - 1 ? "&thinsp;&thinsp;&thinsp;" : "│") : ""}
            <a href="javascript:void(0)" onclick="myFunction(${counter}); setkeypathurl();" class="selectablekey${testcurrpath.length === inputpath.length && testcurrpath.every((val, outerindex) => val === inputpath[outerindex]) ? " selectedkey" : ""}">
                ${line}
            </a>
            <br>
        </span>
        ${(index === key.split(/\r?\n/).length - 1) ? render(inputpath, currentvalue["children"], testcurrpath, currentlist + [outerindex === Object.keys(obj).length - 1], false) : ""}
    </label>`
          }
        });

    });

  return htmltoreturn;
}
