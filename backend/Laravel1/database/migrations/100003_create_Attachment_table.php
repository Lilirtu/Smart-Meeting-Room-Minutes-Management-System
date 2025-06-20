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
        Schema::create('Attachment', function (Blueprint $table) {
            $table->id(); // creates an auto-incrementing id column (Id SERIAL in PostgreSQL)
            $table->text('Link')->nullable();
            $table->string('FileName', 255)->nullable();
            $table->unsignedBigInteger('MinutesOfMeetingId');

            $table->foreign('MinutesOfMeetingId')
                  ->references('id')
                  ->on('MinutesOfMeeting')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Attachment');
    }
};
