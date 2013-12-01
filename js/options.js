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

function delete_row(e){
	var parent = $(e.currentTarget).parent();
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
	$('.add-form').on('click', 'input[type=submit]', add_path);
	restore_options();
}

function refresh_list(){
	var list = $('.path-list');
	// clear list
	list.empty();

	// build from start
	var i = 0, n = pathsList.length;
	for(; i < n ; i++){
		// if(!pathsList[i]){
		// 	pathsList.splice(i, 1);
		// 	if(!!pathsList.length){
		// 		i--;
		// 		continue;
		// 	}
		// }
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
	console.log('Saving');
	localStorage['paths-list'] = JSON.stringify(pathsList);
	localStorage['refresh-rate'] = $('input[name=refresh]').val();
	localStorage['next-tab-rate'] = $('input[name=nextTab]').val();
}

function clear(){
	delete localStorage['paths-list'];
	pathsList = [];
	refresh_list();
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
window.addEventListener('beforeunload', before_leave);
