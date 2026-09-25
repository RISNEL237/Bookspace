<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $table = 'ligne_commande';

    protected $primaryKey = 'id_ligne_commande';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_ligne_commande',
        'id_commande',
        'id_offre',
        'quantite_commande',
        'prix_unitaire_fige',
        'mode_livraison',
        'statut_ligne_commande',
        'date_limite_acceptation',
    ];

    protected $casts = [
        'quantite_commande' => 'integer',
        'prix_unitaire_fige' => 'decimal:2',
        'date_limite_acceptation' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'id_commande', 'id_commande');
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class, 'id_offre', 'id_offre');
    }

}
