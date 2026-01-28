<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Models\Service;
use App\Services\ServiceService;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return view('admin.services.index', compact('services'));
    }

    public function store(StoreServiceRequest $request, ServiceService $serviceService)
    {
        $serviceService->store($request->validated());
        return back()->with('success','Service created.');
    }
}
