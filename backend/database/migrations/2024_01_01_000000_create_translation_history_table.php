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
        Schema::create('translation_history', function (Blueprint $table) {
            $table->id();
            $table->text('original_text');
            $table->text('translated_text');
            $table->string('source_lang', 10);
            $table->string('target_lang', 10);
            $table->timestamps();
            
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translation_history');
    }
};
