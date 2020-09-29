<?php
require 'config.php';
require 'Slim/Slim.php';
require 'google_config.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->post('/login','login'); /* User login */
$app->post('/signup','signup'); /* User Signup  */
$app->post('/feed','feed'); /* User Feeds  */
$app->get('/getFeed','getFeed'); /* User Feeds  */

$app->post('/feedUpdate','feedUpdate'); /* User Feeds  */
$app->post('/feedDelete','feedDelete'); /* User Feeds  */
$app->post('/getImages', 'getImages');
$app->post('/userImage','userImage'); /* User Details */

$app->post('/salvaStatino','salvaStatino'); /* User Signup  */
$app->post('/creaCliente','creaCliente'); /* User Signup  */
$app->post('/editStatino','editStatino'); /* User Signup  */
$app->post('/getMedici','getMedici'); /* User Signup  */
$app->post('/getClienti','getClienti'); /* User Signup  */

$app->post('/getStatini','getStatini'); /* User Feeds  */
$app->post('/setMaxStatino','setMaxStatino'); /* User Feeds  */
$app->post('/getImages', 'getImages');

$app->run();

/************************* USER LOGIN *************************************/
/* ### User login ### */
function login() {
    

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    error_log( "login: \n",3,'/app/simmi.log') ;
    try {
        
        $db = getDB();
        $userData ='';
        $sql  = "SELECT user_id, name, email, username, profilo, cod_ut, saveToPhotoAlbum ";
        $sql .= "FROM users JOIN utenti on users.cod_ut=utenti.cod_utente ";
        $sql .= "WHERE (username=:username or email=:username) and password=:password ";
        $sql2  = "SELECT user_id, name, email, username, profilo, cod_ut, saveToPhotoAlbum ";
        $sql2 .= "FROM users JOIN utenti on users.cod_ut=utenti.cod_utente ";
        $sql2 .= "WHERE (username=".$data->username." or email=".$data->username.") and password=".$data->password." ";
        error_log( "sql:".$sql2."\n",3,'/app/simmi.log') ;
        $stmt = $db->prepare($sql);
        $stmt->bindParam("username", $data->username, PDO::PARAM_STR);
        $password=hash('sha256',$data->password);
        $stmt->bindParam("password", $password, PDO::PARAM_STR);
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $userData = $stmt->fetch(PDO::FETCH_OBJ);
        
        if(!empty($userData))
        {
            $user_id=$userData->user_id;
            $userData->token = apiToken($user_id);
        }
        
        $db = null;
         if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Bad request wrong username and password"}}';
            }

           
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getClienti($cod_cli = "",$cod_ut = "") {

    $request = \Slim\Slim::getInstance()->request();

    if ($cod_ut == "") $cod_ut = json_decode($request->getBody());
     
    try {
        $db = getDB();
        $cliData ='';
        $cond = "" ;
        if ($cod_cli!="") {
            $cond = " and cli.cod_cli = '{$cod_cli}' " ;
        }
        /*$sql  = " SELECT cli.cod_ut as cli_cod_ut,cli.cod_cli as cli_cod_cli,cli.nome,cli.cognome,cli.data_nascita,cli.sesso," ;
        $sql .= " concat(cli.nome,' ',cli.cognome) as nome_cognome,concat(cli.cognome,' ',cli.nome) as cognome_nome, cli.luogo_di_nascita,sta.* ";        
        $sql .= " FROM CLIENTI cli " ;
        $sql .= " left join statino sta on (cli.cod_cli = sta.cod_cli and sta.attivo = true) ";
        $sql .= " WHERE cli.cod_ut = '{$cod_ut}' {$cond} order by cognome,nome ";*/

        $sql = " SELECT max(cli.cod_ut) as cli_cod_ut,cli.cod_cli as cli_cod_cli,max(cli.nome) as nome,max(cli.cognome) as cognome,max(cli.data_nascita) as data_nascita,max(cli.sesso) as sesso,max(concat(cli.nome,' ',cli.cognome)) as nome_cognome,max(concat(cli.cognome,' ',cli.nome)) as cognome_nome,max(cli.luogo_di_nascita) as luogo_di_nascita,";
        //$sql .= "GROUP_CONCAT(sta.lavori) as lavori,GROUP_CONCAT(griglia_denti) as griglia_denti,";
        $sql .= "group_concat(cod_statino) as cod_statino ";
        $sql .= "from CLIENTI cli ";
        $sql .= "left join statino sta on (cli.cod_cli = sta.cod_cli and sta.attivo = true) ";
        $sql .= "WHERE cli.cod_ut = '{$cod_ut}' {$cond} ";
        $sql .= "group by cli_cod_cli,cognome,nome  order by cognome,nome ";
        error_log( "getClienti:".$sql." \n",3,'/app/simmi.log') ;
        $stmt = $db->prepare($sql);
        
        $stmt->execute();
        $mainCount=$stmt->rowCount();
        $cliData = $stmt->fetchAll(PDO::FETCH_OBJ);
        if($cliData){
            /*foreach ($cliData as $key => $object) {
                echo "ciao ".$object->cli_cod_ut;
                //var_dump($object->cli_cod_ut); 
                die ;
            }*/
            
            //print_r($cliData); die;
            $cliData = json_encode($cliData);
            if ($cod_cli != "") {
                return $cliData;
                    //$array = json_decode(json_encode($cliData[0]), True); 
                    //$data_nascita = $array['data_nascita'] ;
                    //$data_nascita = substr($data_nascita, 6, 2)."-". substr($data_nascita, 4, 2)."-".substr($data_nascita, 0, 4) ;
                    //$data_nascita = explode('-',$data_nascita) ;
                    //$data_nascita = $data_nascita[2]."/". $data_nascita[1]."/".$data_nascita[0] ;                    
                    //return  $array['cognome']."\t".$array['nome']. "\nSesso: ".$array['sesso']."\tdata di nascita: ".$data_nascita."\n" ;
            } else {
                    
                    echo '{"cliData": ' .$cliData . '}';
            }
         } else {
            echo '{"cliData":[]}';
         }
        } 
        catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
}

function getUtEmail($cod_ut = "") {
    $email ="";
    $db = getDB();
    $sql = " SELECT email FROM users where cod_ut = '{$cod_ut}' " ;
    $stmt = $db->prepare($sql);        
    $stmt->execute();
    $email = $stmt->fetch(PDO::FETCH_OBJ);
    return $email->email ;
}

function getMaxStatino() {
    $cod_statino = "";
    try {
        $oggi = date("Ymd") ;
        $db = getDB();
        $sql  = "select MAX(cod_statino) as \"cod_statino\"," ;    
        $sql .= "substr(MAX(cod_statino),1,8) as \"datamax\",";
        $sql .= "substr(MAX(cod_statino),12) * 1 as \"maxvalue\" ";
        $sql .= "from STATINO having datamax = '".$oggi."'";
        error_log("getMaxStatino\n".$sql."\n",3,'/app/simmi.log') ;
        $stmt = $db->prepare($sql);        
        $stmt->execute();
        $progressivo = 1 ;
        error_log("rowCount: ".$stmt->rowCount()."\n",3,'/app/simmi.log') ;
        if($stmt->rowCount()>0) {
            $row = $stmt->fetch(PDO::FETCH_OBJ);
            $progressivo = $progressivo + $row->maxvalue ;       
        }
        $progressivo = str_pad($progressivo, 5, "0", STR_PAD_LEFT);
        $cod_statino = $oggi."STA".$progressivo ;        
    } catch (\Throwable $th) {
        error_log("getMaxStatino: Error \n".$th."\n",3,'/app/simmi.log') ;
    }
    return $cod_statino ;  
}

function getNextCodUt($end) {
    $prof = "T"  ;
    if($end == 2) {
        $prof = "M"  ;
    }
    $db = getDB() ;
    $sql = " select MAX(cod_ut) as 'cod_ut' from users where profilo=".$end ;
    //echo $sql."  ".$prof;
    $stmt = $db->prepare($sql);        
    $stmt->execute();
    $getMaxStatino = $stmt->fetch(PDO::FETCH_OBJ);
    $tmp = explode($prof,$getMaxStatino->cod_ut);
    //echo "<pre>" ; print_r($tmp) ; die ;
    echo $tmp[1]*1 . " <<<<";
    $progressivo = $tmp[1]*1 + 1 ;
    $progressivo = str_pad($end, 7, "0", STR_PAD_LEFT);    
    $cod_statino = $prof.$progressivo;
    return $cod_statino ;
}

function getIdFolderFromDrive($cod_statino) {
    try {
        error_log( "getIdFolderFromDrive : ".$cod_statino."\n",3,'/app/simmi.log') ;
        $folderId = "" ;
        if(file_exists('/app/google/Google.php')) {
            require_once('/app/google/Google.php') ;
            $a = new MyGoogle();
            $folderId = $a->createForldersOnDrive($cod_statino);
            error_log( "folderId: ".$folderId." \n",3,'/app/simmi.log') ;
        }
        return $folderId ;
    } catch (\Throwable $th) {
        error_log( "getIdFolderFromDrive error: ".$th."\n",3,'/app/simmi.log') ;
        return null ;
    }
    
}

function setMaxStatino() {
    try {
        $request = \Slim\Slim::getInstance()->request();
        $arr = json_decode($request->getBody());
        $db = getDB();
        $db2 = getDB();
        $cod_statino = getMaxStatino();
        if ($cod_statino=="") {
            echo '{"status":"KO","msg": "Errore nella generazione dello statino."}';
            return;
        }
        $insert = "insert into STATINO (OWNER,LOWNER,cod_statino,id_google_event,cod_ut) values ('SYS','SYS','{$cod_statino}','TEMPORANEA','{$arr->cod_ut}')" ;        
        $stmt1 = $db2->prepare($insert);
        $stmt1->execute();
        $id_google_folder = getIdFolderFromDrive($cod_statino) ;
        echo '{"status":"OK","cod_statino": "'.$cod_statino.'","id_google_folder":"'.$id_google_folder.'"}';
    } catch (\Throwable $th) {
        echo '{"status":"KO","msg": "'.$th.'"}';

    }    
}

function creaCliente() {

    $request = \Slim\Slim::getInstance()->request();
    $arr = json_decode($request->getBody());

    $db = getDB();
    $db2 = getDB();
    $a = "(".$arr->cod_cli.")";    
    if ( strlen($a) == 2 ) {
        //echo "Dentro ".strlen($a);
        $sql = " select LPAD(MAX(cod_cli)+1,length(MAX(cod_cli)),\"0\") as 'cod_cli'  from clienti" ;
        $stmt = $db->prepare($sql);        
        $stmt->execute();
        $getMaxCli = $stmt->fetch(PDO::FETCH_OBJ);
        $cod_cli = $getMaxCli->cod_cli ;
    }  else {
        //echo "NON Dentro ".strlen($a);
        $cod_cli = $arr->cod_cli ;
    }  

    $cod_fisc = $cod_cli;
    //echo "SIMMI ".$arr->cod_ut;
    $insert = " REPLACE INTO `clienti` (`cod_cli`,`cod_ut`,`nome`,`cognome`,`data_nascita`,`sesso`,`luogo_di_nascita`,`cod_fiscale`) " ; 
    $insert .= " VALUES ('{$cod_cli}','{$arr->cod_ut}','{$arr->firstName}','{$arr->sureName}','{$arr->birthDate}','{$arr->gender}','{$arr->customerCity}','{$cod_fisc}') " ;
    //echo $insert ; 
    $stmt1 = $db2->prepare($insert);
    $stmt1->execute();

    $retGetCli = getClienti($cod_cli,$arr->cod_ut);
    //$retGetCli = "";
    echo '{"cod_cli": "'.$cod_cli.'","retGetCli":'.$retGetCli.'}';
}

function editStatino () {

    $request = \Slim\Slim::getInstance()->request();
    $arr = json_decode($request->getBody());

    echo '{"statinoAggiornato": "OK" }';

}
function salvaStatino() {
    try {
    
        $request = \Slim\Slim::getInstance()->request();
        $arr = json_decode($request->getBody());

        $lavori      = $arr[1] ;
        $bocca       = json_encode($arr[0]) ;    
        $paziente    = $arr[2] ; 
        $cod_ut      = $arr[3] ;
        $cod_medico  = $arr[4] ;    
        $cod_statino = $arr[5] ;
        $preventivo  = $arr[6] ;
        $preventivo  = $preventivo === 'true'? 1: 0;
        $modalita    = $arr[7];
        $noteDenti   = $arr[8];

        $data_creazione = date("YmdHis") ;
        $data_modifica  = date("YmdHis") ;
        $cod_cli = $paziente ;
        if($cod_statino == "") $cod_statino = getMaxStatino();
        $db  = getDB();
        $db2 = getDB();

        $sql = "";
        $pages_array = array();
        $i=0;
        $id_google_events = "";
        foreach ($lavori as $key => $value) {
            $pages_array[$i]->title = $value->title;
            $pages_array[$i]->name = $value->name;
            $pages_array[$i]->de = $value->de;
            $pages_array[$i]->du = $value->du;
            $pages_array[$i]->icon = $value->icon;
            $pages_array[$i]->note = $value->note;
            $pages_array[$i]->color = $value->color;
            $pages_array[$i]->id_google_event = $value->id_google_event;
            
            error_log("[".$value->cod_statino. "][".$value->title."]\n",3,'/app/simmi.log') ;
            error_log("de[".$value->de. "] du[".$value->du."]\n",3,'/app/simmi.log') ;

            if ($value->de != '' && $value->du != '') {
                $data_entrata   = $value->de ;        
                $data_uscita    = $value->du ;
                $data_entrata_db = explode("T",$data_entrata) ;            
                $data_e = $data_entrata_db[0] ;            
                $de = str_replace("-","",$data_e) ;
                $lavori = addslashes($lavori) ;    
                $data_uscita = str_replace("-","",$data_uscita) ;
                
                $a1 = array('email' => getUtEmail($cod_ut) ) ;
                //$a2 = array('email' => SYS_EMAIL) ;            
                $ATTENDEES_EMAIL = array() ;
                array_push($ATTENDEES_EMAIL ,$a1);

                if(file_exists('/app/google/Google.php')) {                
                    require_once('/app/google/Google.php') ;
                    $param = array() ;                
                    //$note .= "Dottor\t".getMedici($cod_medico)." \nPaziente\t".getClienti($cod_cli,$cod_medico)  ;
                    $note = "Dottor\t".getMedici($cod_medico)." \n" ;              

                    $note .= "\nTipo di Lavoro:\t".$pages_array[$i]->title ;
                    $note .= "\n".$noteDenti->superiore ;
                    $note .= "\n".$noteDenti->inferiore ;
                    $note .= "\nData ingresso\t".$data_e ;
                    $note .= "\nData uscita\t".$pages_array[$i]->du ;
                    $note .= "\nOra uscita\t".$pages_array[$i]->ou ;
                    $note .= "\n".$pages_array[$i]->note ;
                    $param['transparency'] = "transparent";
                    $param['visibility'] = "private" ;
                    $param['summary'] = "Ingresso - ".$pages_array[$i]->title." - Dott. ".getMedici($cod_medico)." - Codice Lavoro. ". $cod_statino;
                    $param['location'] = "Napoli NA, Italia" ;
                    $param['description'] = $note;
                    $param['start'] = array();
                    $param['start']['dateTime'] = $data_e . "T".date("H:i:s") ;
                    $param['start']['timeZone'] = 'Europe/Rome' ;
                    $param['end'] = array();
                    $param['end']['dateTime'] = $data_e . "T".date("H:i:s");
                    $param['end']['timeZone'] = 'Europe/Rome' ;
                    $param['recurrence'] = array();
                    $param['recurrence'] = 'RRULE:FREQ=DAILY;COUNT=2';
                    
                    $param['attendees'] = $ATTENDEES_EMAIL ;
                    $param['reminders'] = array() ;
                    $param['reminders']['useDefault'] = FALSE ;
                    $param['reminders']['overrides'] = array() ;
                    $param['reminders']['overrides'] =  array(
                        array('method' => 'email', 'minutes' => 1),
                        array('method' => 'popup', 'minutes' => 1)
                        ) ;
                    $mg = new MyGoogle();
                    error_log("id_google_event = ".$pages_array[$i]->id_google_event."\n",3,'/app/simmi.log') ;
                    if($pages_array[$i]->id_google_event=='') {
                        //Creo un nuovo Item in calendar
                        $arr1 = $mg->CreateCalendarEvent($param,ID_GOOGLE_CALENDAR_IN) ;

                        $param['summary'] = "Uscita - ".$pages_array[$i]->title." - Dott. ".getMedici($cod_medico)." - Codice Lavoro. ". $cod_statino;
                        //$param['start']['dateTime'] = $value->du . "T". ORA_ALERT_CALENDAR_OUT ;
                        //$param['end']['dateTime'] = $value->du . "T". ORA_ALERT_CALENDAR_OUT ;
                        $param['start']['dateTime'] = $value->du . "T". $value->ou ;
                        $param['end']['dateTime'] = $value->du . "T". $value->ou ;

                        //$mg = new MyGoogle();
                        $arr2 = $mg->CreateCalendarEvent($param,ID_GOOGLE_CALENDAR_OUT) ;

                        $pages_array[$i]->id_google_event = $arr2['id'] ;
                        $id_google_events = $id_google_events . "," .$arr2['id'];
                        
                        $sql  = "select id_google_drive from imagesdata where 1>0 ";
                        $sql .= "and cod_statino = '{$cod_statino}' ";
                        $sql .= "and tipolavoro = '{$pages_array[$i]->name}' " ;
                        error_log('2)QUERY: '.$sql . "\n",3,'/app/simmi.log') ; 
                        $stmt3 = $db->prepare($sql);            
                        $stmt3->execute();
                        $mainCount=$stmt3->rowCount();
                        $id_google_drives = $stmt3->fetchAll(PDO::FETCH_OBJ);
                        $imgsArray = objectToArray($id_google_drives);
                        //error_log('3)id_google_drives: '.print_r($imgsArray,TURE) . "\n",3,'/app/simmi.log') ;
                        $i=0;
                        if (sizeof($imgsArray)>0)  {
                            error_log( "Creo la cartella su drive chiamata [".$arr[cod_statino]."]" . "\n",3,'/app/simmi.log') ;
                            $a = new MyGoogle();
                            foreach ($imgsArray as $key => $file_id) {                    
                                //error_log('1)key: '.$key . "\n",3,'/app/simmi.log') ;
                                $fileId = $imgsArray[$key]['id_google_drive'] ;
                                //error_log('2)fileId: '.$fileId . "\n",3,'/app/simmi.log') ;
                                //ID_GOOGLE_CALENDAR_OUT
                                //error_log('3)ID_GOOGLE_CALENDAR_OUT: '. ID_GOOGLE_CALENDAR_OUT . "\n",3,'/app/simmi.log') ;  
                                $a->addAttachment(ID_GOOGLE_CALENDAR_OUT, $id_google_event, $fileId);
                            } 
                        }
                    } else {
                        //modifico l'evento sul google calendar
                        $doUpdate = false ;
                        error_log("Prelevo le info da google e lo aggiorno \n",3,'/app/simmi.log') ;
                        $getEventOut = $mg->getCalendarEvent(ID_GOOGLE_CALENDAR_OUT,$pages_array[$i]->id_google_event) ;
                        error_log( "ret getCalendarEvent = ".print_r($getEventOut,true)  . "\n",3,'/app/simmi.log') ;
                        $event = json_decode($getEventOut);

                        if ($event->description != $param['description']) $doUpdate = true ;
                        //if ($event->start->dateTime != $value->du . "T". ORA_ALERT_CALENDAR_OUT) $doUpdate = true ;
                        if ($event->start->dateTime != $value->du . "T". $value->ou) $doUpdate = true ;
                        if ($doUpdate) {

                            //$param['start']['dateTime'] = $value->du . "T". ORA_ALERT_CALENDAR_OUT ;
                            //$param['end']['dateTime'] = $value->du . "T". ORA_ALERT_CALENDAR_OUT ;
                            $param['start']['dateTime'] = $value->du . "T". $value->ou ;
                            $param['end']['dateTime'] = $value->du . "T". $value->ou ;

                            $updatedEvent = $mg->updateCalendarEvent(ID_GOOGLE_CALENDAR_OUT,$pages_array[$i]->id_google_event,$param);

                        } else {
                            error_log("Nulla d'aggiornare per l'evento ".$pages_array[$i]->id_google_event."\n",3,'/app/simmi.log') ;

                        }
                    }                
                    
                } else {
                    error_log("Modulo per l'integrazione Google non presente\n",3,'/app/simmi.log') ;
                }
            } else {
                error_log("Scarto questo tipo di lavorzione per mancaza di un intervallo di date\n",3,'/app/simmi.log') ;
            }
            $i++;      
        }

        error_log( "pages_array = ".json_encode($pages_array)  . "\n",3,'/app/simmi.log') ;
        $id_google_events = substr($id_google_events, 1); 
        $lavori = json_encode($pages_array) ; 
        error_log( "modalita = ".$modalita  . "\n",3,'/app/simmi.log') ;             
        if ($modalita != 'EDIT') {
            $sql  = "replace into STATINO (" ;            
            $sql .= "owner, data_creazione,id_google_event, ";            
            $sql .= "lowner, data_modifica, cod_statino, cod_ut, cod_cli, cod_bocca, lavori ,griglia_denti,data_entrata,data_uscita,preventivo)"  ;
            $sql .= " values (";            
            $sql .= "'{$cod_ut}', '{$data_creazione}','{$id_google_events}',";            
            $sql .= " '{$cod_ut}','{$data_modifica}', '{$cod_statino}', '{$cod_ut}','{$cod_cli}', '00001', '{$lavori}' ,'{$bocca}','{$de}','{$data_uscita}' ,{$preventivo}) " ;
        } else {
            $sql = "update STATINO set " ; 
            $sql.= "lowner='{$cod_ut}',";
            $sql.= "data_modifica='{$data_modifica}',";
            $sql.= "lavori='{$lavori}',";
            $sql.= "griglia_denti='{$bocca}',";
            //$sql.= "data_entrata='{$de}',";
            $sql.= "data_uscita='{$data_uscita}', ";
            $sql.= "id_google_event=CONCAT(id_google_event,',','{$id_google_events}' ) ";
            $sql.=" where cod_statino = '{$cod_statino}' ";
        }
        error_log( "sql = ".$sql  . "\n",3,'/app/simmi.log') ;
        $stmt = $db2->prepare($sql);
        $stmt->execute();
        echo '{"statinoSalvato": "OK" }';
    } catch (\Throwable $th) {
        error_log( "error = ".$th  . "\n",3,'/app/simmi.log') ;
        echo '{"statinoSalvato": "KO" }';
    }
}

function salvaStatinoOld() {

    $request = \Slim\Slim::getInstance()->request();
    $arr = json_decode($request->getBody());
    //echo "<pre>" ; print_r ($arr) ; die ;    

    $lavori      = json_encode($arr[1]) ;
    error_log( print_r($lavori,true) . "\n",3,'/app/simmi.log') ;

    $bocca       = json_encode($arr[0]) ;    
    $paziente    = $arr[2] ; 
    $cod_ut      = $arr[3] ;
    $cod_medico  = $arr[4] ;    
    $cod_statino  = $arr[5] ;
    $preventivo  = $arr[6] ;
    $preventivo = $preventivo === 'true'? 1: 0;
    $modalita = $arr[7];
    $noteDenti = $arr[8];
    
    $data_creazione = date("YmdHis") ;
    $data_modifica  = date("YmdHis") ;
    $cod_cli = $paziente ;
    if($cod_statino == "") $cod_statino = getMaxStatino();
    $db = getDB();
    $db2 = getDB();
    //echo "<pre>" ; print_r($tipo_lavori) ; die ;
    while (list ($key, $val) = each ($arr[1]) ) {
        $arr =  (array) $val;
        error_log( print_r($arr,true) . "\n",3,'/app/simmi.log') ;

        //echo $arr[note] ; die ;

        $data_entrata   = $arr[de] ;        
        $data_uscita    = $arr[du] ;
        
        //if (!strstr($data_entrata,"_de") || !strstr($data_uscita,"_du")) {
            if ( $data_entrata != "" || $data_uscita != "" ) {
            $data_entrata_db = explode("T",$data_entrata) ;            
            $data_e = $data_entrata_db[0] ;            
            $de = str_replace("-","",$data_e) ;
            //echo $lavori ; die ;
            $lavori = addslashes($lavori) ;    
            $data_uscita = str_replace("-","",$data_uscita) ;
            
            if ($modalita != 'EDIT') {
                $sql  = "replace into STATINO (" ;            
                $sql .= "owner, data_creazione,id_google_event, ";            
                $sql .= "lowner, data_modifica, cod_statino, cod_ut, cod_cli, cod_bocca, lavori ,griglia_denti,data_entrata,data_uscita,preventivo)"  ;
                $sql .= " values (";            
                $sql .= "'{$cod_ut}', '{$data_creazione}','TEMPORANEA',";            
                $sql .= " '{$cod_ut}','{$data_modifica}', '{$cod_statino}', '{$cod_ut}','{$cod_cli}', '00001', '{$lavori}' ,'{$bocca}','{$de}','{$data_uscita}' ,{$preventivo}) " ;
            } else {
                $sql = "update STATINO set " ; 
                $sql.= "lowner='{$cod_ut}',";
                $sql.= "data_modifica='{$data_modifica}',";
                $sql.= "lavori='{$lavori}',";
                $sql.= "griglia_denti='{$bocca}',";
                $sql.= "data_entrata='{$de}',";
                $sql.= "data_uscita='{$data_uscita}' ";
                $sql.=" where cod_statino = '{$cod_statino}' ";
            }
            //echo $sql ;die;
            //( $sql . "\n",3,'/app/simmi.log') ;

            $stmt = $db->prepare($sql);
            $stmt->execute(); 

            $a1 = array('email' => getUtEmail($cod_ut) ) ;
            //$a2 = array('email' => SYS_EMAIL) ;
            
            $ATTENDEES_EMAIL = array() ;
            array_push($ATTENDEES_EMAIL ,$a1);

            if(file_exists('/app/google/Google.php')) {
                require_once('/app/google/Google.php') ;
                $param = array() ;
                
                //$note .= "Dottor\t".getMedici($cod_medico)." \nPaziente\t".getClienti($cod_cli,$cod_medico)  ;
                $note .= "Dottor\t".getMedici($cod_medico)." \n" ;              

                $note .= "\nTipo di Lavoro:\t".$arr[title] ;
                $note .= "\n".$noteDenti->superiore ;
                $note .= "\n".$noteDenti->inferiore ;
                $note .= "\nData ingresso\t".$data_e ;
                $note .= "\nData uscita\t".$arr[du] ;
                $note .= "\n".$arr[note] ;

                //error_log( $note . "\n",3,'/app/simmi.log') ;

                //echo addslashes($note) ; die ;
                $param['transparency'] = "transparent";
                $param['visibility'] = "private" ;
                $param['summary'] = "Ingresso - ".$arr[title]." - Dott. ".getMedici($cod_medico)." - Codice Lavoro. ". $cod_statino;
                $param['location'] = "Napoli NA, Italia" ;
                $param['description'] = $note;
                $param['start'] = array();
                $param['start']['dateTime'] = $data_e . "T".date("H:i:s") ;
                $param['start']['timeZone'] = 'Europe/Rome' ;
                $param['end'] = array();
                $param['end']['dateTime'] = $data_e . "T".date("H:i:s");
                $param['end']['timeZone'] = 'Europe/Rome' ;
                $param['recurrence'] = array();
                $param['recurrence'] = 'RRULE:FREQ=DAILY;COUNT=2';
                
                $param['attendees'] = $ATTENDEES_EMAIL ;
                $param['reminders'] = array() ;
                $param['reminders']['useDefault'] = FALSE ;
                $param['reminders']['overrides'] = array() ;
                $param['reminders']['overrides'] =  array(
                    array('method' => 'email', 'minutes' => 1),
                    array('method' => 'popup', 'minutes' => 1)
                  ) ;
                $mg = new MyGoogle();
                $arr1 = $mg->CreateCalendarEvent($param,ID_GOOGLE_CALENDAR_IN) ;

                $param['summary'] = "Uscita - Dott. ".getMedici($cod_medico)." - Codice Lavoro. ". $cod_statino;
                //$param['start']['dateTime'] = $arr[du] . "T". ORA_ALERT_CALENDAR_OUT ;
                //$param['end']['dateTime'] = $arr[du] . "T". ORA_ALERT_CALENDAR_OUT ;
                $param['start']['dateTime'] = $arr[du] . "T". $arr[ou] ;
                $param['end']['dateTime'] = $arr[du] . "T". $arr[ou] ;

                //$mg = new MyGoogle();
                $arr2 = $mg->CreateCalendarEvent($param,ID_GOOGLE_CALENDAR_OUT) ;                

                $id_google_event = $arr2['id'] ;
                $update  = " update statino ";
                $update .= " set id_google_event = ";
                if ($modalita === 'EDIT') {
                    $update .= "CONCAT(id_google_event,',','{$id_google_event}' )";
                } else {
                    $update .= " '{$id_google_event}' ";
                }
                $update .= " where cod_statino='{$cod_statino}' ";
                if ($modalita !== 'EDIT') {
                    $update .= " and id_google_event='TEMPORANEA' ";
                }
                //$update .= " and data_entrata='{$de}' and data_uscita='$data_uscita' " ;
                //echo $update ;
                error_log('modalita['.$modalita.'] -> update: '. $update . "\n",3,'/app/simmi.log') ; 
                $stmt2 = $db2->prepare($update);
                $stmt2->execute();
                
                $sql  = "select id_google_drive from imagesdata where 1>0 ";
                $sql .= "and cod_statino = '{$arr[cod_statino]}' ";
                $sql .= "and tipolavoro = '{$arr[name]}' " ;
                error_log('2)QUERY: '.$sql . "\n",3,'/app/simmi.log') ; 
                $stmt3 = $db->prepare($sql);
        
                $stmt3->execute();
                $mainCount=$stmt3->rowCount();
                $id_google_drives = $stmt3->fetchAll(PDO::FETCH_OBJ);
                $imgsArray = objectToArray($id_google_drives);
                //error_log('3)id_google_drives: '.print_r($imgsArray,TURE) . "\n",3,'/app/simmi.log') ;
                $i=0;
                if (sizeof($imgsArray)>0)  {
                    error_log( "Creo la cartella su drive chiamata [".$arr[cod_statino]."]" . "\n",3,'/app/simmi.log') ;
                    $a = new MyGoogle();
                    foreach ($imgsArray as $key => $file_id) {                    
                        //error_log('1)key: '.$key . "\n",3,'/app/simmi.log') ;
                        $fileId = $imgsArray[$key]['id_google_drive'] ;
                        //error_log('2)fileId: '.$fileId . "\n",3,'/app/simmi.log') ;
                        //ID_GOOGLE_CALENDAR_OUT
                        //error_log('3)ID_GOOGLE_CALENDAR_OUT: '. ID_GOOGLE_CALENDAR_OUT . "\n",3,'/app/simmi.log') ;  
                        $a->addAttachment(ID_GOOGLE_CALENDAR_OUT, $id_google_event, $fileId);
                    } 
                }
                
            }
        } 
    }
    echo '{"statinoSalvato": "OK","modalita":"{$modalita}" }';
    
}

function objectToArray($d) {
    if (is_object($d)) {
        // Gets the properties of the given object
        // with get_object_vars function
        $d = get_object_vars($d);
    }
    
    if (is_array($d)) {
        /*
        * Return array converted to object
        * Using __FUNCTION__ (Magic constant)
        * for recursive call
        */
        return array_map(__FUNCTION__, $d);
    }
    else {
        // Return array
        return $d;
    }
}

/* ### User registration ### */
function signup() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $email=$data->email;
    $name=$data->name;
    $username=$data->username;
    $password=$data->password;
    $profile=$data->profilo;
    $cod_ut = getNextCodUt($profile);
    //echo "<pre>" ; print_r($data) ;die;
    try {
        
        $username_check = preg_match('~^[A-Za-z0-9_]{3,20}$~i', $username);
        $email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email);
        $password_check = preg_match('~^[A-Za-z0-9!@#$%^&*()_]{6,20}$~i', $password);
        
        //echo $email_check.'<br/>'.$email;
        
        if (
            strlen(trim($username))>0 && 
            strlen(trim($password))>0 && 
            strlen(trim($email))>0 && 
            $email_check>0 && 
            $username_check>0 && 
            $password_check>0) {
            //echo 'here';
            $db = getDB();
            $userData = '';
            $sql = "SELECT user_id FROM users WHERE username=:username or email=:email";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("username", $username,PDO::PARAM_STR);
            $stmt->bindParam("email", $email,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount==0)
            {
                
                /*Inserting user values*/
                $sql1="INSERT INTO users(username,password,email,name,profilo,cod_ut)VALUES(:username,:password,:email,:name,:profile,:cod_ut)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("username", $username,PDO::PARAM_STR);
                $password=hash('sha256',$data->password);
                $stmt1->bindParam("password", $password,PDO::PARAM_STR);
                $stmt1->bindParam("email", $email,PDO::PARAM_STR);
                $stmt1->bindParam("name", $name,PDO::PARAM_STR);
                $stmt1->bindParam("profile", $profile,PDO::PARAM_STR);
                $stmt1->bindParam("cod_ut", $cod_ut,PDO::PARAM_STR);
                $stmt1->execute();
                $userData=internalUserDetails($email);
                
            }
            
            $db = null;
         

            if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Enter valid data"}}';
            }

           
        }
        else{
            echo '{"error":{"text":"Enter valid data"}}';
        }
    }
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function email() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $email=$data->email;

    try {
       
        $email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email);
       
        if (strlen(trim($email))>0 && $email_check>0)
        {
            $db = getDB();
            $userData = '';
            $sql = "SELECT user_id FROM emailUsers WHERE email=:email";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("email", $email,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount==0)
            {
                
                /*Inserting user values*/
                $sql1="INSERT INTO emailUsers(email)VALUES(:email)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("email", $email,PDO::PARAM_STR);
                $stmt1->execute();
                
                
            }
            $userData=internalEmailDetails($email);
            $db = null;
            if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Enter valid dataaaa"}}';
            }
        }
        else{
            echo '{"error":{"text":"Enter valid data"}}';
        }
    }
    
    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

