<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    protected $table = 'livre';

    protected $primaryKey = 'id_livre';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_categorie',
        'cree_par_vendeur',
        'titre_livre',
        'auteur_livre',
        'description_livre',
        'image_couverture',
        'isbn_livre',
    ];

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'id_livre', 'id_livre');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'id_categorie', 'id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'cree_par_vendeur', 'id_vendeur');
    }
}
