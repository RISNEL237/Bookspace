<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Seller extends Model
{
    protected $table = 'profil_vendeur';

    protected $primaryKey = 'id_vendeur';

    /** @use HasFactory<\Database\Factories\SellerFactory> */
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_client',
        'nom_commercial',
        'description_boutique',
        'statut_vendeur',
        'piece_identite',
        'numero_commercial',
        'operateur_vendeur',
        'motif_suspension',
        'localisation',
        'type_de_structure',
        'dateact',
        'note_moyenne',
    ];

    protected $casts = [
        'localisation' => 'array',
        'note_moyenne' => 'float',
        'dateact' => 'datetime',
    ];

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'id_vendeur', 'id_vendeur');
    }

    public function books(): BelongsToMany
    {
        return $this->belongsToMany(
            Book::class,
            'offre',
            'id_vendeur',
            'id_livre',
            'id_vendeur',
            'id_livre'
        );
    }
}
