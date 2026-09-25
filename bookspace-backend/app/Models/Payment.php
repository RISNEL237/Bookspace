<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $table = 'paiement';

    protected $primaryKey = 'id_paiement';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_paiement',
        'id_commande',
        'fournisseur_paiement',
        'tel_paiement',
        'montant_paiement',
        'statut_paiement',
        'id_transaction_externe',
    ];

    protected $casts = [
        'montant_paiement' => 'decimal:2',
        'date_paiement' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'id_commande', 'id_commande');
    }
}