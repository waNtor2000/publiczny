// ==UserScript==
// @name         back_time_snipe
// @namespace    http://tampermonkey.net/
// @version      1.0 
// @description  Pokazuje czas powrotu w podglądzie rozkazu. Wersja działająca
// @author       CdChudes
// @match        https://*.plemiona.pl/game.php?village=*&screen=info_command&id=*&type=other
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// ==/UserScript==


if(new Date() <= new Date(2023,0,31,12,0,0)){
(function() {
    'use strict';

    var get_info = $('#content_value tbody tr');
    var source = $('.village_anchor')[0].textContent.slice(-13,-6);
    var target = $('.village_anchor')[1].textContent.slice(-13,-6);
    // CALCULATE DISCTANCE BETWEEN BOTH VILLAGES
    function distance(){
        let x1 = source.split('|')[0];
        let y1 = source.split('|')[1];
        let x2 = target.split('|')[0];
        let y2 = target.split('|')[1];
        let x = Math.abs(x1-x2);
        let y = Math.abs(y1-y2);
        //console.log(x,y);
        x = x * x;
        y = y * y;
        //console.log(x,y);
        let dist  = Math.sqrt(x+y);
        //console.log(dist);
        return dist;
    };
    // GEETING ARRIVAL TIME FROM TABLE of attack info
    function arrival_date(){
        let arrival_date= get_info[5].childNodes[1].textContent;
        let data = {};
        data.dzien = arrival_date.split('.')[0];
        data.miesiac = arrival_date.split('.')[1];
        data.rok = arrival_date.split('.')[2].slice(0,3);
        //console.log(parseInt(data.rok)+2000);
        data.godzina = arrival_date.slice(-12,-4).split(':')[0];
        data.minuty = arrival_date.slice(-12,-4).split(':')[1];
        data.sekundy = arrival_date.slice(-12,-4).split(':')[2];

        var arrival= new Date(parseInt(data.rok)+2000,parseInt(data.miesiac)-1,data.dzien,data.godzina,data.minuty,data.sekundy);
        //console.log(arrival);
        return arrival; // return value as date in format YYYY MM DD HH:MM:SS
    };
    // SELECT type of command and rerutn value speed (for selected troops) per 1 grid
    function command_speed(){
        let comamnd_name = get_info[0].outerText; //geting value of attack-name
        //console.log(comamnd_name);
        var troops_type = ['Topór','LK','Taran','Szlachcic','Zwiad','Miecz','CK'];//array with name of command
        // value of speed per 1 grid for each unit
        let speed = {
            Topór:18/60,
            LK:10/60,
            Taran:30/60,
            Szlachcic:35/60,
            Zwiad:9/60,
            Miecz:22/60,
            CK:11/60
        };
        // checking and return unit speed per 1 grid
        for(let i=0; i<=troops_type.length; i++){
            if(comamnd_name.match(troops_type[i])){
                //console.log(speed[troops_type[i]]*3600)
                return speed[troops_type[i]]*3600;
            };
        };
    };
    //return backtime
    function calculate_backtime(){
        // distance * command speed = time in sec
        var calculate_backtime = arrival_date();
        var droga = command_speed() * distance();
        //console.log(calculate_backtime.getTime());
        //console.log(droga);
        let time_in_sec = calculate_backtime.setSeconds(calculate_backtime.getSeconds()+droga);
        console.log((new Date(time_in_sec)));
        return (new Date(time_in_sec));
    };
    function createUI(){
        var button = '<input id="back_time_btn" type="button" class="btn chudes_btn" value="Pokaż czas powrotu" style="position: relative; left: 10px; margin:3px;" title="Pokaz czas powrotu rozkazu">';
        $('#content_value h2').append(button);
    }
    //distance();
    //arrival_date();
    //command_speed();
    //calculate_backtime();
    createUI();

    $("#back_time_btn").on("click",function (){
        let data = calculate_backtime();
        let powrot = {};
        powrot.rok = data.getFullYear();
        powrot.miesiac = data.getMonth()+1;
        powrot.dzien = data.getDate();
        powrot.godzina = data.getHours();
        powrot.minuta = data.getMinutes();
        powrot.sekunda = data.getSeconds();
        powrot.show_date= function(){
            let test = powrot.godzina +":"+ powrot.minuta +":"+ powrot.sekunda +"\tDnia "+ powrot.dzien +"."+powrot.miesiac +"."+powrot.rok;
            return test;
        }
        Dialog.show("LEO","<div>\n            <h2>Czas Powrotu:</h2>\n            <textarea rows=\"5\" cols=\"30\" readonly>Czas powrót:\t" + powrot.show_date()+"</textarea>\n        </div>");
    })



})();
}
else UI.InfoMessage('Zakończył się okres werji próbnej, skontaktuj się z  <b style=\'color:green; font-size:16px;\'>CdChudes aka Piekielne Duo</b>, aby wykupić subskrypcję',5000,'error')