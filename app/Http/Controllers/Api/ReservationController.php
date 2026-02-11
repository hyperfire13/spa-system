<?php

namespace App\Http\Controllers\Api;

use App\Services\ReservationService;
use App\Http\Requests\StoreReservationRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class ReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService
    ) {}

    public function store(StoreReservationRequest $request)
    {
        try {
            $res = $this->reservationService->create($request->validated());
            return response()->json($res, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function adminIndex(Request $request)
    {
        $data = $this->reservationService->getAdminList([
            'status'   => $request->status,
            'search'   => $request->search,
            'per_page' => $request->per_page,
        ]);

        return response()->json($data);
    }

}
