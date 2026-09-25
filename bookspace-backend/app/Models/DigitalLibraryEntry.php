<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DigitalLibraryEntry extends Model
{
    protected $table = 'bibliotheque_numerique';

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id',
        'id_client',
        'id_offre',
        'id_ligne_commande',
        'est_masquee',
    ];

    protected $casts = [
        'est_masquee' => 'boolean',
        'date_ajout' => 'datetime',
    ];

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class, 'id_offre', 'id_offre');
    }
}