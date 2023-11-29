<?php

namespace App\Models;

use App\Models\ApplicationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Apply extends Model
{
    use HasFactory;
    protected $fillable = [
        'joblist_id',
        'user_id',
        'cover_letter',
        'resume_file_path'
    ];

    public function joblist()
    {
        return $this->belongsTo(Joblists::class , 'joblist_id');
    }

    public function Users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function applicationStatus()
    {
        return $this->hasMany(ApplicationStatus::class ,'application_id');
    }
    
}
