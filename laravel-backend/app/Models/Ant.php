<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ant extends Model
{
    protected $table = 'ants';
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'icon',
        'system_instruction',
        'category',
        'is_system',
        'is_public',
        'is_global'
    ];

    protected $casts = [
        'is_system' => 'boolean',
        'is_public' => 'boolean',
        'is_global' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function roles()
    {
        return $this->hasMany(AntRole::class);
    }
}
