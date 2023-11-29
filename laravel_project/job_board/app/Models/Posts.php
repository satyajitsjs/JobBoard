<?php

namespace App\Models;

use App\Models\User;
use App\Models\Comments;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Posts extends Model
{
    use HasFactory , HasApiTokens , Notifiable;

    protected $fillable = [
        'title',
        'content',
        'image_path',
        'status',
        'slug',
        'user_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function comments(){
        return $this->hasMany(Comments::class , "post_id");
    }
}
