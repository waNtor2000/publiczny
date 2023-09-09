// ==UserScript==
// @name         Snipowanie szlahcty w poproś o pomoc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       CdChudes
// @match        https://*.plemiona.pl/game.php?village=*&screen=reqdef&village_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// ==/UserScript==

let autor = `<p style="text-align:center; position:relative; top:10px;border: 1px solid black;border-radius: 12px;color:white;padding: 5px;background: radial-gradient(circle at center center, #8E2DE2 0%, #4A00E0 100%);">Skrypt stworzony przez CdChudes#3372(discord)</p>`;
if ((game_data.player.ally == 160 || game_data.player.ally == 189) && game_data.world == "pl190") {
  function createBtn() {
    let templateBtn =
      '<button type="button" class="btn btn-default float_right" id="chudes_replace" style="background: radial-gradient(circle at center center, #8E2DE2 0%, #4A00E0 100%)">Pokoloruj grube</button>';
    document.querySelector(
      "#reqdef_form tbody tr .btn"
    ).parentElement.innerHTML += templateBtn;
  }
  createBtn();
  document.querySelector("button#chudes_replace").onclick = main;

  function main() {
    console.log("start");
    // pobieranie okienka  z txtarea
    let txt = document.getElementById("simple_message");
    let msg = txt.value;
    // KONFIGURACJA
    let szukana = "Szlachcic";
    let podmiana = ":sos:[color=#ff6363][b]" + szukana + "[/b][/color]";
    function highline(variable, wanted) {
      document.getElementById("simple_message").value = msg.replaceAll(
        variable,
        wanted
      );
      document.getElementById("simple_message").style.background = "gainsboro";
      console.log("Zmieniono wszystkie");
      UI.InfoMessage("Podświetlono nazwy szlachiców", 2000, "success");
    }
    highline(szukana, podmiana);
  }
} 
else {
  UI.InfoMessage("Nie masz dostępu do tego skryptu" + autor, 5000, "error");
}
