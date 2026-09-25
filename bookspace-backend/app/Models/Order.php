<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $table = 'commande';

    protected $primaryKey = 'id_commande';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_commande',
        'id_client',
        'id_adresse',
        'statut_commande',
        'montant_total_commande',
    ];

    protected $casts = [
        'montant_total_commande' => 'decimal:2',
        'date_commande' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'id_commande', 'id_commande');
    }
}
