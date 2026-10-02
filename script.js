path = [];
let dataobj = {};
let predataobj = {}
let dragCounter = 0;
let counter = 0;
let counterofcurrent = 0
let CLASSES = {};
let descchoosertree = [];
let treecharacteroptiontree = {
  true: {
    true: "└",
    false: "├"
  },
  false: {
    true: "&thinsp;&thinsp;&thinsp;",
    false: "│"
  }
}
const checks = document.createRange()
  .createContextualFragment(`
`);
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

function detectifdropdownshouldbevisible(input) {
  if (input.checked) {
    document.getElementById('dropdownforwheretoappend')
      .style.visibility = 'hidden'
    isreplacechecked = true
  } else {
    isreplacechecked = false
    document.getElementById('dropdownforwheretoappend')
      .style.visibility = 'visible'

  }
}

function getthedropdownmenuforthereplaceandalsotheotherthing() { //i zoned out while writing this, and i have no clue what it was supposed to say 
  if (Object.keys(dataobj)
    .length !== 0) {
    document.getElementById("replaccurrentthingcontainer")
      .style.display = 'flex';
    document.getElementById('dropdownforwheretoappend')
      .style.display = 'inline-block'
  }
}


function getentryatpath(object, pathforkey) {
  for (const i of pathforkey) {
    if (Object.hasOwn(object, i)) {
      object = object[i]
    } else {
      return ("doesnotcontainkey")
    }
  }
  let valueteeeoreturn = {}
  valueteeeoreturn[pathforkey.at(-1)] = object
  return (valueteeeoreturn)
}

function getcommonkeysinjson(object1, object2) {
  return (Object.keys(object1)
    .filter(item => Object.keys(object2)
      .includes(item)))
}

function mergethefileswitheverykey(object1, object2, frontorback = false, attempttomergeclass = true, classname) {
  let commonkeys = getcommonkeysinjson(object1, object2);
  let jsontoreturn = {};
  let gotridofsamekeysinobj2 = {}
  Object.entries(object2)
    .forEach(([keyobj2, valueobj2]) => {
      if (!(commonkeys.includes(keyobj2))) {
        gotridofsamekeysinobj2[keyobj2] = valueobj2
      }
    })
  Object.entries(object1)
    .forEach(([key, value]) => {
      jsontoreturn[key] = value;
      if (commonkeys.includes(key)) {
        if (attempttomergeclass) {
          if (!Object.hasOwn(jsontoreturn[key], 'descriptionvalues')) {
            ((jsontoreturn[key])['descriptionvalues']) = {}
          }
          if (Object.hasOwn(object2[key], 'description')) {
            ((jsontoreturn[key])['descriptionvalues'])[classname] = ((object2[key])['description'])
          }
          if (Object.hasOwn(object2[key], 'descriptionvalues')) {
            Object.entries((object2[key])['descriptionvalues'])
              .forEach(([keytwo, valuetwo]) => {
                if (Object.hasOwn((object2[key])['descriptionvalues'], keytwo)) {
                  ((jsontoreturn[key])['descriptionvalues'])[classname + ' - ' + keytwo] = valuetwo
                } else {
                  ((jsontoreturn[key])['descriptionvalues'])[keytwo] = valuetwo
                }
              })
          }
        }
        (jsontoreturn[key])['children'] = mergethefileswitheverykey((object1[key])['children'], (object2[key])['children'], frontorback, attempttomergeclass, classname)
      } else {

      }
    })
  if (frontorback) {
    jsontoreturn = {
      ...gotridofsamekeysinobj2,
      ...jsontoreturn
    }
  } else {
    jsontoreturn = {
      ...jsontoreturn,
      ...gotridofsamekeysinobj2
    }
  }
  return (jsontoreturn)
}



