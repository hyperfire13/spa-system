<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_schedules', function (Blueprint $table) {
            $table->unsignedInteger('slot_minutes')
                  ->default(30)
                  ->after('end_time');

            $table->unsignedInteger('capacity_per_slot')
                  ->default(1)
                  ->after('slot_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('service_schedules', function (Blueprint $table) {
            $table->dropColumn([
                'slot_minutes',
                'capacity_per_slot'
            ]);
        });
    }
};

