<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payout extends Model
{
    protected $table = 'versement_vendeur';

    protected $primaryKey = 'id_versement';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = ['id_versement', 'id_vendeur', 'id_ligne_commande', 'montant', 'statut', 'date_versement'];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_versement' => 'datetime',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class, 'id_vendeur', 'id_vendeur');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class, 'id_ligne_commande', 'id_ligne_commande');
    }
}