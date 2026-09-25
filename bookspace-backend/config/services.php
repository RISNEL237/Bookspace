<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'supabase' => [
        'url' => env('SUPABASE_URL'),
        'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY'),
        'digital_bucket' => env('SUPABASE_DIGITAL_BUCKET', 'digital-books'),
        'signed_url_ttl' => env('SUPABASE_SIGNED_URL_TTL', 60),
    ],
    'stripe' => [
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],
    'mtn_momo' => [
        'base_url' => env('MTN_MOMO_BASE_URL'),
        'subscription_key' => env('MTN_MOMO_SUBSCRIPTION_KEY'),
        'api_user' => env('MTN_MOMO_API_USER'),
        'api_key' => env('MTN_MOMO_API_KEY'),
        'target_environment' => env('MTN_MOMO_TARGET_ENVIRONMENT', 'sandbox'),
    ],
    'orange_money' => [
        'base_url' => env('ORANGE_MONEY_BASE_URL'),
        'client_id' => env('ORANGE_MONEY_CLIENT_ID'),
        'client_secret' => env('ORANGE_MONEY_CLIENT_SECRET'),
        'merchant_code' => env('ORANGE_MONEY_MERCHANT_CODE'),
    ],
    'camerpay' => [
        'hmac_secret' => env('CAMPAY_HMAC_SECRET'),
        'api_token' => env('CAMPAY_API_TOKEN'),
    ],

];
