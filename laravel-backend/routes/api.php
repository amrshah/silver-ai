<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\AntController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::patch('/user', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ant Management
    Route::get('/ants', [AntController::class, 'index']);
    Route::post('/ants', [AntController::class, 'store']);
    Route::patch('/ants/{ant}', [AntController::class, 'update']);
    Route::delete('/ants/{ant}', [AntController::class, 'destroy']);
    Route::get('/admin/ants', [AntController::class, 'adminIndex']);

    // Prompts
    Route::get('/prompts', [ChatController::class, 'getPrompts']);
    Route::post('/prompts', [ChatController::class, 'createPrompt']);
    Route::patch('/prompts/{prompt}', [ChatController::class, 'updatePrompt']);
    Route::delete('/prompts/{prompt}', [ChatController::class, 'deletePrompt']);

    // Chat Routes
    Route::prefix('chat')->group(function () {
        Route::get('/threads', [ChatController::class, 'index']);
        Route::get('/threads/{id}', [ChatController::class, 'show']);
        Route::post('/ask', [ChatController::class, 'store']);
        Route::patch('/threads/{id}', [ChatController::class, 'renameThread']);
        Route::delete('/threads/{id}', [ChatController::class, 'destroy']);
        
        // Folder Routes
        Route::get('/folders', [ChatController::class, 'getFolders']);
        Route::post('/folders', [ChatController::class, 'createFolder']);
        Route::patch('/folders/{folder}', [ChatController::class, 'updateFolder']);
        Route::delete('/folders/{folder}', [ChatController::class, 'deleteFolder']);
        Route::patch('/threads/{id}/move', [ChatController::class, 'moveThread']);
    });
});
