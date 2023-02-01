<?php
header("Access-Control-Allow-Origin: *");
echo file_get_contents("https://skrypty.wantor.pl/htacces/list.JSON");
?>