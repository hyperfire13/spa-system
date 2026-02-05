<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Models\Service;
use App\Services\ServiceService;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    protected ServiceService $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    public function index()
    {
        return response()->json(
            $this->serviceService->getActiveServices()
        );
    }

    public function schedules(Service $service)
    {
        return response()->json($service->schedules);
    }


    public function store(StoreServiceRequest $request)
    {
        return $this->serviceService->store($request->validated());
    }

    public function update(StoreServiceRequest $request, Service $service)
    {
        $this->serviceService->update($service, $request->validated());
        return response()->json(['message' => 'Updated']);
    }

    public function destroy(Service $service)
    {
        $this->serviceService->delete($service);
        return response()->json(['message' => 'Deleted']);
    }

    public function withSchedules()
    {
        return response()->json(
            $this->serviceService->getWithSchedules()
        );
    }

    public function slots(Service $service, Request $request)
    {
        $request->validate([
            'date' => ['required','date']
        ]);

        return response()->json(
            $this->serviceService->getAvailableSlots(
                $service->id,
                $request->date
            )
        );
    }


    
}
