<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ClinicResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Clinic\ClinicEditRequest;
use App\Http\Requests\Clinic\ClinicIndexRequest;
use App\Http\Requests\Clinic\SignupClinicRequest;

class ClinicController extends Controller
{
    // 🔐 helper for unserialized DB values
    private static function safeUnserialize($value)
    {
        $unserialized = @unserialize($value);
        return $unserialized !== false || $value === 'b:0;' ? $unserialized : $value;
    }

    /**
     * Display a listing of the resource.
     */

    // get all clinics // auth : true // role : super_admin // quires : per_page / page / search / wilaya / sort_dir / sort_by / later :: isSubscriped /subscription_plan
    public function index(ClinicIndexRequest $request)
    {
        try {
            $clinic_query = Clinic::query();

            if ($request->has("search")) {
                $clinic_query->whereAny(["clinic_name"], 'LIKE', "%$request->search%");
            }

            if ($request->has("wilaya_number")) {
                $clinic_query->where("wilaya_number", $request->wilaya_number);
            }

            $sortField = $request->sort_by ?? 'created_at';
            $sortDirection = $request->sort_dir ?? 'desc';
            $clinic_query->orderBy($sortField, $sortDirection);

            $perPage = $request->per_page ?? 15;
            $clinics = $clinic_query->paginate($perPage);

            $clinicIds = $clinics->pluck("id");

            // fetch subscriptions
            $activeSubscriptions = Subscription::with('plan')
                ->whereIn("clinic_id", $clinicIds)
                ->where('end_date', '>', now())
                ->get()
                ->groupBy('clinic_id');

            $clinics->getCollection()->transform(function ($clinic) use ($activeSubscriptions) {
                $clinicSubscriptions = $activeSubscriptions->get($clinic->id);

                $clinic->isSubscribed = !empty($clinicSubscriptions);

                if ($clinic->isSubscribed) {
                    $bestSubscription = $clinicSubscriptions->sortByDesc(fn($s) => $s->plan->value)->first();
                    $clinic->current_best_plan = $bestSubscription->plan->plan_name;
                    $clinic->subscription_end_date = $clinicSubscriptions->max('end_date');
                } else {
                    $clinic->current_best_plan = null;
                    $clinic->subscription_end_date = null;
                }

                foreach (['adress', 'phone_number_1', 'phone_number_2','clinic_email'] as $field) {
                    if (!empty($clinic->{$field}) && is_string($clinic->{$field})) {
                        $clinic->{$field} = self::safeUnserialize($clinic->{$field});
                    }
                }

                return $clinic;
            });

            return response()->json([
                'success' => true,
                'data' => ClinicResource::collection($clinics),
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
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */

    //this is to create new clinic its signup of this prject and does not need any auth //roles :: all , even without auth
    public function store(SignupClinicRequest $request)
    {
        try {
            DB::beginTransaction();

            $userData = $request->only('email', 'password');
            $userData["role_id"] = Role::where("name", "clinic")->value("id");
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

            $clinic = Clinic::create($clinicData);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => new ClinicResource($clinic),
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

// show one clinic details
// not important yet but this is for
// auth : true
// roles : super_admin , clinic it self not all
// subscription : all
// note : this is not important for now

    public function show(string $id)
    {
        try {
            $clinic = Clinic::find($id);
            // here we do it manuly to return propoer response
            if(!$clinic){
             return response()->json([
                'success' => false,
                'error' => 'not_found',
            ], 404);

            }
            foreach (['adress', 'phone_number_1', 'phone_number_2'] as $field) {
                if (!empty($clinic->{$field}) && is_string($clinic->{$field})) {
                    $clinic->{$field} = self::safeUnserialize($clinic->{$field});
                }
            }

            return response()->json([
                'success' => true,
                'data' => new ClinicResource($clinic),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'failed',
            ], 500);
        }
    }

// update a clinic its like store
// auth : true
// roles : super_admin , clinic it self not all
// subscription : all

    public function update(ClinicEditRequest $request, string $id)
    {
        try {
            $clinic = Clinic::find($id);
            // here we do it manuly to return propoer response
            if(!$clinic){
             return response()->json([
                'success' => false,
                'error' => 'not_found',
            ], 404);
            }
            // here we check if is the  clinic it self #


            $clinic->update($request->only(
                'clinic_name',
                'adress',
                'phone_number_1',
                'phone_number_2',
                'wilaya_number',
                'clinic_email'
            ));

            if ($request->hasFile('clinic_logo_512')) {


                $clinic->clinic_logo_512 = $request->file('clinic_logo_512')
                    ->store('clinic_logos', 'public');
                $clinic->save();
            }


            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'failed',
            ], 500);
        }
    }

// remove a clinic is only by super_admin
// to do : need to make it soft delete
// we do options of soft delte and retrive it and aslo delte at all
    public function destroy(string $id)
    {
        try {
            $clinic = Clinic::findOrFail($id);
            $clinic->delete();

            return response()->json([
                'success' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'failed',
            ], 500);
        }
    }
}
