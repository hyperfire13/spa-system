<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\ServiceSchedule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReservationService
{
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $reservation = Reservation::create([
                'customer_name'  => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'],
                'reservation_date' => $data['reservation_date'],
                'reservation_time' => $data['reservation_time'] ?? null,
                'status' => 'pending',
            ]);

            foreach ($data['services'] as $svc) {

                $serviceId = $svc['service_id'];
                $slotTime  = $svc['slot_time'];

                // Lock schedule row
                $schedule = ServiceSchedule::where('service_id', $serviceId)
                    ->where('day_of_week',
                        Carbon::parse($data['reservation_date'])->dayOfWeek
                    )
                    ->lockForUpdate()
                    ->firstOrFail();

                // count existing reservations for that slot
                $count = DB::table('reservation_services')
                    ->join('reservations','reservations.id','=','reservation_services.reservation_id')
                    ->where('reservation_services.service_id',$serviceId)
                    ->where('reservation_services.slot_time',$slotTime)
                    ->whereDate('reservations.reservation_date',$data['reservation_date'])
                    ->count();

                if ($count >= $schedule->capacity_per_slot) {
                    throw new \Exception("Slot full for service {$serviceId} at {$slotTime}");
                }

                $reservation->services()->attach($serviceId, [
                    'slot_time' => $slotTime
                ]);
            }

            return $reservation->load('services');
        });
    }
}
