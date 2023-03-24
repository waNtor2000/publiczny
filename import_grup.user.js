// ==UserScript==
// @name         Import/Export grup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skrypt do masowego importowania/exportowania ustawień grup dynamicznych
// @author       CdChudes /RedAlert
// @match        https://pl182.plemiona.pl/game.php?village=*&screen=overview_villages&mode=groups&type=dynamic&group=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("działa")
    document.getElementById('basic_management').getElementsByTagName('h3')[0].innerHTML+= '<input value="Import/Export" class="btn" type="button" id="ch_import_export" data-title="Import/Export dynamicznych grup" >';
    $('#ch_import_export').on('click',function(){
        javascript:$.getScript('https://twscripts.dev/scripts/importExportDynamicGroups.js');
    })
    
})();