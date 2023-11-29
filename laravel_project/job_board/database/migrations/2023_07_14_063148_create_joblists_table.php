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
        Schema::create('joblists', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('requirements');
            $table->string('company_name');
            $table->string('location');
            $table->string('job_type');
            $table->string('experience');
            $table->string('qualification');
            $table->string('salry_range');
            $table->unsignedBigInteger('employer_id');
            $table->foreign('employer_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();   
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('joblists');
    }
};
