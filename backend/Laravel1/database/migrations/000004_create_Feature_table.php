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
        Schema::create('Feature', function (Blueprint $table){
            $table->id(); // Creates an auto-incrementing "id" primary key (big integer)
            $table->string('FeatureName'); // Creates a VARCHAR column called 'FeatureName'
            $table->string('Description'); // Creates a text column 'Description' 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Feature');
    }
};
