const APP = 'DEBUG';
const MAXLENGTHTEXT = 250;
window.onload = function () { 
    if (getItemSession('key') === '' || getItemSession('key') === null) addItemSession('key', chiamata_server('key', ' ', 0));
    if (getItemSession('infoUser') === '' && location.pathname != 'index.html') location.href = 'index.html';
}
function checkConnection() {
    if (!navigator.onLine) return false;
    else return true;
}
function chiamata_server(type, info, idHost){
    var result = '';
    var responso = '';
    try{
        var host = ['http://www.gveriello.altervista.org/bitour/api.php', 'http://www.ferrovienordbarese.it/time/real_time/900/p/json'];
        //if (checkConnection()){
        "use strict";
        result = $.ajax({
            type: "GET",
            url: host[idHost],
            data: {
                'tipo': type,
                'data': window.btoa(info) + '=='
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false
        }).responseText;
    }catch(err){
        notify(null, 'Attenzione!', 'Impossibile completare la richiesta al server.', null, null);
    }
    //console.log(host[idHost] + '?tipo='+type+'&data='+window.btoa(info)+'==');
    return result;
    //}else alert('Attenzione: La connessione a internet è indispensabile per effettuare le richieste.');
}
function validEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validPassword(password){
    if (password.length > 5 && password.length < 20) return true;
    else return false;
}
function addItemSession(name, value){
    sessionStorage.setItem(name, value);
}
function getItemSession(name){
    return sessionStorage.getItem(name);
}
function isJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}
function notify(title, subtitle, message, media, type){
    if (type === '' || type === null) type = 'danger';
    $.notify({
        // options
        icon: media,
        title: title,
        message: message,
        url: '',
        target: '_blank'
    },{
        // settings
        element: 'body',
        position: null,
        type: type,
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: false,
        placement: {
            from: "bottom",
            align: "center"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        delay: 5000,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
        template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
        '<span data-notify="icon"></span> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>' 
    });
}
function alertify(title, message){

}
function createCard(type, id, img, title, date, text, link1){
    var card = '';
    
    if (link1 === null) link1 = '';
    card += '<div class="card">';
    card += '<img class="card-img-top" style="width:100%; heigth:100%;" src="'+img+'" alt="Card image cap">';
    card += '<div class="card-body">';
    card += '<h4 class="card-title">' + title + '</h4>';
    card += '<p class="card-text">'+ text +'</p>';
    //card += '<a id="like'+type+'" onClick="javascript:like'+type+'(id);" class="link"></a>';
    //card += '<a onClick="javascript:createPopup(\''+type+'\', \'' + id + '\');" class="link">Leggi di più</a>';
    card += '</div>';
    card += '</div>';
    return card;
}
function likeNotizia(idnotizia){
    //<i class="material-icons">favorite_border</i>
}
