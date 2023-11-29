<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\Apply;
use App\Models\Joblists;
use App\Models\ApplicationStatus;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    "Message" => "Unauthorized Credential"
                ]);
            } else {
                $id = $user->id;
                $role = $user->role;
            }

            if ($role === "recruiter") {
                $Apply = Apply::join('joblists', 'applies.joblist_id', '=', 'joblists.id')
                    ->select('applies.id', 'joblists.title', 'joblists.company_name' , 'joblists.location' , )
                    ->get();
                return response()->json(['Apply' => $Apply]);
            }
            
            if ($role === "jobseeker") {
                $Apply = Apply::join('joblists', 'applies.joblist_id', '=', 'joblists.id')
                    ->where('applies.user_id', $id) 
                    ->select('applies.id', 'applies.cover_letter', 'applies.resume_file_path', 'joblists.title', 'joblists.company_name', 'joblists.location', 'application_status.status', 'application_status.discription', 'application_status.updated_at') 
                    ->leftJoin('application_status', function($join) {
                        $join->on('applies.id', '=', 'application_status.application_id')
                             ->where('application_status.updated_at', function ($query) {
                                 $query->selectRaw('MAX(updated_at)')
                                       ->from('application_status')
                                       ->whereColumn('application_id', 'applies.id');
                             });
                    })
                    ->orderBy('application_status.updated_at', 'desc') 
                    ->get();
                return response()->json(['Apply' => $Apply]);    
            }
             
            return response()->json(['Error' => "Invalid User Role"]);
            
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    "Message" => "Unauthorized Credential"
                ]);
            } else {
                $id = $user->id;
                $role = $user->role;
            }
    
            if ($role === "jobseeker") {
                $request->validate([
                    'joblist_id' => 'required|exists:joblists,id',
                    'cover_letter' => 'required|string|max:500',
                    'resume_file_path' => 'required|file|mimes:pdf,doc,docx|max:2048',
                ]);
    
                if ($request->hasFile('resume_file_path')) {
                    if ($file = $request->file('resume_file_path')) {
                        $name = time() . ".Hy." . $file->getClientOriginalName();
                        $name = preg_replace('/\s+/', '-', $name);
                        $file->storeAs('public/resumes', $name);
    
                        $application = Apply::create([
                            'joblist_id' => $request->joblist_id,
                            'user_id' => $id,
                            'cover_letter' => $request->cover_letter,
                            'resume_file_path' => $name,
                        ]);
    
                        $status = ApplicationStatus::create([
                            'status' => 'Pending',
                            'discription'=> 'The status is Pending',
                            'application_id' => $application->id,
                        ]);
    
                        return response()->json([
                            'message' => 'Application created successfully',
                            'application' => $application,
                            'status' => $status,
                        ], 201);
                    }
                }
    
                return response()->json([
                    "Message" => "No resume file found"
                ], 400);
            }
    
            return response()->json([
                "Message" => "Unauthorized User does not have the required role"
            ], 403);
    
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    

    public function show($id)
    {
        try{
            $user = Auth::id();
            if(!$user){
                return response()->json([
                    "Message"=>"Unauthrized Credential"
                    
                ]);
            }
        $application = Apply::find($id);

        if (!$application) {
            return response()->json(['error' => 'Application Not Found'], 404);
        }
        return response()->json(
            [
                'Application' => $application,
                'Message'=> "Application Found Succesfully"
            ]);
        } catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage()
            ]);
        }
    }



    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
    
            if (!$user) {
                return response()->json([
                    "error" => "User Not Found"
                ]);
            }
    
            $application = Apply::find($id);
            if (!$application) {
                return response()->json(['error' => 'Application not found'], 404);
            }
    
            // Validate joblist_id
            $joblistId = $request->input('joblist_id');
    
            if ($request->hasFile('resume_file_path')) {
                $file = $request->file('resume_file_path');
                if ($file->isValid()) {
                    $path = $file->store('public/resumes');
                    $application->resume_file_path = $path;
                } else {
                    return response()->json([
                        'error' => 'Invalid file provided'
                    ]);
                }
            }
            // In postman Key:X-HTTP-Method-Override and value:PUT in header then the in post method you can use put 
    
            $application->cover_letter = $request->input('cover_letter');
            $application->joblist_id = $joblistId;
            $application->save();
    
            return response()->json([
                'Updated Application' => $application,
                'Message' => 'Application Updated Successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
    

    public function destroy($id)
    {
        try{
            $User = Auth::id();
            if(!$User){
                return response()->json([
                    "Error"=>"User Not Found"
                ]);
            }

            $application = Apply::find($id);
            if (!$application) {
                return response()->json([
                    'error' => 'Unauthorized',
                ], 401);
            }

            $application->delete();

            return response()->json([
                "Message"=>"Application Deleted SuccessFully"
            ]);

        }catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }



public function getApplicantsForJob($id)
    {

        $applicants = Apply::where('joblist_id', $id)->with('applicationStatus')->with('users')->with('joblist')->get();
        return response()->json(['applicants' => $applicants]);

    }

    public function deleteApplicants($id)
    {
        try{
        $applicants = Apply::where('joblist_id', $id)->with('users')->with('joblist')->get();

        $applicants->delete();

        return response()->json([
            "Message"=>"Application Deleted SuccessFully"
        ]);
    }catch (Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
        ], 500);
    }

    }



public function downloadResume($id)
    {
        $apply = Apply::find($id);

        if (!$apply) {
            return response()->json(['error' => 'Resume not found'], 404);
        }

        $resumeFileName = $apply->resume_file_path; 
        $file= storage_path('app/public/resumes/' . $resumeFileName);
        
        
        if(!Storage::disk('public')->exists('resumes/' . $resumeFileName)){
            return response()->json([
                "error"=>"File path not found"
            ]); 
        }
        $fileName = "resume_" . $id . "." . pathinfo($file,PATHINFO_EXTENSION);

        return response()->download($file , $fileName);
        
        
    }



    public function getApplicantDetails($jobId, $applicantId)
    {
        $applicant = Apply::where('joblist_id', $jobId)
            ->with('applicationStatus')
            ->with('users')
            ->with('joblist')
            ->where('id', $applicantId)
            ->first();

        if (!$applicant) {
            return response()->json(['message' => 'Applicant not found'], 404);
        }

        return response()->json(['applicant' => $applicant]);
    }

}
