<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*use Illuminate\Support\Facades\DB;

Route::get('/db-test', function () {
    try {
        DB::connection()->getPdo();
        return 'Database connection is OK!';
    } catch (\Exception $e) {
        return 'Database connection failed: ' . $e->getMessage();
    }
});*/

