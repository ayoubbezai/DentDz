<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SignupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'name_required',
            'name.string'       => 'name_string',
            'name.max'          => 'name_max',

            'email.required'    => 'email_required',
            'email.email'       => 'email_invalid',
            'email.unique'      => 'email_unique',

            'password.required' => 'password_required',
            'password.string'   => 'password_string',
            'password.min'      => 'password_min',
            'password.max'      => 'password_max',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'errors'  => $validator->errors()->messages(), // returns array like email_max, password_required, etc.
            ], 422)
        );
    }
}
