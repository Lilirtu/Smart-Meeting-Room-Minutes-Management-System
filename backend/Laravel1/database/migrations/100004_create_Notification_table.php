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
        Schema::create('Notification', function (Blueprint $table) {
            $table->id(); // Id SERIAL
            $table->unsignedBigInteger('SenderId');
            $table->unsignedBigInteger('ReceivedId');
            $table->timestamp('TimeSent')->useCurrent();
            $table->boolean('IsRead')->default(false);

            $table->foreign('SenderId')
                  ->references('id')
                  ->on('Users')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');

            $table->foreign('ReceivedId')
                  ->references('id')
                  ->on('Users')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Notification');
    }
};
