/* ========================================================
   UI Handlers functions
   =====================================================
   ===================================================== */


$('.add-button').on('click', function(e){
	$('.add-container').show();
});

$('.path-header .close-button').on('click', function(e){
	$('.add-container').hide();
});

function add_path(form){
	alert(form[0].name + '-' + form[1].name)
}