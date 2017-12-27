<?php

$recepient = "raketakolya@gmail.com";
$pagetitle = "Экспертная оценка имущества";

$mail = isset($_POST['mail']) ? trim($_POST['mail']) : '';
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$mail = isset($_POST['mail']) ? trim($_POST['mail']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$data_form = isset($_POST['data_form']) ? trim($_POST['data_form']) : '';
$url = isset($_POST['url']) ? trim($_POST['url']) : '';
$ref = isset($_POST['ref']) ? trim($_POST['ref']) : '';
$utm_source = isset($_POST['utm_source']) ? trim($_POST['utm_source']) : '';
$utm_content = isset($_POST['utm_content']) ? trim($_POST['utm_content']) : '';
$utm_campaign = isset($_POST['utm_campaign']) ? trim($_POST['utm_campaign']) : '';
$utm_term = isset($_POST['utm_term']) ? trim($_POST['utm_term']) : '';
$utm_medium = isset($_POST['utm_medium']) ? trim($_POST['utm_medium']) : '';
$ip_address = isset($_SERVER["REMOTE_ADDR"]) ? trim($_SERVER["REMOTE_ADDR"]) : '';

$date_submitted = date('d.m.Y');
$time_submitted = date("H:i");

if($phone != ''){

	$message = "
	‼ $pagetitle ‼
	👤 Имя: $name
	☎ Телефон: $phone
	📧 E-mail: $mail
	📝 Отправленная форма: $data_form
	🔗 Страница заявки: $url
	📅 Дата заявки: $date_submitted
	⏲ Время заявки: $time_submitted
	🔙 Пришел со страницы: $ref

	utm_source: $utm_source
	utm_campaign: $utm_campaign
	utm_medium: $utm_medium
	utm_term: $utm_term
	utm_content: $utm_content
";

	$headers = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=urf-8' . "\r\n";
	$headers .= 'From: no-reply@lexstatus.com.ua';
	mail($recepient, $pagetitle, $message, $headers);

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

	$token = "bot****";
	$chatID = "***";
	sendMessage($chatID, $message, $token);

}
?>