function loadjsonfilebutlikeactuallydoit__wait_idkifthisisdefinedanywhereelseandiwontcheckbutthisbeingreallylongisprobablynotnescisarry() {
  /* i dont want to keep seeing this cause i already know it works, but i migght break it later so i wotn get rid of it
  console.log('predataobj');
  console.log(predataobj);
  console.log(typeof predataobj);
  console.log('dataobj');
  console.log(dataobj);
  console.log(typeof dataobj); */
  let isreplacechecked = 0


  document.getElementById("oppositeends")
    .append(showjsonbutton);

  if (!document.getElementById("replaccurrentthingcontainer")
    .checkVisibility() || !document.getElementById("replaccurrentthing")) {
    dataobj = predataobj;
  } else {
    detectifdropdownshouldbevisible(document.getElementById("replaccurrentthing"))
    if (isreplacechecked) {
      if (confirm('Warning: this will replace the current tree!\n\nDo you want to continue?')) {
        dataobj = predataobj;
      } else {
        return
      }
    } else {
      switch (document.getElementById("wheretoappend")
        .value) {
        case 'custom':
          alert('i havent implemented this so i am just appending it to the end')
          dataobj = mergethefileswitheverykey(dataobj, predataobj, false, true, 'banana')
          break;
        case 'beginning':
          dataobj = mergethefileswitheverykey(dataobj, predataobj, true, true, 'banana')
          break;
        case 'end':
          dataobj = mergethefileswitheverykey(dataobj, predataobj, false, true, 'banana')
          break;
      }
    }
  }

  if (
    !document.getElementById("dodeletepath")
    .checked ||
    !document.getElementById("dodeletepath")
    .checkVisibility() ||
    !document.getElementById("dodeletepath")
  ) {
    path = [];
  }
  document.getElementById('importmenu')
    .close();
    
  
  addthecustomclasses()
  descchoosertree = getdefaultdesctree(dataobj);
  //debug
  //console.log(descchoosertree)
  setkeypathurl();
  getthedropdownmenuforthereplaceandalsotheotherthing()
}


function getdefaultdesctree(object) {
    let keydesclist = []
    Object.entries(object).forEach(([key,value],index) => {
        if (Object.hasOwn(value,'description')) {
            keydesclist.push('')
        } else if (Object.hasOwn(value,'descriptionvalues')) {
            keydesclist.push(`-` + Object.keys(value['descriptionvalues'])[0])
        } else {
            keydesclist.push(`selectablekey`)
        }
        keydesclist.push(getdefaultdesctree(value['children']))
    })
    return keydesclist.flat();
}

function getdefaultdescobjtree(object, indexcounter = 0) {
    let keydesclist = structuredClone(object);
    Object.entries(keydesclist).forEach(([key,value],index) => {
        indexcounter++
        let currentclass = descchoosertree[indexcounter - 1]
        //debug
        //console.log(currentclass)
        if (currentclass.startsWith('-')) {
            (value)['description'] = value['descriptionvalues'][currentclass.slice(1)]
        } else if (currentclass.length === 0) {
            value['description'] = value['description']
        }
        let subvalue = getdefaultdescobjtree(value['children'], indexcounter)
        value['children'] = subvalue[0]
        indexcounter = subvalue[1]
    })
    return [keydesclist,indexcounter];
}


const dropArea = document.getElementById('importmenu');
const fileInput = document.getElementById('jsonFile');


