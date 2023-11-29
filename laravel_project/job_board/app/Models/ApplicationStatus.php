<?php

namespace App\Models;

use App\Models\Apply;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicationStatus extends Model
{
    use HasFactory;

    protected $table = 'application_status';
    
    protected $fillable = ['status' , 'discription' , 'application_id'];


    public function apply()
    {
        return $this->belongsTo(Apply::class , 'application_id');
    }

 
}
