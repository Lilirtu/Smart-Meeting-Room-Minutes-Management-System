
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Reservation', function (Blueprint $table) {
            $table->id();
            $table->string('Status', 30);
            $table->time('StartTime');
            $table->time('EndTime');
            $table->date('Date');
            $table->unsignedBigInteger('UserId');
            $table->unsignedBigInteger('RoomId');

            $table->foreign('UserId')->references('id')->on('Users')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('RoomId')->references('id')->on('Room')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Reservation');
    }
};
