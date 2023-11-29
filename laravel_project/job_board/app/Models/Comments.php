<?php

namespace App\Models;

use App\Models\User;
use App\Models\Posts;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comments extends Model
{
    use HasFactory , HasApiTokens , Notifiable;

    protected $fillable = [
        'content',
        'user_id',
        'post_id',
        'parent_id'
    ];


    public function post()
    {
        return $this->belongsTo(Posts::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parentComment()
    {
        return $this->belongsTo(Comments::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comments::class, 'parent_id');
    }

}
