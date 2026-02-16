<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AdminServiceService
{

    public function list(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 10;

        return Service::query()
            ->orderBy('name')
            ->paginate($perPage);
    }


    public function store(array $data): Service
    {
        return Service::create($data);
    }

    public function update(Service $service, array $data): Service
    {
        $service->update($data);
        return $service->refresh();
    }

    public function delete(Service $service): void
    {
        $service->delete();
    }
}
