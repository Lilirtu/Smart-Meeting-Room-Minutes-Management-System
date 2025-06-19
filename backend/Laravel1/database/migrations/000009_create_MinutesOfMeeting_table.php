<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('MinutesOfMeeting', function (Blueprint $table) {
            $table->id();
            $table->string('Topic', 100);
            $table->string('Summary', 500);
            $table->string('DecisionMade', 100);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('MinutesOfMeeting');
    }
};
