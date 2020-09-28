<?php
function getCodiceFiscaleCurl($a) {

    $strNome    = "Simone" ;
    $strCognome = "Bernard" ;
    $strNascita = "Napoli" ;
    $strDN      = "23/06/1982" ;
    $strSesso   = "M" ;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,"http://webservices.dotnethell.it");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS,
                "Nome={$strNome}&
                Cognome={$strCognome}&
                ComuneNascita={$strNascita}&
                DataNascita={$strDN}&
                Sesso={$strSesso}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    curl_close ($ch);

    return $server_output ;
}

function getCodiceFiscalePost($d) {

    $url = 'http://webservices.dotnethell.it';
    $data = array(
        'Nome' => 'Simone', 
        'Cognome' => 'Bernard', 
        'ComuneNascita' =>'Napoli', 
        'DataNascita'=>'23/06/1982',
        'Sesso'=>'M' );
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded",
            'method'  => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === FALSE) { /* Handle error */ }

    var_dump($result);
}

$arr = array();
//echo getCodiceFiscalePost($arr) ;
file_get_contents('http://webservices.dotnethell.it/codicefiscale.asmx/CalcolaCodiceFiscale');
echo "<pre>" ;
print_r($http_response_header);

file_get_contents('http://webservices.dotnethell.it/');
echo "<pre>" ;
print_r($http_response_header);

?>