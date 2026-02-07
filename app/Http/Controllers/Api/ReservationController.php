<?php

namespace App\Http\Controllers\Api;

use App\Services\ReservationService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class ReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService
    ) {}

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:120',
            'customer_phone' => 'required|string|max:40',
            'reservation_date' => 'required|date',
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|exists:services,id',
            'services.*.slot_time' => 'required|date_format:H:i:s',
        ]);

        try {
            $res = $this->reservationService->create($data);
            return response()->json($res, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
