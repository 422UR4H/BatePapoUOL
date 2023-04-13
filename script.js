const accessToken = 'JlbBWy24nl0PcbNqcXlASkN2';
const urlBase = 'https://mock-api.driven.com.br/api/vm/uol/';
const urlLogin = urlBase + 'participants';
const urlMsg = urlBase + 'messages';
let nickName;

// axios functions

function init() {
    axios.defaults.headers.common['Authorization'] = accessToken;
}

function initChat(response) {
    document.querySelector('.table-login').classList.add('hidden');
}

function treatAuthUser(error) {
    alert('Infelizmente esse nick já está sendo usado. Tente outro!');
}

function authUser() {
    nickName = document.querySelector('.login input').value;
    let promise = axios.post(urlLogin, {name: nickName});
    
    promise.then(initChat);
    promise.catch(treatAuthUser);
}

function treatSendMsg(error) {
    alert('Infelizmente não foi possível enviar sua mensagem!');
    console.error(error);
}

function sendMsg() {
    const textMsg = document.querySelector('.footer input').value;
    const msg = {
        from: nickName,
        text: textMsg,
        type: "message"
    };
    let promise = axios.post(urlMsg, msg);

    promise.then();
    promise.catch(treatSendMsg);

    // erase value of input
    document.querySelector('.footer input').value = '';
}



// execution of functions

init();