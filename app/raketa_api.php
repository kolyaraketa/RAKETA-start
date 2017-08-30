<?php

// $recepient = "sv@lexstatus.com.ua";
$pagetitle = "Всеукраинский экспертно-правовой союз";

$mail = isset($_POST['mail']) ? trim($_POST['mail']) : '';
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
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

	// $db = new PDO('mysql:host=localhost;dbname=leads_monitoring', 'monkey748', 'hardpassword649');
	// $db->exec("SET NAMES UTF8");
	// $query = $db->prepare("INSERT INTO hm_leads set name=:name, phone=:phone, mail=:mail, url=:url, ref=:ref,city=:city, ga_client_id=:ga_client_id, lead_name=:lead_name, data_form=:data_form, date_submitted=:date_submitted,time_submitted=:time_submitted, ip_address=:ip_address, utm_source=:utm_source, utm_campaign=:utm_campaign, utm_medium=:utm_medium, utm_term=:utm_term, utm_content=:utm_content, is_test=case when (lower(name) like '%test%' OR lower(name) like '%тест%' OR ip_address IN (select distinct t.ip_address from reporting.exclude_ip t)) then 1 else 0 end");

	// $params = [
	// 	'name' => $name,
	// 	'mail' => $mail,
	// 	'phone' => $phone,
	// 	'url' => $url,
	// 	'ref' => $ref,
	// 	'city' => $city,
	// 	'ga_client_id' => $ga_client_id,
	// 	'lead_name' => $lead_name,
	// 	'data_form' => $data_form,
	// 	'date_submitted' => $date_submitted,
	// 	'time_submitted' => $time_submitted,
	// 	'ip_address' => $ip_address,
	// 	'utm_source' => $utm_source,
	// 	'utm_campaign' => $utm_campaign,
	// 	'utm_medium' => $utm_medium,
	// 	'utm_term' => $utm_term,
	// 	'utm_content' => $utm_content
	// ];
	// $query->execute($params);


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

	// $headers = 'MIME-Version: 1.0' . "\r\n";
	// $headers .= 'Content-type: text/html; charset=urf-8' . "\r\n";
	// $headers .= 'From: no-reply@hunngry-monkey.com.ua';
	// mail($recepient, $pagetitle, $message, $headers);

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

	$token = "bot258893453:AAFH2F6CCYCHuZJzAWm27Vb008b9GJHo2nI";
	$chatID = "-201316944";
	sendMessage($chatID, $message, $token);


// // SPUTNIK API

// $first_name = $name;
// $email = $mail;

// $user = 'id-dyachenko@yandex.ru';
// $password = 'ghbdtncnde123';
// $subscribe_contact_url = 'https://esputnik.com.ua/api/v1/contact/subscribe';
// $formType = 'hm-moto';


// $json_value = array("name" => $name, "mail" => $mail, "phone" => $phone);

// $json_contact_value = new stdClass();
// $contact = new stdClass();
// $contact->firstName = $first_name;
// $contact->channels = array(array('type' => 'email', 'value' => $email), array('type'=>'sms', 'value' => $phone));
// $groups = array('hm-moto');
// $json_contact_value->contact = $contact;
// $json_contact_value->groups = $groups;
// $json_contact_value->formType = $formType;
// send_request($subscribe_contact_url, $json_contact_value, $user, $password);

// function send_request($url, $json_value, $user, $password) {
// $ch = curl_init('https://esputnik.com.ua/api/v1/contact/subscribe');
// curl_setopt($ch, CURLOPT_POST, 1);
// curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json_value));
// curl_setopt($ch, CURLOPT_HEADER, 1);
// curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json', 'Content-Type: application/json'));
// curl_setopt($ch, CURLOPT_URL, $url);
// curl_setopt($ch,CURLOPT_USERPWD, $user.':'.$password);
// curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
// $output = curl_exec($ch)
// ;
// echo($output);
// curl_close($ch);
// }

}
?>
