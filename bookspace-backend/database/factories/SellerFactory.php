<?php

namespace Database\Factories;

use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Seller>
 */
class SellerFactory extends Factory
{
    protected $model = Seller::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shop_name' => $this->faker->company().' Bookshop',
            'legal_type' => 'SARL',
            'country' => 'France',
            'city' => 'Paris',
            'description' => $this->faker->paragraph(),
            'kyb_status' => 'approved',
            'rating' => 4.8,
        ];
    }
}
