<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\ApplicationStatus;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ApplicationSatusController extends Controller
{




    public function store(Request $request)
    {
        try{
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    "Message" => "Unauthorized Credential"
                ]);
            } else {
                $id = $user->id;
                $role = $user->role;
            }
            
            if($role === "recruter"){
                $request->validate([
                    'status' => 'string|in:Pending,Approved,Rejected',
                    'discription' => 'nullable|string',
                    'application_id' => 'required|exists:applies,id',
                ]);
                $status = ApplicationStatus::create([
                    'status' => $request->status,
                    'discription' => $request->description,
                    'application_id' => $request->application_id
                ]);

                
                return response()->json(["status" => $status]);
            }

            return response()->json([
                "Message" => "Unauthorized"
            ], 500);

        }catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
