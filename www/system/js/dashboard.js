//restituisce la stringa del json delle notizie
function getNotizieJson(){
    var token = '';
    var input = '';
    var valueResponso = '';
    var content_view_notizie = '';
    var responso = '';
    var parameters = '';
    var text = '';
    if (getItemSession('key') != ''){
        input = [getItemSession('key'), getItemSession('key')]; //quando non ho input da passare, passo come parametro la chiave stessa.
        token = chiamata_server('getToken', JSON.stringify(input), 0);
        input[2] = token;
        responso = chiamata_server('getNotizie', JSON.stringify(input), 0);
        if (isJson(responso)){
            return responso;
        }else return null;
    }
}

//restituisce la stringa del json degli eventi
function getEventiJson(){

    var token = '';
    var input = '';
    var valueResponso = '';
    var content_view_eventi = '';
    var responso = '';
    var parameters = '';
    var text = '';

    if (getItemSession('key') != ''){
        input = [getItemSession('key'), getItemSession('key')]; //quando non ho input da passare, passo come parametro la chiave stessa.
        token = chiamata_server('getToken', JSON.stringify(input), 0);
        input[2] = token;
        responso = chiamata_server('getEventi', JSON.stringify(input), 0);
        if (isJson(responso)){
            return responso;
        }else return null;
    }
}

//restituisce in stringa html le notizie
function getNotizieToString(){
    var token = '';
    var input = '';
    var valueResponso = '';
    var content_view_notizie = '';
    var responso = '';
    var parameters = '';
    var text = '';
    if (getItemSession('key') != ''){
        responso = getNotizieJson();
        if (isJson(responso)){
            responso = JSON.parse(responso);
            if (responso.info.status === 'success'){
                valueResponso = responso.info.numvalori;
                if (valueResponso > 0) {
                    parameters = JSON.parse(responso.info.parameters);
                    //console.log(parameters);
                    for (i = 0; i < valueResponso; i++){
                        text = parameters[i].Testo;
                        if (text.length > MAXLENGTHTEXT) text = text.substring(0, MAXLENGTHTEXT) + ' [...]';
                        content_view_notizie += 
                            createCard(
                            'notizia',
                            parameters[i].IDNotizia,
                            parameters[i].Img,
                            parameters[i].Titolo,
                            '<i class="material-icons">face</i> Scritto da ' + parameters[i].Nome + ' ' + parameters[i].Cognome +
                            '<br><i class="material-icons">date_range</i> Scritto il ' + parameters[i].Scritto_il,
                            text,
                            null
                        );
                        content_view_notizie += '<br><br>';
                    }
                    return content_view_notizie;
                }else return 'Nessuna notizia visualizzabile al momento.';
            }else return responso.info.messaggio;
        }else return 'Impossibile completare la richiesta.';
    }

}

//restituisce in stringa html gli eventi
function getEventiToString(){
    var token = '';
    var input = '';
    var valueResponso = '';
    var content_view_eventi = '';
    var responso = '';
    var parameters = '';
    var text = '';

    if (getItemSession('key') != ''){
        responso = getEventiJson();
        if (isJson(responso)){
            responso = JSON.parse(responso);
            if (responso.info.status === 'success'){
                valueResponso = responso.info.numvalori;
                if (valueResponso > 0) {
                    parameters = JSON.parse(responso.info.parameters);
                    //console.log(parameters);
                    for (i = 0; i < valueResponso; i++){
                        text = parameters[i].Testo;
                        if (text.length > MAXLENGTHTEXT) text = text.substring(0, MAXLENGTHTEXT) + ' [...]';
                        content_view_eventi += 
                            createCard(
                            'evento',
                            parameters[i].IDEvento,
                            parameters[i].Img,
                            parameters[i].Titolo,
                            '<i class="material-icons">face</i> Scritto da ' + parameters[i].Nome + ' ' + parameters[i].Cognome +
                            '<br><i class="material-icons">date_range</i> Inizia il ' + parameters[i].DataInizio + ' ' + parameters[i].OraInizio + 
                            '<br><i class="material-icons">date_range</i> Termina il ' + parameters[i].DataFine + ' ' + parameters[i].OraFine ,
                            text,
                            null
                        );
                    }
                    return content_view_eventi;
                }else return 'Nessun evento programmato al momento.';
            }else return responso.info.messaggio;
        }else return 'Impossibile completare la richiesta.';
    }

}
function getTreni(){
    "use strict";
    var result = "";
    $.ajax({
        type: "POST",
        url: "http://www.ferrovienordbarese.it/time/real_time/900/p/json",
        // The key needs to match your method's input parameter (case-sensitive).
        //JSON.stringify({ Data: data })
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){
            result = data;
        },
        error: function(errMsg) {
            result = 'Error';
        }
    });
    return result;
}

