// ==UserScript==
// @name         Podmiana Deffa
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Skrypt do podmianki deff
// @author       CdChudes#3372
// @match        https://*.plemiona.pl/game.php?village=*&screen=overview_villages&mode=units&type=away_detail&filter_villages=*
// @match        https://*.plemiona.pl/game.php?village=*&screen=overview_villages&mode=units&type=away_detail
// @icon         https://cdn-icons-png.flaticon.com/512/1372/1372789.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('Start');
    var autor= `<p style="text-align:center; position:relative; top:10px;border: 1px solid black;border-radius: 12px;color:white;padding: 5px;background: radial-gradient(circle at center center, #8E2DE2 0%, #4A00E0 100%);">Skrypt stworzony przez CdChudes#3372(discord)</p>`
    //tworzenie zmiennej globalnej przechowującej informacje o wiosce INFO
    var info = [];
    // dodawanie informacji o kazdej wiosce do zmiennej INFO
    function add_troops_info() {
        var data = $('#units_table tBody tr.row_a, tr.row_b');
        for (var i = 0; i < data.length; i++) {
            var village = {};
            village.owner = {};
            // zbiórka info o wiosce, właścicielu
            village.coord = data[i].getElementsByClassName('village_anchor contexted')[0].outerText.trim().slice(-12, -5);
            village.vId = data[i].getElementsByClassName('village_anchor contexted')[0].getAttribute('data-id');
            village.vTag = data[i].getElementsByClassName('village_anchor contexted')[0].outerText.trim();
             if(data[i].getElementsByTagName('a').length>2){
                village.owner.nick = data[i].querySelectorAll('a')[2].outerHTML;
                village.owner.tribal = data[i].querySelectorAll('a')[3].outerHTML;
            }
            else{
                village.owner.nick= "";
            }
            // zbiórka wojsk
            village.spear = parseInt(data[i].children[2].outerText);
            village.sword = parseInt(data[i].children[3].outerText);
            //swiat z łucznikami jeśli tak
            if(game_data.units[3]==="archer") {
                village.archer = parseInt(data[i].children[5].outerText);
                village.spy = parseInt(data[i].children[6].outerText);
                village.heavy = parseInt(data[i].children[9].outerText); 
            }
            // świat bez łuczników
            else{
                village.spy = parseInt(data[i].children[5].outerText);
                village.heavy = parseInt(data[i].children[7].outerText); 
            }
            // check if village already exists in info array
            var index = info.findIndex(v => v.coord === village.coord);
            if (index !== -1) {
                // if village exists, add troops to existing object
                info[index].spear += village.spear;
                info[index].sword += village.sword;
                if(game_data.units[3]==="archer") info[index].archer += village.archer;
                info[index].spy += village.spy;
                info[index].heavy += village.heavy;
            } else {
                // otherwise, add new village object to info array
                info.push(village);
            }
        }
    }
// Tworzenie GUI z BBCODE do skopiowania
    function create_bbcode() {
        // łucznicy
        if(game_data.units[3]==="archer"){
            var bbcode_output = `[table]\n[**]Kordy[||]Pik[||]Miecz[||]Łucznik[||]Zwiad[||]CK[/**]\n`;
            info.forEach(function(village) {
            bbcode_output += '[*] ' + village.coord + village.owner.nick +' \t' +
                        '[|] ' + village.spear + '\t' +
                        '[|] ' + village.sword + '\t' +
                        '[|] ' + village.archer + '\t' +
                        '[|] ' + village.spy + '\t' +
                        '[|] ' + village.heavy + '\n';
            });
        }
        // brak łuczników
        else{
            var bbcode_output = `[table][**]Kordy[||]Pik[||]Miecz[||]Zwiad[||]CK[/**]\n`;
            info.forEach(function(village) {
            bbcode_output += '[*] ' + village.coord + village.owner.nick+ ' \t' +
                        '[|] ' + village.spear + '\t' +
                        '[|] ' + village.sword + '\t' +
                        '[|] ' + village.spy + '\t' +
                        '[|] ' + village.heavy + '\n';
            });
        }
        bbcode_output+="\n[/table]"
        // return Dialog.show("LEO","<div>\n            <h2>Deff na wsparciu</h2>\n            <textarea rows=\"5\" cols=\"30\" readonly>" + output+"</textarea>\n        </div>");
        return bbcode_output;
    }
    //create button to load script / tworzenie przycisku uruchamiającego skrypt
    function createBtn(){
        var button = '<input id="all_troops" type="button" class="btn" value="Gdzie stoi deff" style="position: fixed; left: 10px; top:50vh; margin:3px;" title="Pokaż zsumowane jednestki w wioskach na wsparciu">';
        $('#ds_body').append(button);
        $('#all_troops').on('click', function(e){
            display_popup(true,e);
        })
    }
