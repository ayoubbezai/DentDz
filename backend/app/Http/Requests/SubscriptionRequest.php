<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'clinic_id' => 'required|exists:clinics,id',
            'plan_id' => 'required|exists:plans,id',
            'price' => 'required|integer|min:0',
            'currency' => 'required|string|max:10',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'payment_method' => 'required|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'clinic_id.required' => 'clinic_id_required',
            'clinic_id.exists' => 'clinic_id_exists',

            'plan_id.required' => 'plan_id_required',
            'plan_id.exists' => 'plan_id_exists',

            'price.required' => 'price_required',
            'price.integer' => 'price_integer',
            'price.min' => 'price_min',

            'currency.required' => 'currency_required',
            'currency.string' => 'currency_string',
            'currency.max' => 'currency_max',

            'start_date.required' => 'start_date_required',
            'start_date.date' => 'start_date_date',

            'end_date.required' => 'end_date_required',
            'end_date.date' => 'end_date_date',

            'payment_method.required' => 'payment_method_required',
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
