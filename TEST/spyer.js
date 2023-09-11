/* 
  Author : CdChudes
  Desc : downloading script and save in local storage to use it after
  Version: 0.1
  Date : 11.09.2023
*/
function getScript() {
    let link = "https://trd-skrypty.wantor.pl//test/getScript.php";
    fetch(link)
        .then((response) => response.text())
        .then((scriptContent) => {
            // Zapisz skrypt w pamięci podręcznej przeglądarki
            localStorage.setItem("chScript", scriptContent);

            // Ustaw datę wygaśnięcia na 10 dni od teraz
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 10);
            localStorage.setItem("chExpiration", expirationDate.getTime());
        })
        .catch((error) => {
            console.error("Błąd podczas pobierania skryptu:", error);
        });
}
const scriptContent = localStorage.getItem("chScript");
const scriptExpiration = localStorage.getItem("chExpiration");

if (scriptContent && scriptExpiration) {
    const currentTimestamp = new Date().getTime();
    if (currentTimestamp < scriptExpiration) {
        // Skrypt jest w pamięci podręcznej i jest aktualny
        // Wykonaj skrypt, np. wstrzykując go do strony
        const scriptElement = document.createElement("script");
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);
    } else {
        // Skrypt wygasł, usuń go z pamięci podręcznej
        localStorage.removeItem("chScript");
        localStorage.removeItem("chExpiration");

        // Pobierz nową kopię skryptu i zapisz w pamięci podręcznej
        getScript();
    }
} else {
    // console.log("Skrypt nie jest w pamięci podręcznej, pobierz go i zapisz");
    getScript();
}
