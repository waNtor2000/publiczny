// ==UserScript==
// @name         back_time_snipe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pokazuje czas powrotu w podglącie rozkazu
// @author       CdChudes
// @match        https://*.plemiona.pl/game.php?village=*&screen=info_command&id=*&type=other
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// ==/UserScript==

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

    //distance();
    //arrival_date();
    //command_speed();
    calculate_backtime();




})();