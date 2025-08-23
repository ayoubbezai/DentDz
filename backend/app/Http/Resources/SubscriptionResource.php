<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'clinic_id' => $this->clinic_id,
            'clinic_name' => $this->clinic->clinic_name ?? null, // Flattened
            'plan_id' => $this->plan_id,
            'plan_name' => $this->plan->plan_name ?? null, // Flattened
            'price' => $this->price,
            'currency' => $this->currency,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'payment_method' => $this->payment_method,
            'created_at' => $this->created_date,
            'updated_at' => $this->updated_date,
        ];
    }
}
