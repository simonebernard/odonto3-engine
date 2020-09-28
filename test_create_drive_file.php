<?php
require  '/app/vendor/autoload.php';

if (php_sapi_name() != 'cli') {
    throw new Exception('This application must be run on the command line.');
}

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient() {

    $client = new Google_Client();
    $client->setApplicationName('Google Calendar API PHP Quickstart');
    $client->setScopes(Google_Service_Calendar::CALENDAR);
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    // Load previously authorized token from a file, if it exists.
    $tokenPath = 'token.json';
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
    return $client;
}

function getClientDrive() {
    $client = new Google_Client();
    $client->setApplicationName('Google Drive API PHP Quickstart');
    $client->setScopes(Google_Service_Drive::DRIVE);
    $client->setAuthConfig('credentials.json');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    $tokenPath = 'token_drive.json';
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }
    
    if ($client->isAccessTokenExpired()) {
        // Refresh the token if possible, else fetch a new one.
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        } else {
            // Request authorization from the user.
            $authUrl = $client->createAuthUrl();
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
    return $client;
}


$base64_string = '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';

$filename_path = "/app/uploaded_pictures/".md5(time().uniqid()).".jpg"; 
$decoded=base64_decode($base64_string);
file_put_contents($filename_path,$decoded);

$clientDrive = getClientDrive();
$driveService = new Google_Service_Drive($clientDrive);
$fileMetadata = new Google_Service_Drive_DriveFile(array(
    'name' => 'simmi_FAFAFAFAFA.jpg'));
$content = file_get_contents($filename_path);
$file = $driveService->files->create($fileMetadata, array(
    'data' => $content,
    'mimeType' => 'image/jpeg',
    'uploadType' => 'multipart',
    'fields' => 'id'));

error_log("File ID: ". $file->id. "\n",3,'/app/simmi.log') ;
die ;
//print_r($file) ;

// Get the API client and construct the service object.
$client = getClient();
$service = new Google_Service_Calendar($client);

$event = new Google_Service_Calendar_Event(array(
    'summary' => 'NAPOLI Google I/O 2015',
    'location' => '800 Howard St., San Francisco, CA 94103',
    'description' => 'A chance to hear more about Google\'s developer products.',
    'start' => array(
      'dateTime' => '2018-11-17T19:20:00-07:00',
      'timeZone' => 'Europe/Rome',
    ),
    'end' => array(
      'dateTime' => '2018-11-11T19:20:00-07:00',
      'timeZone' => 'Europe/Rome',
    ),
    'recurrence' => array(
      'RRULE:FREQ=DAILY;COUNT=2'
    ),
    'attendees' => array(
      array('email' => 'bernardissimo82@gmail.com'),
    ),
    'reminders' => array(
      'useDefault' => FALSE,
      'overrides' => array(
        array('method' => 'email', 'minutes' => 1),
        array('method' => 'popup', 'minutes' => 1),
      ),
    ),
  ));
  
  $calendarId = 'primary';
  echo "SSSIMON\n" ; 

  $event = $service->events->insert($calendarId, $event);
  printf('Event created: %s\n', $event->htmlLink);
  //print_r($event) ;
  die ;
  addAttachment($calendarService, $driveService,$calendarId,$event->id,$file->id);

  function addAttachment($calendarService, $driveService, $calendarId, $eventId, $fileId) {
    $file = $driveService->files->get($fileId);
    $event = $calendarService->events->get($calendarId, $eventId);
    $attachments = $event->attachments;
  
    $attachments[] = array(
      'fileUrl' => $file->alternateLink,
      'mimeType' => $file->mimeType,
      'title' => $file->title
    );
    $changes = new Google_Service_Calendar_Event(array(
      'attachments' => $attachments
    ));
  
    $calendarService->events->patch($calendarId, $eventId, $changes, array(
      'supportsAttachments' => TRUE
    ));
  }
?>