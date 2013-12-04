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
                    allTabs[tab.id] = tab;
                    if(!!link.reloadCode){
                        allTabs[tab.id].reloadCode = link.reloadCode;
                    }
                };
            })(links[i]));
        }

        on_update();

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
                chrome.tabs.query({active:tabList.length === 1 ? true : false}, function(tabs){
                    for(var i=0;i<tabList.length; i++){
                        for(var j=0;j<tabs.length; j++){
                            if(tabs[j].id === tabList[i].tabInfo.id){
                                console.log('Refrsh:'+tabs[j].title);
                                chrome.tabs.reload(tabs[j].id);
                            }
                        }
                    }
                });
            }, refreshRate);
        }
    }
}

function on_update(){
    chrome.tabs.onUpdated.addListener(function(/*integer*/ tabId, /*object*/ changeInfo, /*Tab*/ tab){
        if(!!changeInfo && !!changeInfo.status && changeInfo.status === 'complete' && !!allTabs[tab.id]){

            if(!!allTabs[tab.id].reloadCode){
                chrome.tabs.executeScript(tab.id, {
                        code:allTabs[tab.id].reloadCode
                });    
            }
            // TODO - make a global one... too.
            // chrome.tabs.executeScript(tab.id, {
            //         code:'setTimeout(function(){document.querySelector(".account_label_1").style.fontSize="32px";}, 100);'
            // });
        }
    });
}

function get_our_tab_data(){

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
var allTabs = {}; // Q&D workaround....