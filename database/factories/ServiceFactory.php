<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                'Swedish Massage',
                'Deep Tissue Massage',
                'Hot Stone Therapy',
                'Facial Treatment',
                'Aromatherapy Massage',
                'Body Scrub',
                'Foot Reflexology'
            ]),
            'description' => $this->faker->sentence(12),
            'price' => $this->faker->randomFloat(2, 500, 3500),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90]),
            'is_active' => true,
            'image_url' => $this->faker->optional()->imageUrl(640, 480, 'spa', true),
        ];
    }
}
