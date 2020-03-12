let connText = document.getElementById('connStatus');
let serverTimeText = document.getElementById('serverTime');
let apiList = document.getElementById('apiList');
let cmdText = document.getElementById('revCmd');
let dataText = document.getElementById('msg');

let cmdAPI = document.getElementById('cmdAPI');
let dataAPI = document.getElementById('dataAPI');
let sendAPI = document.getElementById('sendAPI');

let ws;        

//############################################
// websocket handler                        ##
//############################################

function connect() {

    ws = new WebSocket("ws://127.0.0.1:6789/");

    ws.onopen= function() { 
        console.log('websocket in renderer connected')
        handleConn(true);
    };

    ws.onmessage = function (event) {
        cmdText.innerHTML = event.data;
        let dataset = JSON.parse(event.data);
        let cmd = dataset.cmd;
        let data = dataset.data;
        try{
            switch(cmd){
                case 'getServerTime':
                    serverTimeText.innerHTML = data;
                    break;
                case 'reply_api':
                    genAPI(data);
                    break;
                case 'reply_getServerTime':
                    dataText.innerHTML = data;
                    break;
                case 'echo':
                    dataText.innerHTML = data;
                    break;
                case 'showImage':
                    dataText.innerHTML = '';
                    let image = document.createElement("img")
                    image.src = 'data:image/jpg;base64,' + data;
                    dataText.appendChild(image);
                    break;
                case 'serverPushText':
                    dataText.innerHTML = data;
                    break;
            }
        }catch(e){
            console.error(e)
        }
        
    };

    ws.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function() {
        connect();
        }, 1000);
        handleConn(false);
    };

    ws.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        ws.close();
        handleConn(false);
        
    };
}

connect();

//############################################
// event listener                           ##
//############################################

sendAPI.addEventListener('click', ()=>{
    let msg = JSON.stringify({cmd:cmdAPI.value, data:dataAPI.value})
    ws.send(msg);
})

//############################################
// functions                                ##
//############################################
function handleConn(conn=false){
    if (conn){
        connText.classList.remove('connOK');
        connText.classList.add('connOK');
        connText.innerText = 'connected'
        // request API list
        let msg = JSON.stringify({cmd:'get_api', data:''})
        ws.send(msg);
    }else{
        connText.classList.remove('connOK');
        connText.innerText = 'disconnected'
    }
}

function genAPI(apiString){
    let api_list = apiString.split(',');
    let createAPI = '';
    api_list.forEach(element => {
        createAPI+=`<li>${element}</li>`
    });

    apiList.innerHTML = createAPI;

}