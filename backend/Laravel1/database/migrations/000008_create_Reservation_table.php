
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
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
    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('Reservation');
    }
};
