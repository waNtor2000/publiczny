// ==UserScript==
// @name         back_time_snipe
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Pokazuje czas powrotu w podglącie rozkazu
// @author       You
// @match        https://pl182.plemiona.pl/game.php?village=*&screen=info_command&id=*&type=other
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var get_info = $('#content_value tbody tr');
    var source = $('.village_anchor')[0].textContent.slice(-13,-6);
    var target = $('.village_anchor')[1].textContent.slice(-13,-6);

    function distance(){
        let x1 = source.split('|')[0];
        let y1 = source.split('|')[1];
        let x2 = target.split('|')[0];
        let y2 = target.split('|')[1];

        let x = Math.abs(x1-x2);
        let y = Math.abs(y1-y2);
        console.log(x,y);
        x = x * x;
        y = y * y;
        console.log(x,y);
        let dist  = Math.sqrt(x+y);


        console.log(dist);
        return dist;
    }
    function arrival_date(){
        let arrival_date= get_info[5].childNodes[1].textContent;
        let data = {};
        data.dzien = arrival_date.split('.')[0];
        data.miesiac = arrival_date.split('.')[1];
        data.rok = arrival_date.split('.')[2].slice(0,3);
        console.log(parseInt(data.rok)+2000);
        data.godzina = arrival_date.slice(-12,-4).split(':')[0];
        data.minuty = arrival_date.slice(-12,-4).split(':')[1];
        data.sekundy = arrival_date.slice(-12,-4).split(':')[2];

        var arrival= new Date(parseInt(data.rok)+2000,data.miesiac,data.dzien,data.godzina,data.minuty,data.sekundy);
        console.log(arrival);
        return arrival;
    }

    function command_speed(){
        let comamnd_name = get_info[0].outerText; //pobiera nazwe etykiety rozkazu
        console.log(comamnd_name);

        //skrotownik podrozy
        let trip = $('#running_times tr:not(:first-child, :nth-child(2))');
        console.log(trip);

        var all_trrops = []; //odwołać się na podsatwie nazwy[i].unit lub .speed
        for(let i =0; i<=trip.length;i++){
            var type = {};
            type.unit= trip[i].textContent.trim().split('\n')[0].trim()
            type.speed = trip[i].textContent.trim().split('\n')[3].trim()
            console.log(type);
            all_trrops.push(type);
            if(comamnd_name.match(type.unit)){
                console.log("ZNALEZIONO: " + type.unit + " o prędkosci: "+type.speed)
                let godziny= parseInt(type.speed.split(':')[0]);
                let minuty= parseInt(type.speed.split(':')[1]);
                let sekundy= parseInt(type.speed.split(':')[2]);
                let time_in_sec = parseInt(godziny)*3600 + parseInt(minuty)*60 + parseInt(sekundy);
                console.log(godziny,minuty,sekundy);
                console.log(time_in_sec);
                return time_in_sec;
            }
        }
    }

    function calculate_backtime(){
        var calculate_backtime = arrival_date();
        var droga = command_speed();
        console.log(calculate_backtime.getTime());
        console.log(droga);
        let zmienna = calculate_backtime.setSeconds(calculate_backtime.getSeconds()+droga);
        console.log(zmienna);
        console.log(new Date(zmienna));
    }

    distance();
    arrival_date();
    command_speed();
    calculate_backtime();




})();