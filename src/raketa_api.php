<?php
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$mail = isset($_POST['mail']) ? trim($_POST['mail']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$data_form = isset($_POST['data_form']) ? trim($_POST['data_form']) : '';
$url = isset($_POST['url']) ? trim($_POST['url']) : '';
$ref = isset($_POST['ref']) ? trim($_POST['ref']) : '';
$city = isset($_POST['city']) ? trim($_POST['city']) : '';
$from = isset($_POST['from']) ? trim($_POST['from']) : '';
$page_name = isset($_POST['page_name']) ? trim($_POST['page_name']) : '';
$client_id = isset($_POST['client_id']) ? trim($_POST['client_id']) : '';
$utm_source = isset($_POST['utm_source']) ? trim($_POST['utm_source']) : '';
$utm_content = isset($_POST['utm_content']) ? trim($_POST['utm_content']) : '';
$utm_campaign = isset($_POST['utm_campaign']) ? trim($_POST['utm_campaign']) : '';
$utm_term = isset($_POST['utm_term']) ? trim($_POST['utm_term']) : '';
$utm_medium = isset($_POST['utm_medium']) ? trim($_POST['utm_medium']) : '';
$amo = isset($_POST['amo']) ? trim($_POST['amo']) : true;
$ip_address = isset($_SERVER["REMOTE_ADDR"]) ? trim($_SERVER["REMOTE_ADDR"]) : '';

$hostname = $_SERVER['HTTP_HOST'];

$format = isset($_POST['format']) ? trim($_POST['format']) : '';

$visit_time = date('H:i') . ' ' . date('d.m.Y');

if($phone != ''){

	$message = '🎉' . $page_name . '🎉' . PHP_EOL;
	$message .= empty($name) ? '' : '👤 Имя: ' . $name . PHP_EOL;
	$message .= '☎ Телефон: ' . $phone . PHP_EOL;
	$message .= empty($mail) ? '' : '📧 E-mail: ' . $mail . PHP_EOL;
	$message .= empty($format) ? '' : '👯 Формат участия: ' . $format . PHP_EOL;
	$message .= empty($data_form) ? '' : '📝 Отправленная форма: ' . $data_form . PHP_EOL;
	$message .= empty($url) ? '' : '🔗 Страница заявки: ' . $url . PHP_EOL;
	$message .= empty($city) ? '' : '🌎 Локация: ' . $city . PHP_EOL;
	$message .= '⏲ Время заявки: ' . $visit_time . PHP_EOL;
	$message .= empty($ref) ? '' : '🔙 Пришел со страницы: ' . $ref . PHP_EOL;
	$message .= empty($utm_source) ? '' : 'utm_source: ' . $utm_source . PHP_EOL;
	$message .= empty($utm_campaign) ? '' : 'utm_campaign: ' . $utm_campaign . PHP_EOL;
	$message .= empty($utm_medium) ? '' : 'utm_medium: ' . $utm_medium . PHP_EOL;
	$message .= empty($utm_term) ? '' : 'utm_term: ' . $utm_term . PHP_EOL;
	$message .= empty($utm_content) ? '' : 'utm_content: ' . $utm_content;


	//SEND MESSAGE TO TELEGRAM
	function sendMessage($chatID, $message, $token) {
		$url = "https://api.telegram.org/" . $token . "/sendMessage?chat_id=" . $chatID;
		$url = $url . "&text=" . urlencode($message);
		$ch = curl_init();
		$optArray = array(CURLOPT_URL => $url,CURLOPT_RETURNTRANSFER => true);
		curl_setopt_array($ch, $optArray);
		$result = curl_exec($ch);
		curl_close($ch);
	}

	if($name === "test"){
		$chatID = "513914109";
	} else {
		$chatID = "-276303359";
	}
	$token = "bot581241087:AAErvu7L4NxhF_-SiD6D_pE_YrS7MTY1CWE";
	sendMessage($chatID, $message, $token);

}

if($amo === true){
	include('amo/amocontactlist.php');
}