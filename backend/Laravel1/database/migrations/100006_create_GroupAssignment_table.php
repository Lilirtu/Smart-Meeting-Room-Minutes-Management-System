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
        Schema::create('GroupAssignment', function (Blueprint $table) {
            $table->id(); // Id SERIAL
            $table->unsignedBigInteger('AssignmentId');
            $table->unsignedBigInteger('UserId');

            $table->foreign('AssignmentId')
                  ->references('id')
                  ->on('Assignment')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');

            $table->foreign('UserId')
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
        Schema::dropIfExists('GroupAssignment');
    }
};
