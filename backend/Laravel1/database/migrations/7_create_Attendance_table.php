<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('Attendance', function (Blueprint $table) {
            $table->id('Id');
            $table->unsignedBigInteger('UserId');


            $table->foreign('UserId')->references('Id')->on('Users')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('Attendance');
    }
}
