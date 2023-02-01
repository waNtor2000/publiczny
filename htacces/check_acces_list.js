/* 
  Author : CdChudes
  Desc : checking JSON list for acces player od ID
  Version: 0.1
  Date : 1.02.2023
*/


$.ajax({
    url: "list.json",
    dataType: "json",
    success: function(data) {
      console.log(data);
    }
  });