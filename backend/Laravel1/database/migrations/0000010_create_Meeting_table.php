
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Meeting', function (Blueprint $table) {
            $table->id('id'); // 'Id' column as PRIMARY KEY
            $table->time('StartTime'); // 'StartTime' TIME NOT NULL
            $table->time('EndTime'); // 'EndTime' TIME NOT NULL
            $table->date('Date'); // 'Date' DATE NOT NULL
            $table->string('Title', 50); // 'Title' VARCHAR(50) NOT NULL
            $table->integer('NumberOfAttendance'); // 'NumberOfAttendance' INT NOT NULL
            $table->unsignedBigInteger('ReservationId')->nullable(); // 'ReservationId' INT, optional
            $table->unsignedBigInteger('MinutesOfMeetingId')->nullable(); // 'MinutesOfMeetingId' INT, optional
            $table->unsignedBigInteger('AgendaId')->nullable(); // 'AgendaId' INT, optional
            // Foreign Key Constraints
            $table->foreign('ReservationId')->references('id')->on('Reservation')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('MinutesOfMeetingId')->references('id')->on('MinutesOfMeeting')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreign('AgendaId')->references('id')->on('Agenda')->restrictOnDelete()->cascadeOnUpdate();
            $table->timestamps(); // Created_At and Updated_At
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
