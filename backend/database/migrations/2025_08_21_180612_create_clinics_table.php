<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClinicsTable extends Migration
{
    public function up()
    {
        Schema::create('clinics', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('clinic_name', 255);

            // Encrypted fields should be text to avoid truncation
            $table->text('adress');
            $table->text('phone_number_1');
            $table->text('phone_number_2')->nullable();
            $table->text('clinic_email')->nullable();

            $table->string('clinic_logo_512')->nullable(); // path to uploaded file

            // Wilaya number (1-58)
            $table->unsignedTinyInteger('wilaya_number');

            // Foreign key referencing users table
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Index for faster queries
            $table->index('user_id');

            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('clinics');
    }
}
