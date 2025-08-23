<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\SubscriptionResource;
use App\Http\Requests\Subscription\SubscriptionRequest;
use App\Http\Requests\Subscription\SubscriptionEditRequest;
use App\Http\Requests\Subscription\SubscriptionIndexRequest;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    // get all subscription
    // auth : true
    // role : super_admin , clinic(only its subscription )
    // subsciptions : all
    // query :  per_page / page / sort_dir / filter by plans
  // get all subscription

public function index(SubscriptionIndexRequest $request)
{
    try {
        $query = Subscription::with([
            'clinic:id,clinic_name',
            'plan:id,plan_name'
        ]);

        // If user is clinic, only show their subscriptions
        if (Auth::user()->role->name === 'clinic') {
            $query->where('clinic_id', Auth::user()->clinic->id);
        }

        // Filter by plan NAME - find plan ID first
        if ($request->has('plan_name')) {
            $plan = Plan::where('plan_name', $request->plan_name)->first();
            if ($plan) {
                $query->where('plan_id', $plan->id);
            } else {
                // Return empty result if plan name doesn't exist
                $query->where('plan_id', -1);
            }
        }


        // Filter by active/expired status
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('end_date', '>', now());
            } elseif ($request->status === 'expired') {
                $query->where('end_date', '<=', now());
            }
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->end_date);
        }

        // Sorting
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_dir ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->per_page ?? 15;
        $subscriptions = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => SubscriptionResource::collection($subscriptions),
            'pagination' => [
                'current_page' => $subscriptions->currentPage(),
                'per_page' => $subscriptions->perPage(),
                'total' => $subscriptions->total(),
                'last_page' => $subscriptions->lastPage(),
                'from' => $subscriptions->firstItem(),
                'to' => $subscriptions->lastItem(),
            ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'failed',
        ], 500);
    }
}
    //this is to add new subscription
    // auth : required
    // roles : for now only superadmin mybe later we add online payemtns
  public function store(SubscriptionRequest $request)
{
    // here we get the validated data
    $data = $request->only([
        'clinic_id',
        'plan_id',
        'price',
        'currency',
        'start_date',
        'end_date',
        'payment_method'
    ]);

    try {
        Subscription::create($data);

        return response()->json([
            'success' => true,
            'data' => [],
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'failed',
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

    // this is when u want change somthing in subscription
    // auth : true
    // role : only super_admin
    // subscription : null
   public function update(SubscriptionEditRequest $request, string $id)
{
    try {
        $subscription = Subscription::find($id);
        if (!$subscription) {
            return response()->json([
                'success' => false,
                'error' => 'not_found',
            ], 404);
        }


        $subscription->update($request->only([
        'clinic_id',
        'plan_id',
        'price',
        'currency',
        'start_date',
        'end_date',
        'payment_method'
    ]));

        return response()->json([
            'success' => true,
            'data' => [],
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'failed',
        ], 500);
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