//tworzenie głównej tabeli która wyświetla infomację o wioskach gdzie stoi nasz deff
    function create_table(){
        var row_class = ['row_a', 'row_b'];
        var row_number = 0;
        // łucznicy
        if(game_data.units[3]==="archer"){
            var content = `<table class="vis" width="100%"><tbody><th>Kordy</th><th>Pik</th><th> Miecz</th> <th>Łucznik</th> <th>Zwiad</th> <th>CK</th>`;
                info.forEach(function(village) {
                content += `<tr class="${row_class[row_number%2]}"><td> <a href="/game.php?screen=info_village&amp;id=${village.vId}">` + village.vTag + '</a>\n'+ village.owner.nick +'</td>' +
                            '<td>' + village.spear + '</td>' +
                            '<td>' + village.sword + '</td>' +
                            '<td>' + village.archer + '</td>' +
                            '<td> ' + village.spy + '</td>' +
                            '<td>' + village.heavy + '</td></tr>';
                            row_number++;
                            console.log(village.owner.nick);
                });
        }
        // brak łuczników
        else{
            var content = `<table class="vis" width="100%"><tbody><th>Kordy</th><th>Pik</th><th> Miecz</th> <th>Zwiad</th> <th>CK</th>`;
                info.forEach(function(village) {              
                content += `<tr class="${row_class[row_number%2]}"><td> <a href="/game.php?screen=info_village&amp;id=${village.vId}">` + village.vTag + '</a></td>' +
                            '<td>' + village.spear + '</td>' +
                            '<td>' + village.sword + '</td>' +
                            '<td> ' + village.spy + '</td>' +
                            '<td>' + village.heavy + '</td></tr>';
                            row_number++;
                });
        }
            content+='</tbody></table>' + autor;
        return content;
    }
    /* 
        Open Popup window
        @param - boolean true/false -> table or bbcode table
        @param object e Click event    
    */
    function display_popup(boolean, e = null){
		var popup_position = {clientX: 0, clientY: 0};

		if (e) {
			popup_position.clientX = e.clientX;
			popup_position.clientY = e.clientY;
		}
        if (boolean) {
			UI.AjaxPopup(null, 'deff_swap', create_table(), 'Deff na wsparciu <a href="#" id="podmiana_deffa" style="font-size:0.8em; float:none;">Pokaż BB-Code</a>', null, {dataType: 'prerendered', reload: true}, 400, 400, popup_position.clientX, popup_position.clientY);
			$('#podmiana_deffa').text('Pokaż BB-Code');
		} else {
			UI.AjaxPopup(null, 'deff_swap', create_bbcode(), 'Deff na wsparciu <a href="#" id="podmiana_deffa" style="font-size:0.8em; float:none;">Pokaż Tabele</a>', null, {dataType: 'prerendered', reload: true}, 400, 400, popup_position.clientX, popup_position.clientY);
			$('#podmiana_deffa').text('Pokaż Tabele');
		}
    }

    add_troops_info();
    createBtn();
    $('body').on('click', '#podmiana_deffa', function(e) {
        e.preventDefault();

        if ($(this).text() === 'Pokaż BB-Code') {
            $('#deff_swap_content').html("<h2>Deff na wsparciu</h2>\n            <textarea rows=\"10\" cols=\"48\" readonly>" + create_bbcode()+"</textarea>\n" + autor);
            // UI.ToolTip($('.ui_tooltip'));
            $(this).text('Pokaż Tabele');
        } else {
            $('#deff_swap_content').html(create_table());             
            $(this).text('Pokaż BB-Code');
            
        }

    });
    

    /* Dodawanie dragable okna
    UI.AjaxPopup(null, 'KLASA', 'KONTENT', 'NAGŁÓWEK <a href="#" id="conquers_script_settings" style="font-size:0.8em; float:none;">ustawienia</a>', null, {dataType: 'prerendered', reload: true}, 400, 400, 1000, 100)
	$('#conquers_script_settings').text('ustawienia'); 
    */

})();