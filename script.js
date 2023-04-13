const accessToken = 'JlbBWy24nl0PcbNqcXlASkN2';
const urlBase = 'https://mock-api.driven.com.br/api/vm/uol/';
const urlLogin = urlBase + 'participants';
const urlMsg = urlBase + 'messages';
const urlStatus = urlBase + 'status';
const timeRequestOnline = 5000;
const timeRequestMsgs = 3000;
const timeRequestUsers = 10 * 1000;
let idIntervalOnline = 0;
let idIntervalMsgs = 0;
let idIntervalUsers = 0;
let nickName = '';
// bonus
const inputMsg = document.querySelector('.footer input');
const inputLogin = document.querySelector('.login input');


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
        html += res.data[i].text + '</li>';
    }

    list.innerHTML = html;
    list.lastElementChild.scrollIntoView();
}

function treatGetMsgs(error) {
    console.error(error);
    alert('Infelizmente houve um erro ao carregar as mensagens. Tente novamente mais tarde.');
}

function renderUsers(response) {
    let html = `<div class='item selected' onclick="selectItem('contacts', this)">
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                    <img src="./images/check.png" alt="">
                </div>`;

    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i].name;

        html += `<div class='item' onclick="selectItem('contacts', this)">
                    <ion-icon name="people"></ion-icon>
                    <p>${user}</p>
                    <img src="./images/check.png" alt="">
                </div>`;
    }

    document.querySelector('.contacts').innerHTML = html;
}

function treatGetUsers(error) {
    console.error(error);
    alert('Infelizmente houve um erro ao carregar os usuários!');
}

function getMessages() {
    let promise = axios.get(urlMsg);

    promise.then(renderMsgs);
    promise.catch(treatGetMsgs);
}

function getUsers() {
    let promise = axios.get(urlLogin);

    promise.then(renderUsers);
    promise.catch(treatGetUsers);
}

function initChat(response) {
    getMessages();
    getUsers();

    document.querySelector('.table-login').classList.add('hidden');
    
    idIntervalOnline = setInterval(online, timeRequestOnline);
    idIntervalMsgs = setInterval(getMessages, timeRequestMsgs);
    idIntervalUsers = setInterval(getUsers, timeRequestUsers);
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
    let typeMsg = document.querySelector('.visibility .selected p').innerHTML;

    if (typeMsg === "Reservadamente") {
        typeMsg = "private_message";
    } else {
        typeMsg = "message";
    }

    const msg = {
        from: nickName,
        to: document.querySelector('.contacts .selected p').innerHTML,
        text: textMsg,
        type: typeMsg
    };
    let promise = axios.post(urlMsg, msg);

    promise.then(getMessages);
    promise.catch(treatSendMsg);

    // erase value of input
    document.querySelector('.footer input').value = '';
}

// bonus functions

function catchEnterMsg(keyboardEvent) {
    if (keyboardEvent.key === 'Enter') {
        sendMsg();
    }
}

function catchEnterLogin(keyboardEvent) {
    if (keyboardEvent.key === 'Enter') {
        authUser();
    }
}

function toggleSideBar() {
    document.querySelector('.overlay').classList.toggle('hidden');
    document.querySelector('.side-bar').classList.toggle('shown');
}

function selectItem(category, item) {
    document.querySelector(`.${category} .selected`).classList.remove('selected');
    item.classList.add('selected');

    // message below input
    const user = document.querySelector('.contacts .selected p').innerHTML;
    const visibility = document.querySelector('.visibility .selected p').innerHTML.toLowerCase();
    document.querySelector('.footer p').innerHTML = `Enviando para ${user} (${visibility})`;
    
}


// execution of functions

init();

inputMsg.addEventListener("keyup", catchEnterMsg);
inputLogin.addEventListener("keyup", catchEnterLogin);