function checkifstringisvalidsecondpart(importedobject2, currpath = []) {
  Object.entries(importedobject2)
    .forEach(([key, value]) => {
      if (typeof value !== 'object') {
        throw new Error(`Error: is not a json at path:<br>[ ` + [...currpath, key].map(item => `"${item}"`)
          .join(' / ') + ` ]`)
      }

      let hasdesc = false
      let hasattribdesc = false
      let haschild = false
      Object.entries(value)
        .forEach(([keysecond, valuesecong]) => {
          if (keysecond === 'description') {
            if (typeof valuesecong !== 'string') {
              throw new Error(`the value of the 'description' key is not a string at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
                .join(' / ') + ` ]`)
            }
            if (hasdesc) {
              throw new Error(`has multiple 'description' keys at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
                .join(' / ') + ` ]`)
            }
            hasdesc = true
          } else if (keysecond === 'descriptionvalues') {
            if (typeof valuesecong !== 'object') {
              throw new Error(`the value of the 'descriptionvalues' key is not a json object at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
                .join(' / ') + ` ]`)
            }
            if (hasattribdesc) {
              throw new Error(`has multiple 'descriptionvalues' keys at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
                .join(' / ') + ` ]`)
            }
            Object.entries(valuesecong)
              .forEach(([keythird, valuethird]) => {
                if (typeof valuethird !== 'string') {
                  throw new Error(`the value of the [Subdesc] is not a string at path:\n[ ` + [...currpath, key, "descriptionvalues", keythird].map(item => `"${item}"`)
                    .join(' / ') + ` ]`)
                }
              })
            hasattribdesc = true
          } else if (keysecond === 'children') {
            if (typeof valuesecong !== 'object') {
              throw new Error(`the value of the 'children' key is not a json object at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
                .join(' / ') + ` ]`)
            }
            try {
              checkifstringisvalidsecondpart(valuesecong, [...currpath, key])
            } catch (error) {
              throw new Error(error.message)
            }
            if (haschild) {
              throw new Error(`has multiple 'children' keys at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
                .join(' / ') + ` ]`)
            }
            haschild = true
          } else {
            throw new Error(`has a subkey that was not 'description', 'descriptionvalues', or 'children' at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
              .join(' / ') + ` ]`)
          }
        })
      if (!hasdesc && !hasattribdesc) {
        throw new Error(`lacks a 'description' and/or a 'descriptionvalues' subkey at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
          .join(' / ') + ` ]`)
      } else if (!haschild) {
        throw new Error(`lacks a 'children' subkey at path:\n[ ` + [...currpath, key].map(item => `"${item}"`)
          .join(' / ') + ` ]`)
      }
    })
}

function checkifstringisvalid(importedobject) {
  document.getElementById('errorfortheimporttextbox')
    .style.color = "red";
  document.getElementById("Importfromtext")
    .disabled = true;
  document.getElementById("beutifyimportjson")
    .disabled = true;
  if (typeof importedobject === 'string') {
    try {
      importedobject = JSON.parse(importedobject)
      document.getElementById("beutifyimportjson")
        .disabled = false;
    } catch(error) {
      document.getElementById('errorfortheimporttextbox')
        .textContent = `string is not a valid json:\n${error.message.replace('at position','\nPos:')}`
      return
    }
  } else if (typeof importedobject !== 'object') {
    document.getElementById('errorfortheimporttextbox')
      .textContent = 'not a valid json object'
    return
  } else if (typeof importedobject === 'object') {
    document.getElementById("beutifyimportjson")
      .disabled = false;
  }
  try {
    checkifstringisvalidsecondpart(importedobject.tree)
    document.getElementById("Importfromtext")
      .disabled = false;
    document.getElementById('errorfortheimporttextbox')
      .style.color = "green";
    document.getElementById('errorfortheimporttextbox')
      .textContent = 'valid json!'
  } catch (error) {
    document.getElementById('errorfortheimporttextbox')
      .textContent = error.message
  }
}

document.getElementById("jsonimporttextbox")
  .addEventListener("input", function() {
    checkifstringisvalid(document.getElementById('jsonimporttextbox')
      .value)
  });




function processFile(file) {
  if (!file) return;
  const jsonreader = new FileReader();
  jsonreader.onload = function(e) {
      
      const fileString = e.target.result;
    try {
      predataobj = JSON.parse(fileString);
      document.getElementById('jsonimporttextbox')
        .value = JSON.stringify(predataobj, null, 2);
      checkifstringisvalid(JSON.parse(document.getElementById('jsonimporttextbox')
        .value))
    } catch (error) {
        predataobj = fileString;
      document.getElementById('jsonimporttextbox')
        .value = predataobj;
      checkifstringisvalid(document.getElementById('jsonimporttextbox')
        .value)
        // i dont know why i didn't add this earlier, it just gave me a console error when it was invalid, and didn't import it.
      // console.error("Error parsing JSON. Make sure the file is valid.", error);
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
window.addEventListener('dragover', function(e) {
  if ([...e.dataTransfer.items].some(item => item.kind === 'file')) {

    e.preventDefault();
    e.stopPropagation();
    document.getElementById('testingthedragovermenu')
      .showPopover();
  }
});
window.addEventListener('dragenter', function(e) {
  dragCounter++;
  if (dragCounter === 1) {
    if ([...e.dataTransfer.items].some(item => item.kind === 'file')) {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('testingthedragovermenu')
        .showPopover();
    }
  }
});
window.addEventListener('dragleave', function(e) {
  dragCounter--;
  if (dragCounter === 0) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('testingthedragovermenu')
      .hidePopover();
  }
});

// Handling dropping files into the area
window.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('testingthedragovermenu')
    .hidePopover();

  // Getting the list of dragged files


  // Checking if there are any files
  if (e.dataTransfer.files.length) {
    // Assigning the files to the hidden input from the first step
    document.getElementById('jsonFile')
      .files = e.dataTransfer.files;
    const file = e.dataTransfer.files[0];
    processFile(file);
  }
});




