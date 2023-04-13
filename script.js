const accessToken = 'JlbBWy24nl0PcbNqcXlASkN2';
const urlBase = 'https://mock-api.driven.com.br/api/vm/uol/';
const urlLogin = urlBase + 'participants';
const urlMsg = urlBase + 'messages';
const urlStatus = urlBase + 'status';
const timeRequestOnline = 5000;
const timeRequestMsgs = 3000;
let idIntervalOnline = 0;
let idIntervalMsgs = 0;
let nickName = '';

// axios functions

function init() {
    axios.defaults.headers.common['Authorization'] = accessToken;
}

function online() {
    axios.post(urlStatus, { name: nickName });
}

function renderMsgs(res) {
    let list = document.querySelector('.content');
    let html = '';
    
    for (let i = 0; i < res.data.length; i++) {
        let type = res.data[i].type;

        html += `
            <li class="msg ${type}"><p class="time">(${res.data[i].time})&nbsp;&nbsp;</p><p class=nick>${res.data[i].from}&nbsp;</p>
        `;

        switch (type) {
            case 'message' :
                html += `para&nbsp;<p class="nick">${res.data[i].to}</p>:&nbsp;`;
                break;

            case 'private_message' :
                html += `reservadamente para&nbsp;<p class="nick">${res.data[i].to}</p>:&nbsp;`;
                break;
        }
        html += `${res.data[i].text}</li>`;
    }

    list.innerHTML = html;
}

function treatGetMsgs(error) {
    console.error(error);
    alert('Infelizmente houve um erro ao carregar as mensagens. Tente novamente mais tarde.');
}

function getMessages() {
    let promise = axios.get(urlMsg);

    promise.then(renderMsgs);
    promise.catch(treatGetMsgs);
}

function initChat(response) {
    getMessages();
    document.querySelector('.table-login').classList.add('hidden');
    idIntervalOnline = setInterval(online, timeRequestOnline);
    idIntervalMsgs = setInterval(getMessages, timeRequestMsgs);
}

function treatAuthUser(error) {
    console.error(error);
    alert('Infelizmente esse nick já está sendo usado. Tente outro!');
}

function authUser() {
    nickName = document.querySelector('.login input').value;
    let promise = axios.post(urlLogin, { name: nickName });
    
    promise.then(initChat);
    promise.catch(treatAuthUser);
}

function treatSendMsg(error) {
    console.error(error);
    window.location.reload();
}

function sendMsg() {
    const textMsg = document.querySelector('.footer input').value;
    const msg = {
        from: nickName,
        to: "Todos",
        text: textMsg,
        type: "message"
    };
    let promise = axios.post(urlMsg, msg);

    promise.then(getMessages);
    promise.catch(treatSendMsg);

    // erase value of input
    document.querySelector('.footer input').value = '';
}



// execution of functions

init();