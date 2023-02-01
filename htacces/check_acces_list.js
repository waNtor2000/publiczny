/* 
  Author : CdChudes
  Desc : checking JSON list for acces player od ID
  Version: 0.1
  Date : 1.02.2023
*/


var dane = $.ajax({
    url: "https://skrypty.wantor.pl/htacces/acces.php",
    dataType: "json",
    success: function(data) {
      console.log(data);
    }
  });
  console.log('Witam');