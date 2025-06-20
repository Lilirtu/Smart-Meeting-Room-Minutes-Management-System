<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('Agenda', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')->references('id')->on('Meeting')->onDelete('cascade');
        });

        Schema::table('Reservation', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')->references('id')->on('Meeting')->onDelete('cascade');
        });

        Schema::table('MinutesOfMeeting', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')->references('id')->on('Meeting')->onDelete('cascade');
        });

        Schema::table('Attendance', function (Blueprint $table) {
            $table->unsignedBigInteger('MeetingId')->nullable()->after('id');
            $table->foreign('MeetingId')->references('id')->on('Meeting')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('Attendance', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });

        Schema::table('MinutesOfMeeting', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });

        Schema::table('Reservation', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });

        Schema::table('Agenda', function (Blueprint $table) {
            $table->dropForeign(['MeetingId']);
            $table->dropColumn('MeetingId');
        });
    }
};
