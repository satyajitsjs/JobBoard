<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\Categories;

class Joblists extends Model
{
    use HasFactory , HasApiTokens , Notifiable;
    protected $fillable = [
        'title',
        'description',
        'requirements',
        'company_name',
        'location',
        'employer_id',
        'job_type',
        'experience',
        'qualification',
        'salry_range',
    ];

    public function apply()
    {
        return $this->hasMany(Apply::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsToMany(Categories::class);
    }

}
