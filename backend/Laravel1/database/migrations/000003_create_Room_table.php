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
        Schema::create('Room', function (Blueprint $table){
            $table->id(); // Creates an auto-incrementing "id" primary key (big integer)
            $table->string('Name'); // Creates a VARCHAR column called 'Name'
            $table->string('Location'); // Creates a VARCHAR column 'Location' 
            $table->smallInteger('Capacity');
            $table->string('Image')->nullable(); // For image path
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Room');
    }
};
