// ==UserScript==
// @name         Sprawdzanie wysylki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Cdchudes
// @match        https://pl182.plemiona.pl/game.php?screen=memo&village=10505
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var wiersze = $('.vis .bbcodetable tbody tr');
    var i = 0;
     $.each($(wiersze), function(){
        if(wiersze[i].textContent.match('|')){
            console.log("kordy")
            wiersze[i].insertCell().innerHTML+=('<td id="chudes_td" style="text-align:center;" colspan="2"> <input type="checkbox" id="spr" name="interest" value="$(wiersze[i].textContent)" /> </td>');
        }
        //console.log(wiersze[i].textContent);
        i++;


     })
    


})();