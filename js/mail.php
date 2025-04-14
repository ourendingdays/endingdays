<?php

$recepient = "pavel.mospan@yahoo.com";
$sitename = "Our Ending Days";

$name = trim($_POST["name"]);
$email = trim($_POST["email"]);
$email = trim($_POST["reason"]);
$message = "Name: $name \nHow to get in touch: $email \nWhat is up: $email";

$pagetitle = "Message from the Website \"$sitename\"";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");