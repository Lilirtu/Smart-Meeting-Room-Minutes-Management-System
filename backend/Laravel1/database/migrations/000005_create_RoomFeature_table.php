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
        Schema::create('RoomFeature', function (Blueprint $table){
            $table->id(); // Creates an auto-incrementing "id" primary key (big integer)
            $table->unsignedBigInteger('RoomId');
            $table->unsignedBigInteger('FeatureId');
            $table->foreign('RoomId')->references('id')->on('Room');
            $table->foreign('FeatureId')->references('id')->on('Feature');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('RoomFeature');
    }
};
