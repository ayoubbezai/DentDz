<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubscriptionEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'clinic_id' => 'sometimes|exists:clinics,id',
            'plan_id' => 'sometimes|exists:plans,id',
            'price' => 'sometimes|integer|min:0',
            'currency' => 'sometimes|string|max:10',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'payment_method' => 'sometimes|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'clinic_id.exists' => 'clinic_id_exists',
            'plan_id.exists' => 'plan_id_exists',
            'price.integer' => 'price_integer',
            'price.min' => 'price_min',
            'currency.string' => 'currency_string',
            'currency.max' => 'currency_max',
            'start_date.date' => 'start_date_date',
            'end_date.date' => 'end_date_date',
            'payment_method.string' => 'payment_method_string',
            'payment_method.max' => 'payment_method_max',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'errors' => $validator->errors()->all(),
            ], 422)
        );
    }
}