function getPuntiRifornimento(){
    var infobenzina = "https://www.infobenzina.com/db/db.php"; //l' url a cui farò richiesta per le pompe di benzina
    "use strict";
    result = "";
    result = $.ajax({
        type: "POST",
        url: infobenzina,
        // The key needs to match your method's input parameter (case-sensitive).
        //JSON.stringify({ Data: data })
        data: {
            'address': '70032 Bitonto BA, Italia',
            'distance_unit':'km',
            'feed':'stores',
            'lat':'41.1078251',
            'lng':'16.691056900000035',
            'max_distance':5,
            'nb_display':50,
            'orderby':'',
            'page_number':1,
            'prd':'p_benz_self',
            'rete':'tutto'
        },
        async: false
    }).responseText;

    //soluzione temporanea per riparare il bug di infoBenzina
    var pattern = /"gestore":""ip services s.r.l.""/;
    result = result.replace(pattern, '"gestore":"ip services s.r.l."');
    return JSON.parse(result);
}
function getPuntiRifornimentoToString(){
    var responso = getPuntiRifornimento();
    var num = 0;
    var div = '';
    num = responso.locations.length;
    //se lo status è success
    if (num > 0){
        var colonne = 0;
        //le seguenti variabili le inizializzo a 9.000 perchè farò il confronto con dei prezzi minori
        var pompaBenzinaE = 9.000; //ci metterò il prezzo della pompa che ha la benzina meno cara
        var pompaGasolioE = 9.000; //ci metterò il prezzo della pompa che ha il diesel meno caro
        var pompaMetanoE = 9.000; //ci metterò il prezzo della pompa che ha il metano meno caro
        var pompaGplE = 9.000; //ci metterò il prezzo della pompa che ha il gpl meno caro

        var iBenzina = 0; //indice della pompa con la benzina meno cara
        var iGasolio = 0; //indice della pompa con il diesel meno caro
        var iGpl = 0; //indice della pompa con il gpl meno caro
        var iMetano = 0; //indice della pompa con il metano meno caro
        for(i = 0; i < num; i++){ //ciclo for che controllerà i prezzi più bassi delle pompe
            if (getBenzSelf(responso, i) > 0 && getBenzSelf(responso, i) < pompaBenzinaE){
                pompaBenzinaE = getBenzSelf(responso, i);
                iBenzina = i;
            }
            if (getGasolioSelf(responso, i) > 0 && getGasolioSelf(responso, i) < pompaGasolioE){
                pompaGasolioE = getGasolioSelf(responso, i);
                iGasolio = i;
            }
            if (getGpl(responso, i) > 0 && getGpl(responso, i) < pompaGplE){
                pompaGplE = getGpl(responso, i);
                iGpl = i;
            }
            if (getMetano(responso, i) > 0 && getMetano(responso, i) < pompaMetanoE){
                pompaMetanoE = getMetano(responso, i);
                iMetano = i;
            }
        }
        i = 0;
        for(i = 0; i < num; i++){
            colonne = 0;
            if (getBenzServito(responso, i) > 0 || getBenzSelf(responso, i) > 0) colonne++;
            if (getGasolioServito(responso, i) > 0 || getGasolioSelf(responso, i) > 0) colonne++;
            if (getGpl(responso, i) > 0) colonne++;
            if (getMetano(responso, i) > 0) colonne++;
            colonne = 12 / colonne;
            div += '<div class="card text-center">';
            div += '<div class="card-block">';
            div += '<h4 class="card-title">'+getCompany(responso, i)+'</h4>';
            div += '<h6 class="card-subtitle text-muted">'+getIndirizzoBenzina(responso, i)+'</h6>';
            div += '<div class="row">'; //apro la riga
            if (getBenzServito(responso, i) > 0 || getBenzSelf(responso, i) > 0){
                div += '<div class="col-xs-'+colonne+'">'; //apro la prima colonna da 3
                if(getBenzServito(responso, i) > 0){
                    div += '<p>benzina servita: €'+getBenzServito(responso, i)+'</p>';
                }
                if (getBenzSelf(responso, i) > 0){
                    if (iBenzina === i){
                        div += '<p style="color: green" data-toggle="tooltip" title="Benzina più economica!">benzina self: €'+getBenzSelf(responso, i)+'</p>';
                    }else{
                        div += '<p>benzina self: €'+getBenzSelf(responso, i)+'</p>';
                    }
                }
                div += '</div>'; //chiudo la prima colonna da 3
            }
            if (getGasolioServito(responso, i) > 0 || getGasolioSelf(responso, i) > 0){
                div += '<div class="col-xs-'+colonne+'">'; //apro la seconda colonna da 3
                if (getGasolioServito(responso, i) > 0){
                    div += '<p>gasolio servito: €'+getGasolioServito(responso, i)+'</p>';
                }
                if (getGasolioSelf(responso, i) > 0){
                    if (iGasolio === i){
                        div += '<p style="color: green" data-toggle="tooltip" title="Gasolio più economico!">gasolio self: €'+getGasolioSelf(responso, i)+'</p>';
                    }else{
                        div += '<p>gasolio self: €'+getGasolioSelf(responso, i)+'</p>';
                    }
                }
                div += '</div>'; //chiudo la seconda colonna da 3
            }
            if (getGpl(responso, i) > 0){
                div += '<div class="col-xs-'+colonne+'">'; //apro la terza colonna da 3
                if (iGpl === i){
                    div += '<p style="color: green" data-toggle="tooltip" title="GPL più economico!">gpl: €'+getGpl(responso, i)+'</p>';
                }else{
                    div += '<p>gpl: €'+getGpl(responso, i)+'</p>';
                }
                div += '</div>'; //chiudo la terza colonna da 3
            }
            if (getMetano(responso, i) > 0){
                div += '<div class="col-xs-'+colonne+'">'; //apro la quarta colonna da 3
                if (iMetano === i){
                    div += '<p style="color: green" data-toggle="tooltip" title="Metano più economico!">metano: €'+getMetano(responso, i)+'</p>';
                }else{
                    div += '<p>metano: €'+getMetano(responso, i)+'</p>';
                }
                div += '</div>'; //chiudo la quarta colonna da 3
            }
            div += '</div>'; //chiudo la riga
            //div += '<a href="infobenzina.html?id='+getIDBenzina(responso, i)+'" class="card-link">I servizi offerti</a>';
            div += '</div>';
            div += '</div>';
            div += '<br><br>';
        }
    }
    return div;
}
function getIDBenzina(responso, i){
    return responso.locations[i].id;
}
function getLat(responso, i){
    return responso.locations[i].lat;
}
function getLong(responso, i){
    return responso.locations[i].lng;
}
function getCompany(responso, i){
    return responso.locations[i].company;
}
function getIndirizzoBenzina(responso, i){
    return responso.locations[i].address;
}
function getImgBenzina(responso, i){
    return 'https://www.infobenzina.com/'+responso.locations[i].marker_icon;
}
function getBenzServito(responso, i){
    return responso.locations[i].p_benz_servito;
}
function getBenzSelf(responso, i){
    return responso.locations[i].p_benz_self;
}
function getGasolioServito(responso, i){
    return responso.locations[i].p_gas_servito;
}
function getGasolioSelf(responso, i){
    return responso.locations[i].p_gas_self;
}
function getGpl(responso, i){
    return responso.locations[i].p_gpl;
}
function getMetano(responso, i){
    return responso.locations[i].p_met;
}
function getUpdate(responso, i){
    return responso.locations[i].updated_s;
}
function getMap(responso, i){
    return responso.markersContent[0];
}
function getBenzinaIcon(){
    return 'http://www.gveriello.altervista.org/accesspoint/img/benzina.png';
}
function getGasolioIcon(){
    return 'http://www.gveriello.altervista.org/accesspoint/img/gasolio.png';
}
function getGasIcon(){
    return 'http://www.gveriello.altervista.org/accesspoint/img/gas.png';
}
function getTreniToString(){
    var responso = getTreni();
    var num = 0;
    var table = '';
    num = responso.length;
    table += '<table class="table table-striped">';
    table += '<thead>';
    table += '<th>Treno</th>';
    table += '<th>Destinazione</th>';
    table += '<th>Orario</th>';
    table += '<th>Rit.</th>';
    table += '<th>Bin.</th>';
    table += '</thead>';
    table += '<tbody>';
    if (num > 0){
        if (num >= 6){
            num = 6;
        }
        for(i = 1; i < num; i++){
            table += '<tr>';
            if (responso[i][0] === 'e' || responso[i][0] === 'r' || responso[i][0] === 'o'){
                table += '<td>-</td>';
                table += '<td>-</td>';
                table += '<td>-</td>';
                table += '<td>-</td>';
                table += '<td>-</td>';
            }else{
                table += '<td>'+responso[i][0]+'</td>';
                table += '<td>'+responso[i][2]+'</td>';
                table += '<td>'+responso[i][3]+'</td>';
                table += '<td>';
                if (responso[i][4] > 0) table += responso[i][4]+'\'';
                table += '</td>';
                table += '<td>'+responso[i][5]+'</td>';
            }
            table += '</tr>';
        }
    }else{
        table += '<tr>';
        table += '<td>-</td>';
        table += '<td>-</td>';
        table += '<td>-</td>';
        table += '<td>-</td>';
        table += '<td>-</td>';
        table += '</tr>';
    }
    table += '</tbody>';
    return table;
}
//carica i contenuti nella pagina dashboard
function caricaContenuti(){

    var responso = '';
    var div = '';
    var num = 0;

    responso = getNotizieToString();
    $('#content_view_news').html(responso);

    responso = '';
    responso = getEventiToString();
    $('#content_view_events').html(responso);

    responso = '';
    responso = getBenzine();
    num = responso.locations.length;
    if (num > 0){
        div = '<a href="puntirifornimento.html" class="list-group-item text-center" '
            +'id="a_benzine"> Punti di rifornimento <span id="benzineCount" class="badge">'+num+'</span></a>';
    }else{
        div = '<a onClick="swal(\'Nessun elemento inserito al momento.\');" class="list-group-item text-center"   id="a_benzine"> Punti di rifornimento <span id="benzineCount" class="badge">'+num+'</span></a>';
    }
    $('#servizi').append(div);

    responso = '';
    num = 0;
    responso = getTreni();
    num = responso.length;
    if (num > 0){
        div = '<a href="treni.html" class="list-group-item text-center" '
            +'id="a_benzine">Treni in partenza/arrivo</a>';
    }else{
        div = '<a onClick="swal(\'Nessun treno in partenza.\');" class="list-group-item text-center" id="a_treni">Treni in partenza/arrivo</a>';
    }
    $('#servizi').append(div);
}

