
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add foreign key to agenda table
        Schema::table('Agenda', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')
                ->references('id')
                ->on('Meeting')
                ->onDelete('cascade');
        });
        // Add foreign key to reservations table
        Schema::table('Reservation', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')
                ->references('id')
                ->on('Meeting')
                ->onDelete('cascade');
        });
        // Add foreign key to minutes_of_meeting table
        Schema::table('MinutesOfMeeting', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')
                ->references('id')
                ->on('Meeting')
                ->onDelete('cascade');
        });
        // Add foreign key to attendance table
        Schema::table('Attendance', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')
                ->references('id')
                ->on('Meeting')
                ->onDelete('cascade');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove foreign key and column from attendance table
        Schema::table('Attendance', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });
        // Remove foreign key and column from minutes_of_meeting table
        Schema::table('MinutesOfMeeting', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });
        // Remove foreign key and column from reservations table
        Schema::table('Reservation', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });
        // Remove foreign key and column from agenda table
        Schema::table('Agenda', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });
    }
};
