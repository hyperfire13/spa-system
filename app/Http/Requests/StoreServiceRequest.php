<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // already protected by sanctum + admin
    }

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:120'],
            'description' => ['nullable','string','max:500'],
            'price' => ['required','numeric','min:0'],
            'duration_minutes' => ['required','integer','min:5','max:480'],
            'is_active' => ['required','boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Service name is required.',
            'price.required' => 'Service price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'duration_minutes.required' => 'Duration is required.',
            'duration_minutes.min' => 'Minimum duration is 5 minutes.',
        ];
    }
}
