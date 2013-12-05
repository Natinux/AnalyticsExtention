/* ========================================================
   UI Handlers functions
   =====================================================
   ===================================================== */


$('.add-button').on('click', function(e){
	$('.add-container').show();
});

function close_add_container(){
	$('.add-container').hide();
}

function add_path(e){
	var name = $('.add-form > p:nth-child(2) > input');
	var path = $('.add-form > p:nth-child(3) > input');

	if(!name.val() || !path.val()){
		alert('Please fill in the form');
		return false;
	}
	pathsList.push({
		id: pathsList.length,
		name: name.val(),
		path: path.val(),
		checked: ''
	});

	refresh_list();
	close_add_container();
	path.val('');
	name.val('');
}

function add_row_settings(e){

	// TODO - restore settings....
	// update user...
	var parent = $(e.currentTarget).parents('section[class*="container"]');
	var code = $('textarea[name=code]').val();
	var row_id = parent.attr('data-row-id');
	if(!!row_id && !!code){
		if(row_id.indexOf('path-') >= 0){
			// add to array
			var i = 0, n = pathsList.length;
			for(; i < n ; i++){
				if(row_id.replace('path-', '') == pathsList[i].id){
					pathsList[i].reloadCode = code;
					break;
				}
			}	
		}else if(row_id == 'reload-cb'){
			localStorage['reload-cb'] = JSON.stringify({
				text: code,
				enabled: false
			});
		}
		
	}
}



function delete_row(e){
	var parent = $(e.currentTarget).parents('li');
	var id = parent.find('input').attr('id');
	parent.remove();

	// remove from array too;
	var i = 0, n = pathsList.length;
	for(; i < n ; i++){
		if(id.replace('path-', '') == pathsList[i].id){
			// delete pathsList[i];
			pathsList.splice(i, 1);
			break;
		}
	}
}

function get_row_info(row_id){
	if(!row_id) return;
	if(row_id === 'reload-cb'){
		return {
			reloadCode:JSON.parse(localStorage['reload-cb']).text
		};
	}
	var i = 0, n = pathsList.length;
	for(; i < n ; i++){
		if(row_id.replace('path-', '') == pathsList[i].id){
			return pathsList[i];
		}
	}
	return;
}

function row_toggle(e){
	var id = $(e.currentTarget).attr('for').replace('path-', '');
	update_list(id, {
		checked: !e.currentTarget.control.checked ? 'checked' : ''
	});
}

function show_row_settings(e){
	var parent = $(e.currentTarget).parents('li');
	var input = parent.find('input');
	var settingsContainer = $('.row-setting-container');
	settingsContainer.attr('data-row-id', input.attr('id'));
	$('.row-setting-container').show();
	var data = get_row_info(input.attr('id'));
	if(!!data){
		$('textarea[name=code]').val(!!data.reloadCode ? data.reloadCode : '');
	}
}

function on_dom_ready(){
	$('.path-list').on('click', '.delete-row', delete_row);
	$('.path-list').on('click', '.add-settings-button', show_row_settings);
	$('.settings-list').on('click', '.add-settings-button', show_row_settings);
	$('.path-list').on('click', '.toggle', row_toggle);
	$('.add-form').on('click', 'input[name=commit]', add_path);
	$('.add-form').on('click', 'input[name=add-row-settings]', add_row_settings);
    $('#save-button').on('click', save);
    $('#clear-button').on('click', clear);
	restore_options();

	$('body').on('click', '.close-button', function(e){
		var parent = $(e.currentTarget).parents('section[class*="container"]');
		if(!!parent) parent.hide();
	});
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
		var deleteEl = $('<a class="delete-row icon-delete" href="#"></a>');
		var dataEl = $('<a href="#" class="icon-setting add-settings-button"></a>');
		var span = $('<span class="row-buttons"></span>');

		span.append(dataEl);
		span.append(deleteEl);

		var liEl = $('<li></li>');
		liEl.append(inputEl);
		liEl.append(lableEl);
		liEl.append(span);
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
	console.log('Saving');
	localStorage['paths-list'] = JSON.stringify(pathsList);
	localStorage['refresh-rate'] = $('input[name=refresh]').val();
	localStorage['next-tab-rate'] = $('input[name=nextTab]').val();
}

function clear(){
    if(confirm("You Sure?\nThis operation can't be undone...")){
        delete localStorage['paths-list'];
        pathsList = [];
        refresh_list();
    }
}

function restore_options() {
  var paths = localStorage['paths-list'];
  if(!paths || !paths.length) return;
  try{
    pathsList = JSON.parse(paths);
    if(typeof pathsList === 'object'){
		refresh_list();
    }else{
		clear();
    }
  }catch (e){
  }

	//==============================
	var refreshRate = localStorage['refresh-rate'];
	if(!!refreshRate){
		$('input[name=refresh]').val(refreshRate);
	}

	//=============================
	var nextTabRate = localStorage['next-tab-rate'];
	if(!!nextTabRate){
		$('input[name=nextTab]').val(nextTabRate);
	}
}

function before_leave(e){
	save();
	return ;
}


var pathsList = [];
document.addEventListener('DOMContentLoaded', on_dom_ready);
//window.addEventListener('beforeunload', before_leave);
