<?php
header('Access-Control-Allow-Origin: *'); // Pozwala na dostęp z dowolnej domeny
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Pozwala na metody POST i OPTIONS
header('Access-Control-Allow-Headers: Content-Type'); // Pozwala tylko na nagłówki Content-Type

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Odpowiedź z statusem "ok" na żądanie preflajt
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Odczytaj przesłany tekst
    $textToSave = file_get_contents('php://input');
    
    // Odczytaj nazwę pliku z przekazanego JSON
    $postData = json_decode($textToSave, true); // Parsowanie JSON
    $filename = $postData['filename']; // Pobranie nazwy pliku

    // Sprawdź, czy nazwa pliku jest dostępna i czy nie zawiera znaków specjalnych
    if (!empty($filename) && preg_match('/^[a-zA-Z0-9_\-]+$/', $filename)) {
        // Dodaj rozszerzenie .txt do nazwy pliku
        $filenameWithExtension = 'DATA/' . $filename . '.txt'; // Dodanie "DATA/" przed nazwą pliku

        // Otwórz plik o określonej nazwie w trybie zapisu
        $file = fopen($filenameWithExtension, 'a');

        if ($file) {
            // Zapisz tekst do pliku
            fwrite($file, $textToSave . "\n");

            // Zamknij plik
            fclose($file);

            // Wyślij odpowiedź
            http_response_code(200);
            echo 'Tekst został zapisany poprawnie do pliku ' . $filenameWithExtension;
        } else {
            http_response_code(500);
            echo 'Błąd serwera podczas otwierania pliku';
        }
    } else {
        http_response_code(400);
        echo 'Nieprawidłowa nazwa pliku lub nazwa pliku zawiera niedozwolone znaki';
    }
} else {
    http_response_code(405);
    echo 'Metoda nieobsługiwana';
}
?>
