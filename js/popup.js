function on_dom_ready(){
	$('button').on('click', btn_clicked);
	port = chrome.extension.connect({ name: "open-tabs-port" });
	port.onMessage.addListener(function (message) {
	});
}

function btn_clicked(e){
	try{
		// TODO -- get the current state from local storage...
		if(e.currentTarget.className == btnStates[0]){
			// start
			e.currentTarget.className = btnStates[1];
			port.postMessage({ type: "start-switcher"});
		}else{
			// stop
			e.currentTarget.className = btnStates[0];
			port.postMessage({ type: "stop-switcher"});
		}
	}catch ( ex ){
		console.log(ex);
	}
}

var port;
var btnStates = ['stopped', 'started'];
document.addEventListener('DOMContentLoaded', on_dom_ready);