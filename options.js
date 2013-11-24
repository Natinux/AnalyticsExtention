// Restores select box state to saved value from localStorage.
function restore_options() {
  var paths = localStorage['paths'];
  if(!paths) return;
  try{
    paths = JSON.parse(paths);
  }catch (e){
    return;
  }
  

  for (var i = 0; i < paths.length; i++) {
    var name = paths[i].name;
    var path = paths[i].path;
    var checked = paths[i].checked;
    add_path(name, path, {
      isChecked: !!checked
    });
  }
}


function add_path_click(){
  var name = document.getElementById("name-input");
  var path = document.getElementById("path-input");
  var prefix = document.getElementById("google-link");
  if(!name || !path || !prefix || !name.value || !path.value || !prefix.value){
    alert("Please input data");
    return false;
  } 
  if(!!name.value && !!path.value && !!prefix.value){
    name = name.value;
    path = path.value;
    prefix = prefix.value;
  }
  
  add_path(name, prefix + path, {click:true});
  clear_inputs();
    // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Path added.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 1000);
  
}

function clear_inputs(){
  document.getElementById('name-input').value = '';
  document.getElementById('path-input').value = '';
}

var checkboxCounter = [];
function add_path(name, path, opt){
  opt = opt || {};

  var pathList = document.getElementById('path-list-container');
  var input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', 'checkbox-'+checkboxCounter.length);
  input.setAttribute('value', path);
  input.setAttribute('name', name);
  input.setAttribute('class', 'checkbox');

  if(!!opt.isChecked){
    input.setAttribute('checked', true);    
  }

  var aciton = document.createElement('a');
  aciton.setAttribute('htmlFor', 'checkbox-'+checkboxCounter.length);
  aciton.className = 'delete-row';
  aciton.textContent = 'delete';

  
  var label = document.createElement('label');
  label.setAttribute('htmlFor', 'checkbox-'+checkboxCounter.length);
  label.setAttribute('class', 'inline');
  label.appendChild(document.createTextNode(name));

  var breakLine = document.createElement('br');
  breakLine.setAttribute('htmlFor', 'checkbox-'+checkboxCounter.length);

  pathList.appendChild(input);
  pathList.appendChild(label);
  pathList.appendChild(aciton);
  pathList.appendChild(breakLine); 

  checkboxCounter.push({name:name, path:path, rowId: 'checkbox-'+checkboxCounter.length, checked: false});
  if(!!opt && !!opt.click){
    save_state();
  }
}

function path_click(e){
  
  if(!!e && !!e.target && e.target.className === "delete-row"){
    var rowId = e.target.getAttribute('htmlFor');
    remove_row(rowId);
  }
  return false;
}

function remove_row(rowId){
  if(!rowId) return;
  var toRemove = document.querySelectorAll('*[htmlfor="'+rowId+'"]');
  document.getElementById(rowId).remove();
  for (var i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
  }
  
  for (var i = 0; i < checkboxCounter.length; i++) {
    if(checkboxCounter[i].rowId === rowId){
      checkboxCounter.splice(i, 1);
    } 
  }
  save_state();
}

function save_state(){
  var list = [];
  var inputs = $('#path-list-container input').toArray();
  for(var i=0; i < inputs.length; i++){
    list.push({name:inputs[i].name, path:inputs[i].value, rowId: inputs[i].id, checked: inputs[i].checked});
  }
  localStorage['paths'] = JSON.stringify(list);

  var refresh = document.getElementById("refresh-input");
  if(!!refresh && !!refresh.value){
    localStorage['analytics-refresh'] = refresh.value;
  }
}

function save_click(){
  save_state();
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#add-button').addEventListener('click', add_path_click);
document.querySelector('#save-button').addEventListener('click', save_click);
document.querySelector('#path-list-container').addEventListener('click', path_click);