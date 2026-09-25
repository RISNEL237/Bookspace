<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'adresse_livraison';

    protected $primaryKey = 'id_adresse';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'id_adresse',
        'id_client',
        'libelle',
        'nom_destinataire',
        'tel_livraison',
        'adresse',
        'is_default',
    ];

    protected $casts = [
        'adresse' => 'array',
        'is_default' => 'boolean',
    ];
}