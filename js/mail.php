<?php

$recepient = "pavel.mospan@yahoo.com";
$sitename = "Our Ending Days";

$name = trim($_POST["name"]);
$email = trim($_POST["email"]);
$email = trim($_POST["reason"]);
$message = "Имя: $name \nСпособ связи: $email \nЧТо интересует: $email";

$pagetitle = "Письмо с сайта \"$sitename\"";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");