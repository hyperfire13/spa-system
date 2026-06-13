<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Public booking form — allow
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required','string','max:120'],
            'customer_phone' => [
                'required',
                'string',
                'max:25',
                'regex:/^\+?[0-9\s\-\(\)]{7,20}$/'
            ],
            'reservation_date' => ['required','date','after_or_equal:today'],
            'services' => ['required','array','min:1'],
            'services.*.service_id' => ['required','exists:services,id'],
            'services.*.service_name' => ['nullable','string'],
            'services.*.slot_time' => ['required','date_format:H:i:s'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Your name is required.',
            'customer_name.max' => 'Name is too long.',
            'customer_phone.regex' => 'Enter a valid phone number (digits, spaces, +, -, parentheses only).',
            'reservation_date.required' => 'Please select a reservation date.',
            'reservation_date.after_or_equal' => 'Reservation date cannot be in the past.',
            'services.required' => 'Please select at least one service.',
            'services.min' => 'Select at least one service.',
            'services.*.service_id.exists' => 'Selected service is invalid.',
            'services.*.slot_time.required' => 'Please choose a time slot for each service.',
            'services.*.slot_time.date_format' => 'Invalid time slot format.',
        ];
    }
}
