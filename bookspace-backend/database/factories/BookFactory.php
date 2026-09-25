<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Book>
 */
class BookFactory extends Factory
{
    protected $model = Book::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'seller_id' => Seller::factory(),
            'title' => $this->faker->sentence(4),
            'author' => $this->faker->name(),
            'genre' => 'Roman',
            'isbn' => $this->faker->isbn13(),
            'synopsis' => $this->faker->paragraph(),
            'cover_style' => 'cv1',
            'price_paper' => 19.99,
            'price_ebook' => 9.99,
            'stock_paper' => 12,
            'digital_format' => 'epub',
            'pages' => 240,
            'published_at' => now()->subDays(14)->toDateString(),
            'rating' => 4.6,
            'reviews_count' => 25,
            'is_published' => true,
        ];
    }
}
