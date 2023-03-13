// ==UserScript==
// @name         Podmiana Deffa
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skrypt do podmianki deff
// @author       CdChudes
// @match        https://*.plemiona.pl/game.php?village=*&screen=overview_villages&mode=units&type=away_detail&filter_villages=*
// @match        https://*.plemiona.pl/game.php?village=*&screen=overview_villages&mode=units&type=away_detail
// @icon         https://cdn-icons-png.flaticon.com/512/1372/1372789.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('Start');
    var info= [];

    function add_troops_info(){
        var data = $('#units_table tBody tr.row_a, tr.row_b');
        for(var i=0; i< data.length; i++){
            var village = {};
            console.log(i);
            console.log(data[i].getElementsByClassName('village_anchor contexted')[0].outerText.trim().slice(-12,-5));   
            console.log(data[i].className);
            village.coord = data[i].getElementsByClassName('village_anchor contexted')[0].outerText.trim().slice(-12,-5); 
            village.spear = parseInt(data[i].children[2].outerText)
            village.sword = parseInt(data[i].children[3].outerText)
            village.archer = parseInt(data[i].children[5].outerText)
            village.spy = parseInt(data[i].children[6].outerText)
            village.heavy = parseInt(data[i].children[9].outerText)

            info.push(village);
        }
    }
// dokończyć tutaj zeby dodawało
    function check_village_on_list(kordy, kordyListy){
        for(i = 0; i<info.length;i++){
            if(kordy[i]==kordyListy){
                console.log(i);
            }
        }
    }



   add_troops_info();
   check_village_on_list(info.coord)
   console.log(info);

})();