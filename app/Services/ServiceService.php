<?php

namespace App\Services;

use App\Models\Service;
use Carbon\Carbon;
use App\Models\Reservation;

class ServiceService
{
    public function getCuratedSkincareServices()
    {
        return Service::query()
            ->where(function ($query) {
                $query->where('description', 'like', '%FACIAL%')
                    ->orWhere('description', 'like', '%SKIN%');
            })
            ->where('is_active', true)
            ->orderBy('name')
            ->limit(15)
            ->get();
    }
    public function getActiveServices()
    {
        return Service::where('is_active', true)->orderBy('name')->get();
    }

    public function store(array $data)
    {
        return Service::create($data);
    }

    public function update(Service $service, array $data)
    {
        return $service->update($data);
    }

    public function delete(Service $service)
    {
        return $service->delete();
    }

    public function getWithSchedules()
    {
        return Service::with('schedules')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function getAvailableSlots(int $serviceId, string $date)
    {
        $day = Carbon::parse($date)->dayOfWeek;

        $schedule = \App\Models\ServiceSchedule::query()
            ->where('service_id', $serviceId)
            ->where('day_of_week', $day)
            ->first();

        if (!$schedule) {
            return [];
        }

        $start = Carbon::parse($schedule->start_time);
        $end   = Carbon::parse($schedule->end_time);

        $slots = [];

        while ($start < $end) {

            $slotTime = $start->format('H:i:s');

            // count reservations using this service at this slot
            $count = Reservation::whereDate('reservation_date', $date)
                ->whereTime('reservation_time', $slotTime)
                ->whereHas('services', fn ($q) =>
                    $q->where('service_id', $serviceId)
                )
                ->count();

            if ($count < $schedule->capacity_per_slot) {
                $slots[] = $slotTime;
            }

            $start->addMinutes($schedule->slot_minutes);
        }

        return $slots;
    }

}