//crea il popup per la lettura
function createPopup(type, id){
    var responso = '';
    if (type.trim() === 'notizia'){
        responso = getNotizieJson();
    }
    if (type.trim() === 'evento'){
        responso = getEventiJson();
    }
    var title = 'Error';
    var img = 'Error';
    var date = 'Error';
    var text = 'Error';
    var author = 'Error';
    if (isJson(responso)){
        responso = JSON.parse(responso);
        valueResponso = responso.info.numvalori;
        if (valueResponso > 0) {
            parameters = JSON.parse(responso.info.parameters);
            //console.log(parameters);
            for (i = 0; i < valueResponso; i++){
                if (type.trim() === 'notizia'){
                    if (parameters[i].IDNotizia === id){
                        img = parameters[i].Img;
                        title = parameters[i].Titolo;
                        date = '<i class="material-icons">date_range</i> Scritto il ' + parameters[i].Scritto_il;
                        text = parameters[i].Testo;
                        author = '<i class="material-icons">face</i> Scritto da ' + parameters[i].Nome + ' ' + parameters[i].Cognome;
                    }
                }
                if (type.trim() === 'evento'){
                    if (parameters[i].IDEvento === id){
                        img = parameters[i].Img;
                        title = parameters[i].Titolo;
                        date =  '<i class="material-icons">date_range</i> Inizia il ' + parameters[i].DataInizio + ' ' + parameters[i].OraInizio + 
                            '<br><i class="material-icons">date_range</i> Termina il ' + parameters[i].DataFine + ' ' + parameters[i].OraFine;
                        text = parameters[i].Testo;
                        author = '<i class="material-icons">face</i> Scritto da ' + parameters[i].Nome + ' ' + parameters[i].Cognome;
                    }
                }
            }
        }
    }
    var card = '';
    card += '<div class="popup">';
    card += '<div class="content-block">';
    card += '<img src="img/banner_leaderboard.jpg">';
    card += '<p><a href="#" class="close-popup"><i class="icon icon-back"></i> Torna indietro</a></p>';
    card += '<div class="card demo-card-header-pic">';
    card += '<div style="background-image:url('+ img + ')" valign="bottom" class="card-header color-white no-border">'+ title +'</div>';
    card += '<div class="card-content">';
    card += '<div class="card-content-inner">';
    card += '<p class="color-gray">'+ author + '</p>';
    card += '<p class="color-gray">'+ date + '</p>';
    card += '<p>'+ text +'</p>';
    card += '</div>';
    card += '</div>';
    card += '</div>';
    card += '</div>';
    card += '</div>';
    myApp.popup(card);
}

