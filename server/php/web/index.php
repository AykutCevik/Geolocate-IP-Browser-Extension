<?php
require 'environment.php';
require '../vendor/autoload.php';

$app = new \Slim\Slim();
$app->get('/api/:name', function ($name) {
    echo "Hello, $name";
});
$app->run();