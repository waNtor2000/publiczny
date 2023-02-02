/* 
  Author : CdChudes
  Desc : checking JSON list for acces player od ID
  Version: 0.1
  Date : 1.02.2023
*/

var list;
/* let playerId;
let allyId;
let world; */
function getList(){
  $.ajax({
    url: "https://skrypty.wantor.pl/htacces/acces.php",
    dataType: "json",
    success: function(data) {
      console.log(data);
      list = data;
    }
  });
};

function setCookie(cName,cValue,exDays){
  let data = new Date(exDays);
  document.cookie = cName + "="+ cValue + ";" + data + ";path=/";
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
function checkPlayerOnList(){
  getList();
  for(i = 0; i<= list.acces_players.length-1;i++){
    if(list.acces_players[i].id==game_data.player.id){
      setCookie(cName,list.acces_players[i].id,list.acces_players[i].expires);
      return 0;
    }  
  }
  console.log('Brak dostępu')
  return 1;
};
// SPRAWDZANIE CZY PLEMIE NA LIŚCIE 
// Jeśli jest to dodaje
function checkAllyOnList(){
  getList();
  for(i = 0; i<= list.acces_tribals.length-1;i++){
    if((list.acces_tribals[i].id==game_data.player.ally)&&(list.acces_tribals[i].world==game_data.world)){
      setCookie(cName,list.acces_tribals[i].id,list.acces_players[i].expires);
      return 0;
    } 
  }
  return 1;
};



// KONFIGURACJA

$(function(){
  let cName = 'player_id'
  cookieExist(cName); //znaleźć dla funkcji lepsze miejsce, nie wiem czy w ifie pod spodem
  if(getCookie(cName)==game_data.player.id ){
    console.log("Przyznano dostęp")
    return 0;
  }
  else if(checkPlayerOnList()==0){ 
    console.log('Przyznano dostep nowego gracza')
    return 0;
  }
  else if(checkAllyOnList()==0){
   console.log('Przyznano dostep nowego plemienia')
   return 0;
  }
  else {
    UI.InfoMessage("Nie masz dostepu do skryptu!",5000,'error');
    return 1;
  }
  
});
