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
        Schema::create('Role', function (Blueprint $table){
            $table->id(); // Creates an auto-incrementing "id" primary key (big integer)
            $table->string('RoleName'); // Creates a VARCHAR column called 'RoleName'
            $table->text('Description'); // Creates a text column 'Description' 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Role');
    }
};