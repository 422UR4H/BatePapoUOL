const accessToken = 'JlbBWy24nl0PcbNqcXlASkN2';
const urlBase = 'https://mock-api.driven.com.br/api/vm/uol/';
const urlLogin = urlBase + 'participants';
const urlMsg = urlBase + 'messages';
const urlStatus = urlBase + 'status';
const timeRequestOnline = 5000;
const timeRequestMsgs = 3000;
const timeRequestUsers = 10000;
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

function offline(error) {
    console.log(error);

    alert('Você foi desconectado');

    clearInterval(idIntervalOnline);
    clearInterval(idIntervalMsgs);
    clearInterval(idIntervalUsers);

    window.location.reload();
}

function privateMsgFromOthers(type, to, from) {
    return type === 'private_message' && to !== nickName && from !== nickName;
}

function renderMsgs(res) {
    const list = document.querySelector('.content');
    let html = '';

    res.data.forEach((msg) => {
        const type = msg.type;

        if (privateMsgFromOthers(type, msg.to, msg.from)) {
            return;
        }

        html += `<li class="msg ${type}" data-test="message">
                    <p><b class="time">(${msg.time}) </b>
                    <strong>${msg.from}</strong>
                `;
        if (type === 'message') {
            html += `para <strong>${msg.to}: </strong>`;
        } else if (type === 'private_message') {
            html += `reservadamente para <strong>${msg.to}: </strong>`;
        }
        html += msg.text + '</p></li>';
    });

    list.innerHTML = html;
    list.lastElementChild.scrollIntoView();
}

function renderRecipient() {
    const contact = document.querySelector('.contacts .selected p').innerHTML;
    const visibility = document.querySelector('.visibility .selected p').innerHTML.toLowerCase();
    document.querySelector('.footer p').innerHTML = `Enviando para ${contact} (${visibility})`;
}

function renderUsers(response) {
    const contactSelected = document.querySelector('.contacts .selected p').innerHTML;
    const userStillOnline = response.data.find((user) => user.name === contactSelected);
    let html = '';

    if (userStillOnline) {
        html = `<div class='item' onclick="selectItem('contacts', this)" data-test="all">
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                    <img src="./images/check.png" alt="">
                </div>`;
    } else {
        html = `<div class='item selected' onclick="selectItem('contacts', this)" data-test="all">
                    <ion-icon name="people"></ion-icon>
                    <p>Todos</p>
                    <img src="./images/check.png" alt="">
                </div>`;
    }

    response.data.forEach((user) => {
        const userName = user.name;

        if (userName === contactSelected) {
            html += `<div class='item selected' onclick="selectItem('contacts', this)" data-test="participant">
                        <ion-icon name="people"></ion-icon>
                        <p>${userName}</p>
                        <img src="./images/check.png" alt="" data-test="check" />
                    </div>`;
        } else if (userName !== nickName) {
            html += `<div class='item' onclick="selectItem('contacts', this)" data-test="participant">
                        <ion-icon name="people"></ion-icon>
                        <p>${userName}</p>
                        <img src="./images/check.png" alt="" data-test="check" />
                    </div>`;
        }
    });
    document.querySelector('.contacts').innerHTML = html;

    renderRecipient();
}

function getMessages() {
    const promise = axios.get(urlMsg);

    promise.then(renderMsgs);
    promise.catch((error) => {
        console.error(error);
        alert('Infelizmente houve um erro ao carregar as mensagens. Tente novamente mais tarde.');
        offline(error);
    });
}

function getUsers() {
    const promise = axios.get(urlLogin);

    promise.then(renderUsers);
    promise.catch((error) => {
        console.error(error);
        alert('Infelizmente houve um erro ao carregar os usuários!');
    });
}

function keepOnline() {
    const promise = axios.post(urlStatus, { name: nickName });
    promise.catch(offline);
}

function authUser() {
    nickName = document.querySelector('.login input').value;
    const promise = axios.post(urlLogin, { name: nickName });

    promise.then(() => {
        getMessages();
        getUsers();

        document.querySelector('.table-login').classList.add('hidden');

        idIntervalOnline = setInterval(keepOnline, timeRequestOnline);
        idIntervalMsgs = setInterval(getMessages, timeRequestMsgs);
        idIntervalUsers = setInterval(getUsers, timeRequestUsers);
    });

    promise.catch((error) => {
        console.error(error);
        if (error.response.status === 400) {
            alert('Infelizmente esse nick já está sendo usado. Tente outro!');
        } else {
            alert('Infelizmente não foi possível acessar o servidor agora. Tente novamente mais tarde!');
        }
    });
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
    const promise = axios.post(urlMsg, msg);

    promise.then(getMessages);
    promise.catch((error) => {
        console.error(error);
        offline(error);
    });

    // erase value of input
    let input = document.querySelector('.footer input');
    input.value = '';
    input.focus();
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

    renderRecipient();
}


// execution of functions

init();

inputMsg.addEventListener("keyup", catchEnterMsg);
inputLogin.addEventListener("keyup", catchEnterLogin);