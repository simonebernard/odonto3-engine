<?php
require '/app/vendor/autoload.php';
require '/app/api/google_config.php';

class MyGoogle {
    function __construct() {
        error_log( "start MyGoogle __construct\n",3,'/app/simmi.log') ;
        $clientGetted = null ;
        //$clientDriveGetted = null ;
        $cli = $this->getClient();
        //$cliD = $this->getClientDrive() ;
        $event = null ;
        $service = null;
    }
    function getNextTenEvent() {
        // Get the API client and construct the service object.
        $client = $this->getClient();
        $service = new Google_Service_Calendar($client);

        // Print the next 10 events on the user's calendar.
        $calendarId = 'primary';

        $optParams = array(
        'maxResults' => 10,
        'orderBy' => 'startTime',
        'singleEvents' => true,
        'timeMin' => date('c'),
        );
        $results = $service->events->listEvents($calendarId, $optParams);
        $events = $results->getItems();
    }
    function getClient() {
        error_log( "start getClient\n",3,'/app/simmi.log') ;
        if ( $this->clientGetted == null ) {
            $client = new Google_Client();
            $client->setApplicationName('Google Calendar API PHP Quickstart');
            $client->setScopes(Google_Service_Calendar::CALENDAR);
            $client->setAuthConfig(PATH_TO_CREDENTIAL);
            //$client->setAuthConfig(PATH_TO_CREDENTIAL);
            $client->setAccessType('offline');
            $client->setPrompt('select_account consent');
        
            // Load previously authorized token from a file, if it exists.
            $tokenPath = PATH_TO_CALENDAR_TOKEN;
            //$tokenPath = '/app/token.json';
            if (file_exists($tokenPath)) {
                $accessToken = json_decode(file_get_contents($tokenPath), true);
                $client->setAccessToken($accessToken);
            }
            
            // If there is no previous token or it's expired.
            if ($client->isAccessTokenExpired()) {
                // Refresh the token if possible, else fetch a new one.
                if ($client->getRefreshToken()) {
                    $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
                } else {
                    // Request authorization from the user.
                    $authUrl = $client->createAuthUrl();
                    error_log( "Open the following link in your browser:\n".$authUrl."\n",3,'/app/simmi.log') ;
                    printf("Open the following link in your browser:\n%s\n", $authUrl);
                    print 'Enter verification code: ';
                    $authCode = trim(fgets(STDIN));
        
                    // Exchange authorization code for an access token.
                    $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
                    $client->setAccessToken($accessToken);
        
                    // Check to see if there was an error.
                    if (array_key_exists('error', $accessToken)) {
                        throw new Exception(join(', ', $accessToken));
                    }
                }
                // Save the token to a file.
                if (!file_exists(dirname($tokenPath))) {
                    mkdir(dirname($tokenPath), 0700, true);
                }
                file_put_contents($tokenPath, json_encode($client->getAccessToken()));
            }
            $this->clientGetted = $client ;
        } else {
            $client = $this->clientGetted ;
        }
        
        error_log( "end getClient\n",3,'/app/simmi.log') ;
        return $client;
    }
    function CreateCalendarEvent($param,$calendarId="") {
        error_log( "start CreateCalendarEvent\n",3,'/app/simmi.log') ;
        $client = $this->getClient();  
        $service = new Google_Service_Calendar($client);
        $event = new Google_Service_Calendar_Event($param);        
        if ( $calendarId == "" ) $calendarId = 'primary';                
        $event = $service->events->insert($calendarId, $event, ['sendUpdates' => 'all']);        
        $ret = array();        
        $ret['id'] = $event[id] ; 
        $ret['etag'] = $event[etag] ;
        $ret['iCalUID'] = $event[iCalUID] ;
        $ret['updated'] = $event[updated] ;
        $ret['htmlLink'] = $event[htmlLink] ;
        error_log( "end CreateCalendarEvent\n",3,'/app/simmi.log') ;
        return $ret ;
    }
    function getCalendarEvent($calendarId, $id_google_event) {
        error_log( "start getCalendarEvent\n",3,'/app/simmi.log') ;
        $client = $this->getClient();  
        $this->service = new Google_Service_Calendar($client);             
        $event = $this->service->events->get($calendarId, $id_google_event);
        $this->event = $event ;
        error_log( "end getCalendarEvent\n",3,'/app/simmi.log') ;
        return json_encode($event)  ;
    }
    function updateCalendarEvent($calendarId,$id_google_event,$param) {
        error_log( "start updateCalendarEvent\n",3,'/app/simmi.log') ;                
        error_log( "param = ".json_encode($param)."\n",3,'/app/simmi.log') ;
        $this->event->setDescription($param['description']);
        $start = new Google_Service_Calendar_EventDateTime();     
        $start->setDateTime($param['start']['dateTime']);
        $start->setTimeZone('Europe/Rome');
        $this->event->setStart($start);
        $end = new Google_Service_Calendar_EventDateTime();        
        $end->setDateTime($param['end']['dateTime']);
        $end->setTimeZone('Europe/Rome');        
        $this->event->setEnd($end);        
        $updatedEvent = $this->service->events->update($calendarId, $this->event->getId(), $this->event);
        error_log( "updatedEvent = ".json_encode($updatedEvent)."\n",3,'/app/simmi.log') ;        
        error_log( "end updateCalendarEvent\n",3,'/app/simmi.log') ;
        return $event ;
    }   
    function createForldersOnDrive($cod_statino) {
        try {
            error_log("createForldersOnDrive: {$cod_statino}\n",3,'/app/simmi.log') ;
            $root_folder = "1oPIxGKH9PTOh_np0kKzp5H1AblvQI8iE";
            $clientDrive = $this->getClientDrive();  
            //$clientDrive =   $this->cliD;
            $driveService = new Google_Service_Drive($clientDrive);
            $fileMetadata = new Google_Service_Drive_DriveFile(
                array(
                'name' => $cod_statino ,
                'parents' => array($root_folder),
                'mimeType' => 'application/vnd.google-apps.folder'
                )
            );

            $fileMetadata->setName($cod_statino);

            $folder = $driveService->files->create($fileMetadata, array('fields' => 'id'));

            error_log("Folder ID: ". $folder->id. "\n",3,'/app/simmi.log') ;
            return $folder->id ;
        } catch (\Throwable $th) {
            //throw $th;
            error_log("createForldersOnDrive error: ". $th. "\n",3,'/app/simmi.log') ;
            return null;
        }        
    }
    function UpLoadImageOnDrive($base64_string,$cod_statino,$id_google_folder) {
        $cdata = date("YmdHis") ;
        $file_name =  $cod_statino."_".$cdata . ".jpg";
        $filename_path = "/app/uploads/".$file_name ; 
        $decoded=base64_decode($base64_string);
        file_put_contents($filename_path,$decoded);
        
        $clientDrive = $this->getClientDrive();        
        $driveService = new Google_Service_Drive($clientDrive);

        $fileMetadata = new Google_Service_Drive_DriveFile(
            array(
            'name' => $file_name +'.jpg',
            'parents' => array($id_google_folder)
            )
        );
        //error_log("fileMetadata: ". print_r($fileMetadata,TRUE). "\n",3,'/app/simmi.log') ;
        $fileMetadata->setName($file_name);

        $content = file_get_contents($filename_path);
        $file = $driveService->files->create($fileMetadata, array(
            'data' => $content,
            'mimeType' => 'image/jpeg',
            'uploadType' => 'multipart',
            'fields' => 'id'));

        error_log("File ID: ". print_r($file,TRUE). "\n",3,'/app/simmi.log') ;
        return $file->id ;
    }
    function getClientDrive() {
        error_log("getClientDrive[".PATH_TO_CREDENTIAL."]\n",3,'/app/simmi.log') ;
        $client = new Google_Client();
        $client->setApplicationName('Google Drive API PHP Quickstart');
        $client->setScopes(Google_Service_Drive::DRIVE);
        $client->setAuthConfig(PATH_TO_CREDENTIAL);
        $client->setAccessType('offline');
        $client->setPrompt('select_account consent');

        $tokenPath = PATH_TO_DRIVE_TOKEN;
        if (file_exists($tokenPath)) {
            $accessToken = json_decode(file_get_contents($tokenPath), true);
            $client->setAccessToken($accessToken);
        }
        
        error_log("isAccessTokenExpired: ".$client->isAccessTokenExpired()." \n",3,'/app/simmi.log') ;
        if ($client->isAccessTokenExpired()) {
            // Refresh the token if possible, else fetch a new one.
            error_log("getRefreshToken: ".$client->getRefreshToken()."  \n",3,'/app/simmi.log') ;
            if ($client->getRefreshToken()) {
                $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            } else {
                // Request authorization from the user.
                $authUrl = $client->createAuthUrl();
                error_log("Open the following link in your browser:\n".authUrl."\n",3,'/app/simmi.log') ;
                print 'Enter verification code: ';
                $authCode = trim(fgets(STDIN));
    
                // Exchange authorization code for an access token.
                $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
                $client->setAccessToken($accessToken);
    
                // Check to see if there was an error.
                if (array_key_exists('error', $accessToken)) {
                    throw new Exception(join(', ', $accessToken));
                }
            }
            // Save the token to a file.
            if (!file_exists(dirname($tokenPath))) {
                mkdir(dirname($tokenPath), 0700, true);
            }
            error_log(" Refreshed Token: ".json_encode($client->getAccessToken())."  \n",3,'/app/simmi.log') ;
            file_put_contents($tokenPath, json_encode($client->getAccessToken()));
        }
        return $client;
    }
    function addAttachment( $calendarId, $eventId, $fileId) {
        error_log( "START addAttachment" . "\n",3,'/app/simmi.log') ;        
        error_log( "calendarId = " . $calendarId . "\n",3,'/app/simmi.log') ;
        error_log( "eventId = " . $eventId . "\n",3,'/app/simmi.log') ;
        error_log( "fileId = " . $fileId . "\n",3,'/app/simmi.log') ;

        $clientDrive = $this->getClientDrive();
        $driveService = new Google_Service_Drive($clientDrive);

        $client = $this->getClient();  
        $calendarService = new Google_Service_Calendar($client);
        
       
        $file = $driveService->files->get($fileId);
        //error_log( "file: \n".print_r($file,true) . "\n",3,'/app/simmi.log') ;       
        $event = $calendarService->events->get($calendarId, $eventId);
        //error_log( "event: \n".print_r($event,true) . "\n",3,'/app/simmi.log') ;
        $attachments = $event->attachments;
        
        $attachments[] = array(
            'fileId'=> $file->id,
            'iconLink' => 'https://ssl.gstatic.com/docs/doclist/images/icon_10_generic_list.png',
            'fileUrl' => 'https://drive.google.com/file/d/'.$file->id.'/view?usp=drive_web',
            'mimeType' => $file->mimeType,
            'title' => $file->name
        );

        error_log( "attachments: \n".print_r($attachments,true) . "\n",3,'/app/simmi.log') ;

        $changes = new Google_Service_Calendar_Event(array(
          'attachments' => $attachments
        ));
        error_log( "QUI dopo Changes" . "\n",3,'/app/simmi.log') ;

        $calendarService->events->patch($calendarId, $eventId, $changes, array(
          'supportsAttachments' => TRUE
        ));

        error_log( "QUI dopo patch" . "\n",3,'/app/simmi.log') ;
      }

}
?>