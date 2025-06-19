
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
class ReservationTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('Reservation', function (Blueprint $table) {
            $table->id('Id');
            $table->string('Status', 30);
            $table->time('StartTime');
            $table->time('EndTime');
            $table->date('Date');
            $table->unsignedBigInteger('UserId');
            $table->unsignedBigInteger('RoomId');
            $table->foreign('UserId')->references('Id')->on('Users')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('RoomId')->references('Id')->on('Room')->onUpdate('cascade')->onDelete('restrict');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('Reservation');
    }
}
