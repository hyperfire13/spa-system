<?php

namespace App\Http\Controllers;

use App\Services\ServiceService;

class LandingPageController extends Controller
{
    protected ServiceService $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    public function index()
    {
        $services = $this->serviceService->getActiveServices();

        return view('welcome', compact('services'));
    }
}
