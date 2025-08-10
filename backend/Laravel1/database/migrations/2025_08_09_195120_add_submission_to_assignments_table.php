<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSubmissionToAssignmentsTable extends Migration
{
    public function up()
    {
        Schema::table('Assignment', function (Blueprint $table) {
            $table->string('Submission')->nullable();
        });
    }

    public function down()
    {
        Schema::table('Assignment', function (Blueprint $table) {
            $table->dropColumn('Submission');
        });
    }
}
