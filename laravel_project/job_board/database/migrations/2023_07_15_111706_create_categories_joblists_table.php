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
        Schema::create('categories_joblists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('categories_id');
            $table->unsignedBigInteger('joblists_id');
            $table->foreign('categories_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('joblists_id')->references('id')->on('joblists')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories_joblists');
    }
};
