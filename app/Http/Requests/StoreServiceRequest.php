<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // already protected by sanctum + admin
    }

    protected function prepareForValidation()
    {
        if (!$this->has('schedules')) return;
        $schedules = collect($this->input('schedules'))->map(function ($s) {
            if (isset($s['start_time']) && strlen($s['start_time']) === 5) {
                $s['start_time'] .= ':00';
            }
            if (isset($s['end_time']) && strlen($s['end_time']) === 5) {
                $s['end_time'] .= ':00';
            }
            return $s;
        });
        $this->merge([
            'schedules' => $schedules->toArray()
        ]);
    }


    public function rules(): array
    {
        return [
            'name' => ['required','string','max:120'],
            'description' => ['nullable','string','max:500'],
            'price' => ['required','numeric','min:0'],
            'duration_minutes' => ['required','integer','min:5','max:480'],
            'is_active' => ['required','boolean'],
            'schedules' => ['nullable','array','min:1'],
            'schedules.*.day_of_week' => ['required_with:schedules','integer','between:0,6'],
            'schedules.*.start_time' => ['required_with:schedules','regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'schedules.*.end_time'   => ['required_with:schedules','regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'schedules.*.slot_minutes' => ['required_with:schedules','integer','min:5','max:240'],
            'schedules.*.capacity_per_slot' => ['required_with:schedules','integer','min:1','max:50'],
        ];
    }


    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            foreach ($this->input('schedules', []) as $index => $schedule) {

                if (strtotime($schedule['end_time']) <= strtotime($schedule['start_time'])) {

                    $validator->errors()->add(
                        "schedules.$index.end_time",
                        'End time must be later than start time.'
                    );
                }
            }
        });
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
