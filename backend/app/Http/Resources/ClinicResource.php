<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'clinic_name'            => $this->clinic_name,
            'adress'                 => $this->adress,         // decrypted string
            'wilaya_number'          => $this->wilaya_number,
            'phone_number_1'         => $this->phone_number_1, // decrypted string
            'phone_number_2'         => $this->phone_number_2, // decrypted string
            'clinic_email'           => $this->clinic_email,   // decrypted string
            'clinic_logo_512'        => $this->clinic_logo_512,

            // Subscription info (added in controller)
            'isSubscribed'           => $this->isSubscribed ?? false,
            'current_best_plan'      => $this->current_best_plan ?? null,
            'subscription_end_date'  => $this->subscription_end_date ?? null,

            // Metadata
            'created_at'             => $this->created_at,
            'updated_at'             => $this->updated_at,
        ];
    }
}
