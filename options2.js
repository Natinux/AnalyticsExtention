/* ========================================================
   UI Handlers functions
   =====================================================
   ===================================================== */


$('.add-button').on('click', function(e){
	$('.add-container').show();
});

$('.path-header .close-button').on('click', function(e){
	close_add_container();
});

function close_add_container(){
	$('.add-container').hide();
}

function add_path(form){
	if(form.length < 2 || !form[0].value || !form[1].value){
		alert('Please fill in the form');
	}

	pathsList.push({
		id: pathsList.length,
		name: form[0].value,
		path: form[1].value,
		checked: ''
	});

	refresh_list();
	close_add_container();
	form.reset();
}

function delete_row(e){
	var parent = $(e.currentTarget).parent();
	var id = parent.find('input').attr('id');
	parent.remove();

	// remove from array too;
	var i = 0, n = pathsList.length;
	for(; i < n ; i++){
		if(id.replace('path-', '') == pathsList[i].id){
			delete pathsList[i];
			break;
		}
	}
}

function row_toggle(e){
	var id = $(e.currentTarget).attr('for').replace('path-', '');
	// console.log('checked:'+!e.currentTarget.control.checked);
	update_list(id, {
		checked: !e.currentTarget.control.checked ? 'checked' : ''
	});
}

function on_dom_ready(){
	$('.path-list').on('click', '.delete-row', delete_row);
	$('.path-list').on('click', '.toggle', row_toggle);
	restore_options();
}

function refresh_list(){
	var list = $('.path-list');
	// clear list
	list.empty();

	// build from start
	var i = 0, n = pathsList.length;
	for(; i < n ; i++){
		var rowId = 'path-' + pathsList[i].id;
		var inputEl = $('<input type="checkbox" id="' + rowId + '" name="' + pathsList[i].name + '" value="' + pathsList[i].path + '" '+pathsList[i].checked+'/>');
		var lableEl = $('<label class="toggle" for="' + rowId + '"></label>');
		var deleteEl = $('<a class="delete-row icon-delete" href="javascript:void(0);"></a>');

		var liEl = $('<li></li>');
		liEl.append(inputEl);
		liEl.append(lableEl);
		liEl.append(deleteEl);
		liEl.append(pathsList[i].name);

		list.append(liEl);
	}
}

/* ========================================================
   Logic functions
   =====================================================
   ===================================================== */
function update_list(id, opts){
	opts = opts || {};
	var i = 0, n = pathsList.length;
	for(; i < n ; i++){
		if(id == pathsList[i].id){
			pathsList[i].checked = opts.checked || '';
			break;
		}
	}
}

function save(){
	localStorage['paths-list'] = JSON.stringify(pathsList);
	localStorage['refresh-rate'] = JSON.stringify($('input[name=refresh]').val());
	localStorage['next-tab-rate'] = JSON.stringify($('input[name=nextTab]').val());

	// TODO - update the user ...
	// save the refresh value
}

function restore_options() {
  var paths = localStorage['paths-list'];
  if(!paths) return;
  try{
    pathsList = JSON.parse(paths);
    refresh_list();
  }catch (e){
  }

	//==============================
	var refreshRate = localStorage['refresh-rate'];
	if(!!refreshRate){
		$('input[name=refresh]').val(refreshRate);
		console.log("refresh:"+refreshRate);
	}

	//=============================
	var nextTabRate = localStorage['next-tab-rate'];
	if(!!nextTabRate){
		$('input[name=nextTab]').val(nextTabRate);
		console.log('nextTab:'+nextTabRate);
	}
}

function before_leave(e){
	save();
	return ;
}


var pathsList = [];
document.addEventListener('DOMContentLoaded', on_dom_ready);
window.addEventListener('beforeunload', before_leave);
