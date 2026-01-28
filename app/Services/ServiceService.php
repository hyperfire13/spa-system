<?php

namespace App\Services;

use App\Models\Service;

class ServiceService
{
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
}
