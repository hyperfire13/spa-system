<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class AdminServiceService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 10;

        return Service::with('schedules')
            ->orderBy('name')
            ->paginate($perPage);
    }

    /* ================= CREATE ================= */

    public function store(array $data): Service
    {
        try {

            return DB::transaction(function () use ($data) {

                $schedules = $data['schedules'] ?? [];
                unset($data['schedules']);

                $service = Service::create($data);

                foreach ($schedules as $sched) {
                    $service->schedules()->create([
                        'day_of_week' => $sched['day_of_week'],
                        'start_time' => $sched['start_time'],
                        'end_time' => $sched['end_time'],
                        'slot_minutes' => $sched['slot_minutes'],
                        'capacity_per_slot' => $sched['capacity_per_slot'],
                    ]);
                }

                return $service->fresh()->load('schedules');
            });

        } catch (Exception $e) {

            Log::error('Service store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception('Failed to create service. Please try again.');
        }
    }

    /* ================= UPDATE ================= */

    public function update(Service $service, array $data): Service
    {
        // dd($data);
        try {

            return DB::transaction(function () use ($service, $data) {

                $schedules = $data['schedules'] ?? null;
                unset($data['schedules']);

                $service->fill($data);

                if ($service->isDirty()) {
                    $service->save();
                }

                if ($schedules !== null) {
                    $service->schedules()->delete();

                    foreach ($schedules as $sched) {
                        $service->schedules()->create([
                            'day_of_week' => $sched['day_of_week'],
                            'start_time' => $sched['start_time'],
                            'end_time' => $sched['end_time'],
                            'slot_minutes' => $sched['slot_minutes'],
                            'capacity_per_slot' => $sched['capacity_per_slot'],
                        ]);
                    }
                }

                return $service->fresh()->load('schedules');
            });

        } catch (Exception $e) {

            Log::error('Service update failed', [
                'service_id' => $service->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception('Failed to update service. Please refresh and try again.');
        }
    }

    /* ================= DELETE ================= */

    public function delete(Service $service): void
    {
        try {
            $service->delete();

        } catch (Exception $e) {

            Log::error('Service delete failed', [
                'service_id' => $service->id,
                'error' => $e->getMessage()
            ]);

            throw new Exception('Failed to delete service.');
        }
    }
}
