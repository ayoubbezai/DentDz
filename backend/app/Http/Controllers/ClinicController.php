<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Crypt;
use App\Http\Requests\ClinicIndexRequest;
use App\Http\Requests\SignupClinicRequest;

class ClinicController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    // get all clinics
    // auth : true
    // role : super_admin
    // quires : per_page / page / search / wilaya / sort_dir / sort_by
    public function index(ClinicIndexRequest $request)
    {
        // we need to do validation for the quires
    try{
        // form the query

        $clinic_query = Clinic::query();

        // if the user search for somthing

        if($request->has("search")){
            $clinic_query->whereAny(["clinic_name"],'LIKE',"%$request->search%");
        };

        // if the admin wanna filter by wilaya

        if($request->has("wilaya_number")){
            $clinic_query->where("wilaya_number",$request->wilaya_number);
        };

        // if admin wanna change the sort filed or direction  default are created_at with desc

        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_dir ?? 'desc';

        $clinic_query->orderBy($sortField,$sortDirection);

        // here we filter how many elments per page

         $perPage = $request->per_page ?? 15;

         // here we get paginated data
         $clinics = $clinic_query->paginate($perPage);

         // Get all clinic IDs from the paginated results

         $clinicIds = $clinics->pluck("id");

         // Get ALL active subscriptions for these clinics in one query
        $activeSubscriptions = Subscription::whereIn("clinic_id",$clinicIds)
        ->where('end_date', '>', now())
        ->select("clinic_id")
        ->distinct()
        ->pluck("clinic_id")
        ->toArray();

        // now map and add isSubscribed

        $clinics->getCollection()->transform(function($clinic) use($activeSubscriptions){
            $clinic->isSubscribed = in_array($clinic->id, $activeSubscriptions);
            return $clinic;
        });


    return response()->json([
            'success' => true,
            'data' =>  $clinics->items(),
            'pagination' => [
            'current_page' => $clinics->currentPage(),
            'per_page' => $clinics->perPage(),
            'total' => $clinics->total(),
            'last_page' => $clinics->lastPage(),
            'from' => $clinics->firstItem(),
            'to' => $clinics->lastItem(),
         ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'failed',
        ], 500);
    }
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
