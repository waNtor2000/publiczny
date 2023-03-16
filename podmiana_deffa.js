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
    var info = [];

    function add_troops_info() {
    var data = $('#units_table tBody tr.row_a, tr.row_b');
    for (var i = 0; i < data.length; i++) {
        var village = {};
        village.coord = data[i].getElementsByClassName('village_anchor contexted')[0].outerText.trim().slice(-12, -5);
        village.spear = parseInt(data[i].children[2].outerText);
        village.sword = parseInt(data[i].children[3].outerText);
        village.archer = parseInt(data[i].children[5].outerText);
        village.spy = parseInt(data[i].children[6].outerText);
        village.heavy = parseInt(data[i].children[9].outerText);
        // check if village already exists in info array
        var index = info.findIndex(v => v.coord === village.coord);
        if (index !== -1) {
        // if village exists, add troops to existing object
        info[index].spear += village.spear;
        info[index].sword += village.sword;
        info[index].archer += village.archer;
        info[index].spy += village.spy;
        info[index].heavy += village.heavy;
        } else {
        // otherwise, add new village object to info array
        info.push(village);
        }
    }
    }
// dokończyć tutaj zeby dodawało i jeśli już występuje to nie tworzy nowego obiektu a dodaje wartości do obiektów




   add_troops_info();
   console.log(info);

})();