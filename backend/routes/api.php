<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TranslationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('api')->group(function () {
    // Translation endpoint
    Route::post('/translate', [TranslationController::class, 'translate']);
    
    // Text-to-speech endpoint
    Route::post('/text-to-speech', [TranslationController::class, 'textToSpeech']);
});
