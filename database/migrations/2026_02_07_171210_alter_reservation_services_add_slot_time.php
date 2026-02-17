<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reservation_services', function (Blueprint $table) {
            $table->time('slot_time')->after('service_id');
        });
        Schema::table('reservations', function (Blueprint $table) {
            $table->time('reservation_time')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('reservation_services', function (Blueprint $table) {
            $table->dropColumn('slot_time');
            $table->time('reservation_time')->nullable(false)->change();

        });
    }
};

