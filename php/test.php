<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include('Net/SSH2.php');
function yo(){
    $ssh = new Net_SSH2('www.domain.tld');
    if (!$ssh->login('username', 'password')) {
        exit('Login Failed');
    }
    echo $ssh->exec('pwd');
    echo $ssh->exec('ls -la');
}
