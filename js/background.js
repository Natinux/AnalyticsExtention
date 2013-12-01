 var ports = {};
// listening for an event / long-lived connections
chrome.extension.onConnect.addListener(function (port) {
    ports[port.portId_] = port;
    port.onDisconnect.addListener(function(port) {
        delete ports[port.portId_];
    });
    port.onMessage.addListener(function (message) {
        
        switch(message.type){
            case "start-switcher":
                openTab();
            break;
            case 'stop-switcher':
                stop_op();
            break;
        }
    });
});

var openTab = function(){
    var data = get_options();
      
    if(!!data){
        var links = data[0];
        var refreshRate = data[1];
        var nextTabRate = data[2];

        for (var i = 0; i < links.length; i++) {
            var path = links[i].path;
            if(!links[i].checked) continue;

            chrome.tabs.create({url:path},(function(link){
                return function(tab){
                    console.log('Opened new tab with id:'+tab.id + ' with name:'+link.name);
                    link.tabInfo = tab;
                    tabList.push(link);
                };
            })(links[i]));
        }

        nextTabRate = parseInt(nextTabRate, 10) || 10;
        nextTabRate *= 1000;
        var currentIndex = 0;
        intervalId = setInterval(function(){
            localStorage['status'] = 'running';
            chrome.tabs.update(tabList[currentIndex++].tabInfo.id,
            {
                active:true
            });
            if(currentIndex >= tabList.length) currentIndex = 0;
        }, nextTabRate);
    }
}

function stop_op(){
    localStorage['status'] = 'stopped';
    clearInterval(intervalId);
    // chrome.tabs.remove(integer or array of integer tabIds, function callback)
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

var tabList = [];
var intervalId;