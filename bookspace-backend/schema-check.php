<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach (['orders', 'order_items', 'profiles', 'books', 'sellers', 'users'] as $table) {
    echo "TABLE: {$table}\n";
    $columns = Illuminate\Support\Facades\DB::select(
        "SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = ?
         ORDER BY ordinal_position",
        [$table]
    );

    foreach ($columns as $column) {
        echo json_encode((array) $column, JSON_UNESCAPED_UNICODE), "\n";
    }

    echo "\n";
}

$authColumns = Illuminate\Support\Facades\DB::select(
    "SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema = 'auth' AND table_name = 'users'
     ORDER BY ordinal_position"
);

echo "TABLE: auth.users\n";
foreach ($authColumns as $column) {
    echo json_encode((array) $column, JSON_UNESCAPED_UNICODE), "\n";
}

echo "\n";

$keys = Illuminate\Support\Facades\DB::select(
    "SELECT conname, conrelid::regclass AS table_name, confrelid::regclass AS referenced_table
     FROM pg_constraint
     WHERE conname IN ('profiles_id_fkey', 'sellers_user_id_fkey')"
);

echo "FK CHECK\n";
foreach ($keys as $key) {
    echo json_encode((array) $key, JSON_UNESCAPED_UNICODE), "\n";
}
