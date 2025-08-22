<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ClinicIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    public function rules(): array
    {
        return [
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:100',
            'search' => 'sometimes|string|max:255',
            'wilaya' => 'sometimes|integer|min:1|max:58',
            'sort_by' => 'sometimes|string|in:name,email,created_at,updated_at,wilaya_number',
            'sort_dir' => 'sometimes|string|in:asc,desc',
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
            'search.string' => 'search_string',
            'search.max' => 'search_max',
            'wilaya.integer' => 'wilaya_integer',
            'wilaya.min' => 'wilaya_min',
            'wilaya.max' => 'wilaya_max',
            'sort_by.string' => 'sort_by_string',
            'sort_by.in' => 'sort_by_in',
            'sort_dir.string' => 'sort_dir_string',
            'sort_dir.in' => 'sort_dir_in',
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
