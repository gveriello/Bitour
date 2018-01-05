

if (getItemSession('infoUser') != '' && getItemSession('infoUser') != null){
    location.href = 'dashboard_user.html';
}

function user_login(){
    $('#loginPopup').modal('hide');
    var email = '';
    var password = '';
    var input = '';
    var responso = '';
    if (getItemSession('key') !== ''){
        email = document.getElementById("txtEmailL").value.trim();
        password = document.getElementById("txtPasswordL").value.trim();
        if(email !== '' && password !== ''){
            if (validEmail(email)){
                if (validPassword(password)){
                    input = [getItemSession('key'), email, password];
                    token = chiamata_server('getToken', JSON.stringify(input), 0);
                    input[3] = token;
                    responso = '';
                    responso = chiamata_server('login', JSON.stringify(input), 0);
                    if (isJson(responso)){
                        responso = JSON.parse(responso);
                        if (responso.info.status === 'success'){
                            addItemSession('infoUser', JSON.stringify(responso));
                            location.href = 'dashboard_user.html';
                        }else{
                            notify(null, 'Attenzione!', responso.info.messaggio, null, null);
                            navigator.vibrate(3000);
                        }
                    }else{
                        notify(null, 'Attenzione!', 'Impossibile completare la richiesta.', null, null);
                        navigator.vibrate(3000);
                    }
                }else{
                    notify(null, 'Attenzione!', 'La password deve avere dai 5 ai 20 caratteri.', null, null);
                    navigator.vibrate(3000);
                }
            }else{
                notify(null, 'Attenzione!', "L' e-mail non è valida.", null, null);
                navigator.vibrate(3000);
            }
        }else{
            notify(null, 'Attenzione!', 'I campi sono tutti obbligatori.', null, null);
            navigator.vibrate(3000);
        }
    }
}
function user_register(){
    $('#registerPopup').modal('hide');
    var nome = '';
    var cognome = '';
    var email = '';
    var password = '';
    var conferma_password = '';
    var input = '';
    var responso = '';
    if (getItemSession('key') !== ''){
        nome = document.getElementById("txtNomeR").value.trim();
        cognome = document.getElementById("txtCognomeR").value.trim();
        email = document.getElementById("txtEmailR").value.trim();
        password = document.getElementById("txtPasswordR").value.trim();
        conferma_password = document.getElementById("txtConfermaPasswordR").value.trim();
        if(email !== '' && password !== '' && nome !== '' && cognome !== '' && conferma_password !== ''){
            if (validEmail(email)){
                if (validPassword(password)){
                    if (conferma_password === password){
                        input = [getItemSession('key'), email, password, nome, cognome];
                        token = chiamata_server('getToken', JSON.stringify(input), 0);
                        input[5] = token;
                        responso = chiamata_server('register', JSON.stringify(input), 0);
                        console.log(responso);
                        if (isJson(responso)){
                            responso = JSON.parse(responso);
                            if (responso.info.status === 'success'){
                                notify(null, 'Attenzione!', 'Benvenuto in Bitour!', null);
                            }else{
                                notify(null, 'Attenzione!', responso.info.messaggio, null, null);
                                navigator.vibrate(3000);
                            }
                        }else{
                            notify(null, 'Attenzione!', 'Impossibile completare la richiesta.', null, null);
                            navigator.vibrate(3000);
                        }
                    }else{
                        notify(null, 'Attenzione!', 'Le due password devono essere uguali.', null, null);
                        navigator.vibrate(3000);
                    }
                }else{
                    notify(null, 'Attenzione!', 'La password deve avere dai 5 ai 20 caratteri.', null, null);
                    navigator.vibrate(3000);
                }
            }else{
                notify(null, 'Attenzione!', "L' e-mail non è valida.", null, null);
                navigator.vibrate(3000);
            }
        }else{
            notify(null, 'Attenzione!', 'I campi sono tutti obbligatori.', null, null);
            navigator.vibrate(3000);
        }
    }
}

