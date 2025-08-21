<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\SignupClinicRequest;
use App\Models\Role;
use App\Models\User;
use App\Models\Clinic;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ClinicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

//this is to create new clinic its signup of this prject and does not need any auth
//roles :: all , even without auth

public function store(SignupClinicRequest $request)
{
    try {
        //here we do transaciton to make sure everything is created not only one
        DB::beginTransaction();
        //here we collect the data that we will create with it the account

        $userData = $request->only('email', 'password');
        // we search for the id of clinic role
        $role_id = Role::where("name","clinic")->value("id");
        $userData["role_id"] = $role_id;
        // we create account fro this clinci
        $created_user = User::create($userData);

        $clinicData = $request->only(
            'clinic_name',
            'adress',
            'phone_number_1',
            'phone_number_2',
            'wilaya_number',
            'clinic_email'
        );

        $clinicData['user_id'] = $created_user->id;

        if ($request->hasFile('clinic_logo_512')) {
            $clinicData['clinic_logo_512'] = $request->file('clinic_logo_512')
                ->store('clinic_logos', 'public');
        }

        Clinic::create($clinicData);

        DB::commit();

        return response()->json([
            'success' => true,
            'data' => [],
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'error' => 'failed',
            'message' => $e->getMessage()

        ], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
