/* 
  Author : CdChudes
  Desc : checking JSON list of ID player or allies ID to get perrmision ussage scipts
  Version: 0.1
  Date : 1.02.2023
*/


getList = async () => {
  await $.ajax({
    url: "https://skrypty.wantor.pl/htacces/acces.php",
    dataType: "json",
    success: function(data) {
      console.log(data);
      list = data;
    }
  });
};
function setCookie(cName,cValue,exDays){
  let data = new Date(exDays).toUTCString();
  document.cookie = cName + "="+ cValue + ";expires=" + data + ";path=/";
  console.log(data);
};
function cookieExist(cName){
  if (document.cookie.includes(cName)) {
    // console.log("Cookie o nazwie " + searchedCookie + " zostało znalezione.");
  } else {
    // console.log("Cookie o nazwie " + searchedCookie + " nie zostało znalezione.");
      document.cookie = cName+"=8937O13123";
  }
}
function getCookie(cName){
  let ca = document.cookie.split(';');
  for(let i=0;i<=ca.length;i++){

    if(ca[i].includes(cName)){
      // może być problem bo spacja jest na początku
      return parseInt(ca[i].split('=')[1]);
    }
    /* else{
      UI.InfoMessage("Nie masz dostepu do skryptu!",5000,'error')
     
    } */
    console.log("obrót:"+i);
  };
  return 1;
};
//pobieranie danych gry, chyba w ogóle nie potrzebne
function getData(){
  return {
    nick: game_data.player.name,
    id: game_data.player.id,
    allyId: game_data.player.ally,
    world: game_data.world
  }
};
// SPRAWDZANIE CZY GRACZ NA LISCIE
// Jeśli jest to dodaje
function checkPlayerOnList(cName){
  // getList();
  for(i = 0; i<= list.acces_players.length-1;i++){
    if(list.acces_players[i].id==game_data.player.id){
      setCookie(cName, list.acces_players[i].id, new Date(list.acces_players[i].expires));
      return 0;
    }  
  }
  console.log('Brak dostępu')
  return 1;
};
// SPRAWDZANIE CZY PLEMIE NA LIŚCIE 
// Jeśli jest to dodaje
function checkAllyOnList(cName){
  // getList();
  for(i = 0; i<= list.acces_tribals.length-1;i++){
    if((list.acces_tribals[i].id==game_data.player.ally)&&(list.acces_tribals[i].world==game_data.world)){
      setCookie(cName, list.acces_tribals[i].id, list.acces_players[i].expires);
      return 0;
    } 
  }
  return 1;
};

// KONFIGURACJA

async function VALID(){

  var cName = 'player_id'
  cookieExist(cName); //znaleźć dla funkcji lepsze miejsce, nie wiem czy w ifie pod spodem
  if(getCookie(cName)==game_data.player.id ){
    console.log("Przyznano dostęp, zwraca 0")
    return 0;
  }

  else{
      var list;
      await getList();
      if(checkPlayerOnList(cName)==0){ 
        console.log('Przyznano dostep nowego gracza, check player')
        return 0;
      }
      else if(checkAllyOnList(cName)==0){
      console.log('Przyznano dostep nowego plemienia, check ally')
      return 0;
      }
      else {
        console.log('Nie ma cie na liście, return ')
        UI.InfoMessage("Nie masz dostepu do skryptu!",5000,'error');
        return 1;
      }
  }
  
};
VALID();
/* TO DO
- check player and check ally functions to repair,
rozwiazac logike albo naprawic ustawianie ciasteczek
*/
