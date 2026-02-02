<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AntRole extends Model
{
    protected $table = 'ant_roles';
    protected $fillable = ['ant_id', 'role_name'];

    public function ant()
    {
        return $this->belongsTo(Ant::class, 'ant_id');
    }
}
