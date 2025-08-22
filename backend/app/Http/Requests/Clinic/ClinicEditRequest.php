<?php

namespace App\Http\Requests\Clinic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ClinicEditRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'clinic_name'       => 'sometimes|string|max:255',
            'email'             => 'sometimes|email|unique:users,email',
            'password'          => 'sometimes|string|min:8|max:255',
            'adress'            => 'sometimes|string|max:255',
            'wilaya_number'     => 'sometimes|integer|min:1|max:58',
            'phone_number_1'    => 'sometimes|string|max:255',
            'phone_number_2'    => 'nullable|string|max:255',
            'clinic_email'      => 'nullable|email',
            'clinic_logo_512'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'clinic_name.string'     => 'clinic_name_string',
            'clinic_name.max'        => 'clinic_name_max',

            'email.email'            => 'email_invalid',
            'email.unique'           => 'email_unique',

            'password.string'        => 'password_string',
            'password.min'           => 'password_min',
            'password.max'           => 'password_max',

            'adress.string'          => 'adress_string',
            'adress.max'             => 'adress_max',

            'wilaya_number.integer'  => 'wilaya_number_integer',
            'wilaya_number.min'      => 'wilaya_number_min',
            'wilaya_number.max'      => 'wilaya_number_max',

            'phone_number_1.string'   => 'phone_number_1_string',
            'phone_number_1.max'      => 'phone_number_1_max',

            'phone_number_2.string'   => 'phone_number_2_string',
            'phone_number_2.max'      => 'phone_number_2_max',

            'clinic_email.email'      => 'clinic_email_invalid',

            'clinic_logo_512.image'   => 'clinic_logo_512_image',
            'clinic_logo_512.mimes'   => 'clinic_logo_512_mimes',
            'clinic_logo_512.max'     => 'clinic_logo_512_max',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'errors'  => $validator->errors()->all(),
            ], 422)
        );
    }
}