document.getElementById('replaccurrentthing')
  .addEventListener('change', function(event) {
    detectifdropdownshouldbevisible(event.target)
  })


function editdecripion() {
  let temppath = path.flatMap((val, i) =>
      i < path.length - 1 ? [val, "children"] : [val],
    )
    .concat("description")
  let descorattribdesc = 0
  const deepTarget = temppath.slice(0, (temppath.length - 1))
    .reduce((currentDepth, key) => {
      if (key === 'description') {
        if (!(key in currentDepth)) {
          console.error('... this is probably your fault for editing dataobj or path while editing an the description');
        }
        return currentDepth[key];
      } else if (key === 'descriptionvalues') {
        if (!(key in currentDepth)) {
          console.error('... this is probably your fault for editing dataobj or path while editing an the description');
        }
        return currentDepth['descriptionvalues'][Object.keys(currentDepth['descriptionvalues'])[0]];
      }
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
  let movethedescsindataobj = getdefaultdescobjtree(dataobj)[0];
  let currentchildren = path.flatMap((val, i) =>
      i < path.length - 1 ? [val, "children"] : [val],
    )
    .concat("children")
    .reduce((currentLevel, key) => {
      return currentLevel && currentLevel[key] !== undefined ?
        currentLevel[key] :
        undefined;
    }, movethedescsindataobj)
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
  let trueinsertvalue = ''
  if (currentparent.hasOwnProperty('description')) {
    let sliceidx1 = (currentparent["description"])
      .indexOf("\n")
    let sliceidx2 = (currentparent.description)
      .indexOf("\n", sliceidx1 = -1 ? currentparent.description.length : sliceidx1 + 1)
    let insertvalue = (currentparent.description.slice(0, sliceidx2 = -1 ? currentparent.description.length : sliceidx2))
      .slice(0, 60)
    trueinsertvalue = `` + insertvalue + (insertvalue.length === currentparent.description.length ? '' : '...')
  } else if (currentparent.hasOwnProperty('descriptionvalues')) {
    let sliceidx1 = (currentparent["descriptionvalues"][Object.keys(currentparent["descriptionvalues"])[0]])
      .indexOf("\n")
    let sliceidx2 = (currentparent["descriptionvalues"][Object.keys(currentparent["descriptionvalues"])[0]])
      .indexOf("\n", sliceidx1 = -1 ? currentparent["descriptionvalues"][Object.keys(currentparent["descriptionvalues"])[0]].length : sliceidx1 + 1)
    let insertvalue = `` + (currentparent["descriptionvalues"][Object.keys(currentparent["descriptionvalues"])[0]].slice(0, sliceidx2 = -1 ? currentparent["descriptionvalues"][Object.keys(currentparent["descriptionvalues"])[0]].length : sliceidx2))
      .slice(0, 60)
    trueinsertvalue = `` + insertvalue + (insertvalue.length === currentparent["descriptionvalues"][Object.keys(currentparent["descriptionvalues"])[0]].length ? '' : '...')
  } else {
    console.error('...this is probably your fault for editing the json manually in the console or something to get rid of a description key. i might change this at some point to have a fallback of just making a description key that is blank')
  }
  valuetoreturn = `<div id="parent" style="display: flex; flex-direction: column;">
  <button class="childrenpath" onclick="path.pop(); setkeypathurl();" style="flex: 1; display: flex; flex-direction: column;">
    <label style="font-size: 20px;">${parentkey}</label>
    <label style="font-size: 8px; display: inline-block; color: #fffd6ee9">${trueinsertvalue}</label>
  </button>`




  valuetoreturn = valuetoreturn + "</div>"
  return valuetoreturn
}
function updatdesignofdrpdwn(element) {
  const selectElement = element.querySelector('selectedcontent')
  const selectedClass = element.options[element.selectedIndex].className
  selectElement.className = selectedClass;
}
      
document.getElementById('whatdesctoshow').addEventListener('change', (event) => {
  updatdesignofdrpdwn(event.target);
  settreefrom(event.target);
  setkeypathurl();
  updatdesignofdrpdwn(event.target);
});


function updatewhatdesctoshow() {
let setthewhatdesctoshowto = `
<button>
  <selectedcontent></selectedcontent>
</button>
`;
    let objectimportantthings = path.flatMap((val, i) =>i < path.length - 1 ? [val, "children"] : [val],).reduce((currentLevel, key) => {
          
          return currentLevel && currentLevel[key] !== undefined ? currentLevel[key] : undefined;
        }, dataobj);
        Object.entries(objectimportantthings).forEach(([key,value]) => {
        if (key === 'description') {
            setthewhatdesctoshowto = setthewhatdesctoshowto + `<option class="selectableoption" value="Default Description">Default Description</option>`;
          } else if (key === 'descriptionvalues') {
              Object.keys(value).forEach((classthing) => {
              setthewhatdesctoshowto = setthewhatdesctoshowto + `<option class="customoption-${classthing}" value="customselectedkey-${classthing}">${classthing}</option>`;
              });
          }
        });
        
        return setthewhatdesctoshowto;
    
}

function settreefrom(element){
    const selectedClass = element.value
    if (selectedClass === 'Default Description') {
    descchoosertree[counterofcurrent - 1] = ''
  } else if (selectedClass.startsWith('customselectedkey-')) {
    descchoosertree[counterofcurrent - 1] = selectedClass.slice('customselectedkey'.length)
    console.log(selectedClass);
    console.log(descchoosertree);
  }
}
function setelementfrom(element){
    if (descchoosertree[counterofcurrent - 1] === '') {
    element.value = 'Default Description'
  } else if (descchoosertree[counterofcurrent - 1].startsWith('-')) {
    element.value = `customselectedkey` + descchoosertree[counterofcurrent - 1]
  }
}



function setkeypathurl() {
  const listofkeys = document.getElementById("listofkeys");
  counter = 0;
  if (Object.keys(dataobj).length === 0) {
      document.getElementById('usrmsg').textContent = 'Import or add new keys'
      document.getElementById('usrmsg').style.color = 'orange'
      document.getElementById('usrmsg').style.display = 'block'
  } else {
  listofkeys.innerHTML = render(path, dataobj);
  if (Array.isArray(path)) {
    if (path.length === 0) {
      document.getElementById('usrmsg').textContent = 'Select a key'
      document.getElementById('usrmsg').style.color = 'yellow'
      document.getElementById('usrmsg').style.display = 'block'
      document.getElementById('keyinfoholder').style.display = 'none'

      let errmessage = "WHAT ARE YOU DOING HERE?! I GOT RID OF THE EDIT 𝖣̶𝖤̶𝖲̶𝖢̶𝖱̶𝖨̶𝖯̶𝖳̶𝖨̶𝖮̶𝖭̶ BUTTON(s) FOR A REASON! (or maybe you tried to like, get the description from an invalid array(i dont think i implemented that, but like, i ran it when it tried to get the element with id 'select key' instead of 'descriptionbox' and it gave me this message), either way:) YOU SHOULDN'T BE HERE!!!!!"

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
      document.getElementById('usrmsg').style.display = 'none'
      document.getElementById('keyinfoholder').style.display = 'block'
      
      
    document.getElementById('whatdesctoshow').innerHTML = updatewhatdesctoshow();

    
    
    
        document.getElementById('namebox').textContent = banana()
        document.getElementById('descriptionbox').textContent = path.flatMap((val, i) =>
          i < path.length - 1 ? [val, "children"] : [val],
        ).concat("description").reduce((currentLevel, key) => {
          if (key === 'description' && !(currentLevel && currentLevel[key] !== undefined)) {
            if (key === 'description' && !(currentLevel && currentLevel['descriptionvalues'] !== undefined)) {
              console.error('...this is probably your fault for editing the json manually in the console or something to get rid of a description key. i might change this at some point to have a fallback of just making a description key that is blank')
            } else {
              return currentLevel && currentLevel['descriptionvalues'][Object.keys(currentLevel['descriptionvalues'])[0]] !== undefined ?
                currentLevel['descriptionvalues'][Object.keys(currentLevel['descriptionvalues'])[0]] :
                undefined;
            }
          }
          return currentLevel && currentLevel[key] !== undefined ? currentLevel[key] : undefined;
        }, getdefaultdescobjtree(dataobj)[0])
        document.getElementById('parentbox').innerHTML = ((path.length < 2) ? "[Um. Well... lack of parents]" : getparentofcurrentkeyasbuttons())
        document.getElementById('childrenbox').innerHTML = getchildrenofcurrentkeyasbuttons()


  setelementfrom(document.getElementById('whatdesctoshow'));

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
    document.getElementById('usrmsg').style.display = 'block'
    document.getElementById('usrmsg').textContent = 'path is not valid. this is probably a mistake on my part.          UNLESS YOU CHANGED IT!'
      document.getElementById('usrmsg').style.color = 'red'
      document.getElementById('keyinfoholder').style.display = 'none'
  }
  }
}




function addthecustomclasses() {
    let dafaultcolors = '#55eeee'
let selectedcolor = 'magenta'
  let style = ""
  if (document.getElementById("CLASSLIST") === null) {
    style = document.createElement("style");
    style.id = 'CLASSLIST'
  } else {
    style = document.getElementById("CLASSLIST");
  }
  let seenbase = false
  Object.entries(CLASSES)
    .forEach(([key, value]) => {
      if (value['isbase'] && !seenbase) {
        style.textContent = style.textContent + `.selectablekey:link {
  overflow: auto;
  color: `
        if (Object.hasOwn(value, 'keycolor')) {
          style.textContent = style.textContent + `${value['keycolor']};`
        } else {
          style.textContent = style.textContent + `#55eeee;`
        }
        if (Object.hasOwn(value, 'font-family')) {
          style.textContent = style.textContent + `font-family: ${value['font-family']};`
        } else {
          style.textContent = style.textContent + `font-family: Arial;`
        }
        style.textContent = style.textContent + `
}
`
        style.textContent = style.textContent + `.selectedkey:link {
  font-weight: bold;
  color: `
        if (Object.hasOwn(value, 'selectedkeycolor')) {
          style.textContent = style.textContent + `${value['selectedkeycolor']};`
        } else {
          style.textContent = style.textContent + `magenta;`
        }
        style.textContent = style.textContent + `
}
`
        seenbase = true
        
        
        
style.textContent = style.textContent + `.selectableoption {
  overflow: auto;
  font-family: `
if (Object.hasOwn(value, 'font-family')) {
          style.textContent = style.textContent + `${value['font-family']};`
        } else {
          style.textContent = style.textContent + `Arial;`
        }

style.textContent = style.textContent + `      
  background: linear-gradient(to bottom`
if (Object.hasOwn(value, 'keycolor')) {
        style.textContent = style.textContent + `, ${value['keycolor']} 50%`
    dafaultcolors = value['keycolor']
} else {
    style.textContent = style.textContent + `, #55eeee 50%`
}
 if (Object.hasOwn(value, 'selectedkeycolor')) {
        style.textContent = style.textContent + `, ${value['selectedkeycolor']} 50%`
  selectedcolor = value['selectedkeycolor']
} else {
    style.textContent = style.textContent + `, magenta 50%`
}
        style.textContent = style.textContent + `);
  color: transparent;
  background-clip: text;
}
.selectableoption:hover {
    
}`
        
        
        
        
        
      }
  if (!seenbase) {
    style.textContent = style.textContent + `.selectablekey:link {
  overflow: auto;
  color: #55eeee;
  font-family: Arial;
}
.selectedkey:link {
  font-weight: bold;
  color: magenta;
}
.selectableoption {
  overflow: auto;
  font-family: Arial;
  background: linear-gradient(to bottom, #55eeee 50%, magenta 50%);
  color: transparent;
  background-clip: text;
}
`
let dafaultcolors = '#55eeee'
let selectedcolor = 'magenta'
  }
    })
          console.log(CLASSES);
Object.entries(CLASSES)
    .forEach(([key, value]) => {          
style.textContent = style.textContent + `.customoption-${key} {`
        if (Object.hasOwn(value, 'font-family')) {
          style.textContent = style.textContent + `
  font-family: ${value['font-family']};`
        }
style.textContent = style.textContent + `      
  background: linear-gradient(to bottom`
if (Object.hasOwn(value, 'keycolor')) {
        style.textContent = style.textContent + `, ${value['keycolor']} 50%`
} else {
    style.textContent = style.textContent + `, ${dafaultcolors} 50%`
}
 if (Object.hasOwn(value, 'selectedkeycolor')) {
        style.textContent = style.textContent + `, ${value['selectedkeycolor']} 50%`
} else {
    style.textContent = style.textContent + `, ${selectedcolor} 50%`
}
        style.textContent = style.textContent + `);
  color: transparent;
  background-clip: text;
}
`;

          
          
          
          
          
style.textContent = style.textContent + `.customkey-${key}:link {`
        if (Object.hasOwn(value, 'keycolor')) {
          style.textContent = style.textContent + `
  color: ${value['keycolor']};`
        } else {
          style.textContent = style.textContent + `
  color: ${dafaultcolors};`
        }
        if (Object.hasOwn(value, 'font-family')) {
          style.textContent = style.textContent + `
  font-family: ${value['font-family']};`
        }
        style.textContent = style.textContent + `
}
.customkeyselected-${key}:link {`
        if (Object.hasOwn(value, 'selectedkeycolor')) {
          style.textContent = style.textContent + `
  color: ${value['selectedkeycolor']};`
        } else {
            style.textContent = style.textContent + `
  color: ${selectedcolor};`
        }
        style.textContent = style.textContent + `
}
`;
    });


  document.head.appendChild(style);
  //debug
  //console.log('AHHHHH')
  //console.log(style.textContent)
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
      var testcurrpathbutasastring = testcurrpath.map(item => `"${item}"`)
        .join(' / ')
      let outerindex = index
      key.split(/\r?\n/)
        .forEach((line, index) => {
          let isselectedkey = testcurrpath.length === inputpath.length && testcurrpath.every((val, outerindex) => val === inputpath[outerindex])
          htmltoreturn = htmltoreturn + `<label style="color: lime;" data-keyname="${key}">${gap}`
          if (Object.keys(obj)
            .length != 0) {
            //if i am being honest, i genuinely forgot what these actually are, so these variable names will have to do.
            let isstartoflist = treecharacteroptiontree[index === 0]
            let isnewline = isstartoflist[outerindex === (Object.keys(obj)
              .length - 1)]
            htmltoreturn = htmltoreturn + isnewline
          }
          if (index === 0) {
            htmltoreturn = htmltoreturn + `<span id="key${counter}">`
          }
          
          htmltoreturn = htmltoreturn + `<a href="javascript:void(0)" onclick="myFunction(${counter}); settreefrom(document.getElementById('whatdesctoshow')); setkeypathurl(); updatdesignofdrpdwn(document.getElementById('whatdesctoshow'));" class="selectablekey`
          if (isselectedkey) {
            counterofcurrent = counter
            htmltoreturn = htmltoreturn + ' selectedkey'
          }
          
          
          let classnamefromtree = descchoosertree[counter - 1]
          console.log(classnamefromtree);
          if (classnamefromtree.startsWith('-') && classnamefromtree.length !== 0) {
            htmltoreturn = htmltoreturn + ` customkey${classnamefromtree}`

            if (isselectedkey) {
              htmltoreturn = htmltoreturn + ` customkeyselected${classnamefromtree}`
            }
        }



          htmltoreturn = htmltoreturn + `">
                ${line}
            </a>
            <br>
        </span>
        ${(index === key.split(/\r?\n/).length - 1) ? render(inputpath, currentvalue["children"], testcurrpath, currentlist + [outerindex === Object.keys(obj).length - 1], false) : ""}
    </label>`
        });

    });

  return htmltoreturn;
}
