<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_minutes',
        'is_active',
        'image_url',
        'updated_at'
    ];

    public function reservations()
    {
        return $this->belongsToMany(Reservation::class,
        'reservation_services');
    }

    public function schedules()
    {
        return $this->hasMany(ServiceSchedule::class);
    }

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    

}
