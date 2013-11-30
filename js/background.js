 var ports = {};
// listening for an event / long-lived connections
chrome.extension.onConnect.addListener(function (port) {
    ports[port.portId_] = port;
    port.onDisconnect.addListener(function(port) {
        delete ports[port.portId_];
    });
    port.onMessage.addListener(function (message) {
        
        switch(port.name) {
            case "open-tabs-port":
                openTab(message);
            break;
        }
    });
});
 
// send a message to the content script
// var colorDivs = function() {
//     chrome.tabs.getSelected(null, function(tab){
//         chrome.tabs.sendMessage(tab.id, {type: "colors-div", color: "#F00"});
//         // setting a badge
//         // chrome.browserAction.setBadgeText({text: "red!"});
//     });
// }

var openTab = function(){
    var data = get_options();
      
    if(!!data){
        var links = data[0];
        var refreshRate = data[1];
        var nextTabRate = data[2];

        for (var i = 0; i < links.length; i++) {
        var name = links[i].name;
        var path = links[i].path;
        var checked = links[i].checked;
        var id = links[i].id;
        
        chrome.tabs.create({url:path},
        function(tab){
            console.log('Opened new tab with id:'+tab.id);
            Object.keys(ports).forEach(function(portId_) {
                ports[portId_].postMessage('New tab ['+tab.id+']');
            });
        });
      }
    }
}

function get_options() {
    var data = [];
  var paths = localStorage['paths-list'];
  if(!paths || !paths.length) return;
  try{
    data.push(JSON.parse(paths));
  }catch (e){
  }

    //==============================
    var refreshRate = localStorage['refresh-rate'];
    if(!!refreshRate){
        data.push(refreshRate);        
    }

    //=============================
    var nextTabRate = localStorage['next-tab-rate'];
    if(!!nextTabRate){
        data.push(nextTabRate);
    }
    return data;
}

var highlightTab = function(tabId){
    chrome.tabs.highlight({tabs:tabId}, function(win){

    });
}

// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//         if(details.url.indexOf('analytics') > 0){
//             details.type = "xmlhttprequest";
//         }
//          return details;
//     },
//     {
//         urls: [
//             "*://*.google.com/analytics/*"
//         ],
//         types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
//     },
//     ["blocking"]
// );


// chrome.webRequest.onHeadersReceived.addListener(function(details){
// 	// console.log(details);
// 	var headers = details.responseHeaders;
//     for(var i = 0; i < details.responseHeaders.length; ++i){
//     	if(details.responseHeaders[i].name.toLowerCase() == 'x-frame-options'){
//     		// details.responseHeaders[i].value = 'text/plain';
//     		// details.responseHeaders[i]
//     		console.log('Removed x-frame-options header.');
//     		headers.splice(i, 1);
//     	}
//     }
//     return {responseHeaders:headers};
// }, {urls: ["<all_urls>"]}, ['blocking', 'responseHeaders']);