/* ### internal Username Details ### */
function internalUserDetails($input) {
    
    try {
        $db = getDB();
        $sql = "SELECT user_id, name, email, username FROM users WHERE username=:input or email=:input";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("input", $input,PDO::PARAM_STR);
        $stmt->execute();
        $usernameDetails = $stmt->fetch(PDO::FETCH_OBJ);
        $usernameDetails->token = apiToken($usernameDetails->user_id);
        $db = null;
        return $usernameDetails;
        
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    
}

function getMedici( $id_medico="" ){
    try {
         
        if(1){
            $mediciData = '';
            $db = getDB();
            $cond = "" ;
            if($id_medico!="") {
                $cond = " and cod_utente = '{$id_medico}' " ;
            }
            $sql = "SELECT * FROM UTENTI  where tipo_utente = 2 {$cond} ORDER BY cognome,nome ";

            $stmt = $db->prepare($sql);          
            $stmt->execute();
            $mediciData = $stmt->fetchAll(PDO::FETCH_OBJ);
           
            $db = null;

            if($mediciData) {
                if ($id_medico!="") {
                    $array = json_decode(json_encode($mediciData[0]), True);            
                    return  $array['cognome']." ".$array['nome'];
                } else {
                    echo '{"mediciData": ' . json_encode($mediciData) . '}';
                }                
            }  else {
                echo '{"mediciData": ""}';
            }            
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function getStatini () {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

   //echo "<pre>" ; print_r($data) ; //die ;

    $cod_ut=$data->cod_ut;
    $profilo=$data->profilo;
    
    try {
         
        if(1){
                $statiniData = '';
                $db = getDB();
                $cond = "" ;
                if ( $profilo == 2 ) {
                    //se sono un medico
                    $cond .= " and S.cod_ut = '{$cod_ut}'"; ;
                }

                if ($data->tipo == 'fromCercaStatino') {
                    if( $data->startDate != '' ) {
                        
                        $data_start = str_replace("-","",$data->startDate) ;                        
                        $cond .= " and S.data_entrata >= '{$data_start}'"; 
                    }
                    if( $data->endDate != '' ) {
                        $data_end = str_replace("-","",$data->endDate) ;
                        $cond .= " and S.data_uscita <= '{$data_end}'"; 
                    }
                    
                    $cond .= " and S.cod_cli = '{$data->cli_cod_cli}'"; 
                }

                $sql  = " SELECT griglia_denti,lavori,owner, data_creazione, lowner, data_modifica, cod_statino, S.cod_ut, S.cod_cli, C.nome as 'nome_cli', C.cognome as 'cognome_cli', ";
                $sql .= " concat(U.cognome,' ',U.nome) as 'medico', data_nascita , sesso , concat(substr(data_modifica,1,4),'-',substr(data_modifica,5,2),'-' ";
                $sql .= " ,substr(data_modifica,7,2), 'T',substr(data_modifica,9,2),':',substr(data_modifica,11,2),':',substr(data_modifica,13,2)) as 'DATA_TS', " ;
                $sql .= " concat(substr(data_entrata,1,4),'-',substr(data_entrata,5,2),'-' ";
                $sql .= " ,substr(data_entrata,7,2), 'T',substr(data_modifica,9,2),':',substr(data_modifica,11,2),':',substr(data_modifica,13,2)) as 'DATA_TS_E'," ;
                $sql .= " concat(substr(data_uscita,1,4),'-',substr(data_uscita,5,2),'-' ";
                $sql .= " ,substr(data_uscita,7,2), 'T',substr(data_modifica,9,2),':',substr(data_modifica,11,2),':',substr(data_modifica,13,2)) as 'DATA_TS_U'" ;
                $sql .= " FROM STATINO AS S " ; 
                $sql .= " JOIN CLIENTI AS C on ( S.cod_cli = C.cod_cli ) JOIN UTENTI AS U on ( U.cod_utente = C.cod_ut ) " ;
                $sql .= " where 1>0 ".$cond ;
                $sql .= " and preventivo = false " ; 
                $sql .= " ORDER BY data_modifica desc ";
                //echo $sql;
                error_log( $sql . "\n",3,'/app/simmi.log') ;

                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
                $stmt->bindParam("lastCreated", $lastCreated, PDO::PARAM_STR);
          
                $stmt->execute();
                $statiniData = $stmt->fetchAll(PDO::FETCH_OBJ);
            
                $db = null;

            if($statiniData) {
                echo '{"statiniData": ' . json_encode($statiniData) . '}';
            } else {
                echo '{"statiniData": ""}';
            }
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getFeed(){
    try {
         
        if(1){
            $feedData = '';
            $db = getDB();
          
                $sql = "SELECT * FROM feed  ORDER BY feed_id DESC LIMIT 15";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
                $stmt->bindParam("lastCreated", $lastCreated, PDO::PARAM_STR);
          
            $stmt->execute();
            $feedData = $stmt->fetchAll(PDO::FETCH_OBJ);
           
            $db = null;

            if($feedData)
            echo '{"feedData": ' . json_encode($feedData) . '}';
            else
            echo '{"feedData": ""}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function feed(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    //echo "<pre>" ; print_r($data) ; die ;
    $user_id=$data->user_id;
    $token=$data->token;
    $lastCreated = $data->lastCreated;
    
    $systemToken=apiToken($user_id);
   
    try {
         
        if ( $systemToken == $token ) {
            $feedData = '';
            $db = getDB();
            if($lastCreated){
                $sql = "SELECT * FROM feed WHERE user_id_fk=:user_id AND created < :lastCreated ORDER BY feed_id DESC LIMIT 5";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
                $stmt->bindParam("lastCreated", $lastCreated, PDO::PARAM_STR);
            }
            else{
                $sql = "SELECT * FROM feed WHERE user_id_fk=:user_id ORDER BY feed_id DESC LIMIT 5";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            }
            $stmt->execute();
            $feedData = $stmt->fetchAll(PDO::FETCH_OBJ);
           
            $db = null;

            if($feedData)
            echo '{"feedData": ' . json_encode($feedData) . '}';
            else
            echo '{"feedData": ""}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function feedUpdate(){

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $feed=$data->feed;
    
    $systemToken=apiToken($user_id);
   
    try {
         
        if($systemToken == $token) {
         
            
            $feedData = '';
            $db = getDB();
            $sql = "INSERT INTO feed ( feed, created, user_id_fk) VALUES (:feed,:created,:user_id)";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("feed", $feed, PDO::PARAM_STR);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $created = time();
            $stmt->bindParam("created", $created, PDO::PARAM_INT);
            $stmt->execute();
            


            $sql1 = "SELECT * FROM feed WHERE user_id_fk=:user_id ORDER BY feed_id DESC LIMIT 1";
            $stmt1 = $db->prepare($sql1);
            $stmt1->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt1->execute();
            $feedData = $stmt1->fetch(PDO::FETCH_OBJ);


            $db = null;
            echo '{"feedData": ' . json_encode($feedData) . '}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function feedDelete(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $feed_id=$data->feed_id;
    
    $systemToken=apiToken($user_id);
   
    try {
         
        if($systemToken == $token){
            $feedData = '';
            $db = getDB();
            $sql = "Delete FROM feed WHERE user_id_fk=:user_id AND feed_id=:feed_id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindParam("feed_id", $feed_id, PDO::PARAM_INT);
            $stmt->execute();
            
           
            $db = null;
            echo '{"success":{"text":"Feed deleted"}}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
       
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }   
    
}

function userImage(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    error_log( "userImage :\n",3,'/app/simmi.log') ;
    $user_id_fk     =   $data->user_id;
    $token          =   $data->token;

    $imageB64       =   $data->imageB64;
    $cod_statino    =   $data->cod_statino;
    error_log( "cod_statino :".$data->cod_statino."\n",3,'/app/simmi.log') ;
    $id_google_folder = $data->id_google_folder;
    error_log( "id_google_folder " . $id_google_folder . "\n",3,'/app/simmi.log') ;
    $id_google_drive=   getGoogleDriveid($imageB64,$cod_statino,$id_google_folder);
    $tipolavoro     =   $data->tipolavoro;
    $systemToken    =   apiToken($user_id);
    $img_id         = 0 ;
    
    try {
        if(1){

            $db2 = getDB();
            //$insert = "insert into imagesData (b64,user_id_fk,cod_statino,tipolavoro,id_google_drive) values ('{$imageB64}',{$user_id_fk},'{$cod_statino}','{$tipolavoro}','{$id_google_drive}')" ;
            $insert = "insert into imagesData (user_id_fk,cod_statino,tipolavoro,id_google_drive) values ({$user_id_fk},'{$cod_statino}','{$tipolavoro}','{$id_google_drive}')" ;
            //error_log( "userImage :\ninsert" . $insert . "\n",3,'/app/simmi.log') ;
            $stmt1 = $db2->prepare($insert);
            $stmt1->execute();

            $db2 = null;
            echo '{"success":{"status":"uploaded"}}';

        } else{
            echo '{"error":{"text":"No access"}}';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
function getGoogleDriveid($imageB64,$cod_statino,$id_google_folder) {

    if(file_exists('/app/google/Google.php')) {
        require_once('/app/google/Google.php') ;
        $mg = new MyGoogle();
        return $mg->UpLoadImageOnDrive($imageB64,$cod_statino,$id_google_folder) ;
    }
    return "" ;
}
function getImages(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    
    $user_id    =   $data->user_id;
    $token      =   $data->token;
    $cod_statino=   $data->cod_statino;
    $tipolavoro =   $data->tipolavoro;
    $systemToken=   apiToken($user_id);

    try {
        if(1){
            $db = getDB();
            $sql  = "SELECT b64 as photo FROM imagesData where 1>0 and b64 != '' ";

            if ($tipolavoro  != '') $sql .= "and tipolavoro = '{$tipolavoro}' ";
            if ($cod_statino != '') $sql .= "and cod_statino = '{$cod_statino}' ";
            
            $stmt = $db->prepare($sql);
            $stmt->execute();

            $imageData = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;

            echo '{"imageData": ' . json_encode($imageData) . '}';

        } else{
            echo '{"error":{"text":"No access"}}';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}
?>