<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubscriptionIndexRequest extends FormRequest
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
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:100',
            'sort_by' => 'sometimes|string|in:id,price,start_date,end_date,created_at',
            'sort_dir' => 'sometimes|string|in:asc,desc',
            'plan_name' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|in:active,expired',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ];
    }

    public function messages(): array
    {
        return [
            'page.integer' => 'page_integer',
            'page.min' => 'page_min',

            'per_page.integer' => 'per_page_integer',
            'per_page.min' => 'per_page_min',
            'per_page.max' => 'per_page_max',

            'sort_by.string' => 'sort_by_string',
            'sort_by.in' => 'sort_by_in',

            'sort_dir.string' => 'sort_dir_string',
            'sort_dir.in' => 'sort_dir_in',

            'plan_name.string' => 'plan_name_string',
            'plan_name.max' => 'plan_name_max',



            'status.string' => 'status_string',
            'status.in' => 'status_in',

            'start_date.date' => 'start_date_date',

            'end_date.date' => 'end_date_date',
            'end_date.after_or_equal' => 'end_date_after_or_equal',
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
