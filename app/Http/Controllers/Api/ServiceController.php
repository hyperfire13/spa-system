<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use App\Services\ServiceService;
use App\Services\AdminServiceService;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    protected ServiceService $serviceService;
    protected AdminServiceService $adminServiceService;

    public function __construct(ServiceService $serviceService, AdminServiceService $adminServiceService)
    {
        $this->serviceService = $serviceService;
        $this->adminServiceService = $adminServiceService;
    }



    public function adminIndex(Request $request)
    {
        return response()->json(
            $this->adminServiceService->list([
                'per_page' => $request->per_page
            ])
        );
    }

    public function curatedSkincare()
    {
        return response()->json(
            $this->serviceService->getCuratedSkincareServices()
        );
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
        return response()->json(
            $this->adminServiceService->store($request->validated()),
            201
        );
    }


    public function update(UpdateServiceRequest $request, Service $service)
    {
        return response()->json(
            $this->adminServiceService->update($service, $request->validated())
        );
    }


    public function destroy(Service $service)
    {
        $this->adminServiceService->delete($service);
        return response()->noContent();
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
