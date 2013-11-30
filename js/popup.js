function on_dom_ready(){
	$('button').on('click', btn_clicked);
}

function btn_clicked(e){
	try{
		// TODO -- get the current state from local storage...
		if(e.currentTarget.className == btnStates[0]){
			// start
			e.currentTarget.className = btnStates[1];
			chrome.extension.sendMessage({
				type: "start-open-tabs"
			});
		}else{
			// stop
			e.currentTarget.className = btnStates[0];
			chrome.extension.sendMessage({
				type: "stop-open-tabs"
			});
		}
	}catch ( ex ){
		console.log(ex);
	}
}

var btnStates = ['stopped', 'started'];
document.addEventListener('DOMContentLoaded', on_dom_ready);