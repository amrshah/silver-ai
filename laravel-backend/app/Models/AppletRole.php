<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppletRole extends Model
{
    protected $table = 'applet_role';
    protected $fillable = ['applet_id', 'role_name'];

    public function applet()
    {
        return $this->belongsTo(Applet::class);
    }
}
