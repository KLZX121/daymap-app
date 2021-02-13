const fs = require('fs');
const path = require('path');
const g = document.getElementById.bind(document);

const creds = JSON.parse(fs.readFileSync(path.join(__dirname, './credentials.json')));

window.addEventListener('DOMContentLoaded', run);

function run(){
    const username = g('username');
    const password = g('password');

    if (creds.username && creds.password && username){
        username.value = creds.username;
        password.value = creds.password;
    };
    if (username){
        document.getElementsByClassName('btn')[0].onclick = saveAutoLogin;

        function saveAutoLogin(){
            creds.username = username.value;
            creds.password = password.value;

            fs.writeFile(path.join(__dirname, './credentials.json'), JSON.stringify(creds), ()=>{});
        };
    };
};