<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Représente la table "client" créée directement dans Supabase (voir
 * le script SQL). Cette table existe déjà en base — Laravel ne la
 * crée jamais via une migration, il s'y connecte simplement.
 */
class Client extends Model
{
    // Le nom de la table ne suit pas la convention Laravel (qui
    // aurait cherché "clients" au pluriel) : on le précise nous-même.
    protected $table = 'client';

    // La clé primaire est un UUID (généré par Supabase), pas un
    // entier auto-incrémenté comme Laravel l'attend par défaut.
    protected $keyType = 'string';
    public $incrementing = false;

    // On gère nous-même "date_inscription" ; pas de created_at/updated_at
    // automatiques à la mode Laravel sur cette table.
    public $timestamps = false;

    protected $fillable = [
        'nom_complet',
        'tel_client',
    ];

    protected $casts = [
        'est_admin' => 'boolean',
        'date_inscription' => 'datetime',
    ];
}
