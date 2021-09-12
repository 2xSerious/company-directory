<?php 
    
    $conn = new mysqli('localhost', 'root', '', 'test');

    if ($conn) {
        echo 'Connection successfull';
    } else {
        echo 'Connection failed';
    }

?>