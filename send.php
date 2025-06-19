<?php

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';


function getField($name) {
    return isset($_POST[$name]) ? htmlspecialchars(trim($_POST[$name])) : '';
}

$name = getField('name');
$phone = getField('phone');
$quest = getField('quest');
$hidden_btn = getField('hidden_btn');
$url_ord = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';


$formType = 'Неизвестная форма';
if (isset($_POST['form_type'])) {
    $formType = $_POST['form_type'];
} else if (isset($_POST['quest'])) {
    $formType = 'Квиз (quiz-form)';
} else if (isset($_POST['name']) && !isset($_POST['quest'])) {
    $formType = 'Звонок (call-form)';
} else if (isset($_POST['phone']) && !isset($_POST['name']) && !isset($_POST['quest'])) {
    $formType = 'Запись (reception-form)';
}


$title = "Заявка с сайта (" . $formType . ")";
$body = "<h2>Данные клиента</h2>";
if ($formType === 'Квиз (quiz-form)') {
    $body .= "<b>Телефон:</b> $phone<br>";
    $body .= "<b>Проблема (вопрос) клиента:</b> $quest<br>";
    $body .= "<b>Нажатая кнопка:</b> $hidden_btn<br>";
} else if ($formType === 'Звонок (call-form)') {
    $body .= "<b>Имя:</b> $name<br>";
    $body .= "<b>Телефон:</b> $phone<br>";
} else if ($formType === 'Запись (reception-form)') {
    $body .= "<b>Телефон:</b> $phone<br>";
} else {
    foreach ($_POST as $key => $value) {
        $body .= "<b>".htmlspecialchars($key).":</b> ".htmlspecialchars($value)."<br>";
    }
}
$body .= "<br><b>Страница:</b> $url_ord";


$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    //$mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    
	
   $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера вашей почты
    $mail->Username   = 'email@email.ru'; // Логин на почте
    $mail->Password   = 'password'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('email@email.ru', 'адрес сайта'); // Адрес самой почты и имя отправителя

    // Получатель письма
   $mail->addAddress('email@email.ru');  
    $mail->addAddress('email@email.ru');
	$mail->addAddress('email@email.ru'); 


    $rfile = [];
    if (!empty($_FILES['file']['name'][0])) {
        for ($ct = 0; $ct < count($_FILES['file']['tmp_name']); $ct++) {
            $uploadfile = tempnam(sys_get_temp_dir(), sha1($_FILES['file']['name'][$ct]));
            $filename = $_FILES['file']['name'][$ct];
            if (move_uploaded_file($_FILES['file']['tmp_name'][$ct], $uploadfile)) {
                $mail->addAttachment($uploadfile, $filename);
                $rfile[] = "Файл $filename прикреплён";
            } else {
                $rfile[] = "Не удалось прикрепить файл $filename";
            }
        }   
    }
    
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;    

    if ($mail->send()) {
        $result = "success";
    } else {
        $result = "error";
    }
    $status = '';
} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

header('Content-Type: application/json');
echo json_encode([
    "result" => $result,
    "resultfile" => isset($rfile) ? $rfile : [],
    "status" => isset($status) ? $status : ''
]);
