<?php
echo "<h1>Test Connsessione e scrittura Google Calendar</h1><br>" ;
if(file_exists('./google/Google.php')) {
    require_once('./google/Google.php');
    echo "File trovato...<br>" ;
    $mg = new MyGoogle();
    echo "Classe istanziata...<br>" ;
    $mg->getNextTenEvent() ;
    //$arr = $mg->CreateCalendarEvent() ;
    echo "Arrai riempito...<br>" ;
    echo "<pre>" ; print_r($arr); 
} else {
    echo "<h2>NON ENTRO...</h2>" ;
}
?>