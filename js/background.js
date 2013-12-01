 var ports = {};
 var is_running = false;
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
            case 'get-status':
                get_status();
            break;
        }
    });
});

 function get_status(){
     Object.keys(ports).forEach(function(portId_) {
         ports[portId_].postMessage({ type: "status", running:!!is_running});
     });
 }

var openTab = function(){
    var data = get_options();
    tabList = [];
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

                    chrome.tabs.executeScript(tab.id, {
                            code:'setTimeout(function(){document.querySelector(".account_label_1").style.fontSize="32px";}, 1000);'
                    });
                };
            })(links[i]));
        }

        nextTabRate = parseInt(nextTabRate, 10) || 10;
        nextTabRate *= 1000;
        var currentIndex = 0;
        is_running = true;
        intervalId = setInterval(function(){
            activeTab(tabList[currentIndex++].tabInfo.id);
            if(currentIndex >= tabList.length) currentIndex = 0;
        }, nextTabRate);

        refreshRate = parseInt(refreshRate, 10);
        if(!!refreshRate){
            refreshRate *= 1000;
            refreshIntervalId = setInterval(function(){
                // TODO - Fix this
//                chrome.tabs.query({active:true}, function(tabs){
//                    console.log(tabs);
//                    for(var i=0;i<tabList.length; i++){
//                        if(tabList[i].path === tab)
//                    }
//                });
                for(var i=0;i<tabList.length; i++){
//                    if(currentIndex === i || tabList[i].id === currentActiveTab){
//                        continue;
//                    }
                    console.log("Active tab:"+tabList[i].name);
                    console.log("Current Active tab:"+currentActiveTab);
                    if(false){
                        chrome.tabs.get(tabList[i].tabInfo.id, function(tab){
//                        if(!tab.active){
                            console.log('Refresh tab:'+tab.title);
                            chrome.tabs.reload(tab.id);
//                        }
                        });
                    }
                }
            }, refreshRate);
        }
    }
}

function stop_op(){
    clearInterval(intervalId);
    clearInterval(refreshIntervalId);
    is_running = false;
    var tabs = [];
    for(var i=0;i<tabList.length; i++){
        tabs.push(tabList[i].tabInfo.id);
        console.log('Close tab:'+tabList[i].name);
    }
    chrome.tabs.remove(tabs);
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

var activeTab = function(tabId){
    chrome.tabs.update(tabId, {active:true});
}

var tabList = [];
var intervalId;
var refreshIntervalId;
var currentActiveTab;