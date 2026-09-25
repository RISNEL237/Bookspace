<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offer extends Model
{
    protected $table = 'offre';

    protected $primaryKey = 'id_offre';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_livre',
        'id_vendeur',
        'type_offre',
        'prix_offre',
        'stock_offre',
        'etat_article',
        'fichier_numerique',
        'statut_droits',
        'justificatif_droits',
        'statut_offre',
        'est_disponible',
    ];

    protected $casts = [
        'prix_offre' => 'float',
        'stock_offre' => 'integer',
        'est_disponible' => 'boolean',
        'date_creation' => 'datetime',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'id_livre', 'id_livre');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'id_vendeur', 'id_vendeur');
    }
}