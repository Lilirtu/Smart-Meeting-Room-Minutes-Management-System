<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 public function up()
{
    Schema::table('Notification', function (Blueprint $table) {
        $table->text('Content')->nullable()->after('ReceiverId');
    });
}


public function down()
{
    Schema::table('Notification', function (Blueprint $table) {
        $table->dropColumn('Content');
    });
}

};
