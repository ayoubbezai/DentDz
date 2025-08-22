<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Http\Requests\SubscriptionRequest;
use App\Http\Requests\SubscriptionEditRequest;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
   public function update(SubscriptionEditRequest $request, string $id)
{
    try {
        $subscription = Subscription::find($id);
        if (!$subscription) {
            return response()->json([
                'success' => false,
                'error' => 'subscription_not_found',
            ], 404);
        }


        $subscription->update($request);

        return response()->json([
            'success' => true,
            'data' => $subscription->fresh(),
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'subscription_update_failed',
            'message' => $e->getMessage()
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
