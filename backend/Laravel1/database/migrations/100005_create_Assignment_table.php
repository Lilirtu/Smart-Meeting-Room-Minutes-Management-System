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
        Schema::create('Assignment', function (Blueprint $table) {
            $table->id(); // Id SERIAL
            $table->unsignedBigInteger('NotificationId');
            $table->unsignedBigInteger('MeetingId');
            $table->text('Description');
            $table->timestamp('DueDate');

            $table->foreign('NotificationId')
                  ->references('id')
                  ->on('Notification')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');

            $table->foreign('MeetingId')
                  ->references('id')
                  ->on('Meeting')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Assignment');
    }
};
