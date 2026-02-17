<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // already protected by sanctum + admin middleware
    }

    /**
     * Normalize incoming data BEFORE validation
     */
    protected function prepareForValidation()
    {
        if (!$this->has('schedules')) {
            return;
        }

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

            /* BASIC INFO — optional on update */

            'name' => ['sometimes','string','max:120'],
            'description' => ['nullable','string','max:500'],
            'price' => ['sometimes','numeric','min:0'],
            'duration_minutes' => ['sometimes','integer','min:5','max:480'],
            'is_active' => ['sometimes','boolean'],

            /* SCHEDULES — optional but strict if present */

            'schedules' => ['sometimes','array','min:1'],

            'schedules.*.day_of_week' => ['required_with:schedules','integer','between:0,6'],
            'schedules.*.start_time' => ['required_with:schedules','regex:/^\d{2}:\d{2}:\d{2}$/'],
            'schedules.*.end_time' => ['required_with:schedules','regex:/^\d{2}:\d{2}:\d{2}$/'],
            'schedules.*.slot_minutes' => ['required_with:schedules','integer','min:5','max:240'],
            'schedules.*.capacity_per_slot' => ['required_with:schedules','integer','min:1','max:50'],
        ];
    }

    /**
     * Custom time validation
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            foreach (($this->input('schedules') ?? []) as $index => $schedule) {

                if (!isset($schedule['start_time'], $schedule['end_time'])) {
                    continue;
                }

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
            'name.string' => 'Service name must be valid text.',
            'price.numeric' => 'Price must be a valid number.',
            'duration_minutes.min' => 'Minimum duration is 5 minutes.',
            'schedules.min' => 'At least one schedule is required.',
            'schedules.*.day_of_week.between' => 'Invalid day selected.',
        ];
    }
}
