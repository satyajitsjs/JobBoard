<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\Apply;
use App\Models\Joblists;
use App\Models\Categories;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\Paginator;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class JobListController extends Controller
{
    
    public function index()
    {   
        try{
            $user = Auth::user();
            if(!$user){
                return response()->json([
                    "Message"=>"Unauthrized Credential"
                ]);
            }else{
                $id = $user->id;
                $role = $user->role;
            }
            if($role ==="jobseeker"){
                $Joblist = Joblists::paginate(5);
                $JoblistWithApplications = [];
                foreach ($Joblist as $job) {
                    $applications = Apply::where('joblist_id', $job->id)->get();
                    $JoblistWithApplications[] = [
                        'job' => $job,
                        'job_created_at' => $job->created_at,
                        'time_distance_from_created' => $job->created_at->diffForHumans(),
                    ];
                }
                return response()->json([
                    'Joblists' => $JoblistWithApplications,
                    'JoblistUrls'=>$Joblist
                ]);
            }
            
            if ($role === "recruter"){

                $Joblist = Joblists::where('employer_id',$id)->paginate(5);
                $JoblistWithApplications = [];
                foreach ($Joblist as $job) {
                    $applications = Apply::where('joblist_id', $job->id)->paginate(5);
                    $JoblistWithApplications[] = [
                        'job' => $job,
                        'applications_count' => count($applications),
                        'job_created_at' => $job->created_at,
                        'time_distance_from_created' => $job->created_at->diffForHumans(),
                    ];
                }
                return response()->json([
                    'Joblists' => $JoblistWithApplications,
                    'JoblistUrls'=>$Joblist
                ]);


            }if ($role === "admin"){
                $Joblist = Joblists::where('employer_id',$id)->get();
                return response()->json(['Joblists' => $Joblist]);
            }
                return response()->json(['Error'=>"invalid User Role"]);
            

            return response()->json(['Message' => "Unauthorized"]);



        }catch(Exception $e){
            return response()->json([
                'error'=> $e->getMessage()               
            ]); 
        }
    }


    public function store(Request $request)
    {
        try{
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'requirements'=> 'required|string|max:255',
                "company_name"=>"required|string|max:255",
                'location' => "required|string|",
                'categories'=>"required|array",
                'job_type'=>"required|in:FullTime,PartTime",
                'experience'=>"required|string",
                'qualification'=>"required|string",
                'salry_range'=>"required|string",
            ]);
            $user = Auth::user();
            if(!$user){
                return response()->json([
                    "Message"=>"Unauthrized Credential"
                    
                ]);
            }else{
                $id = $user->id;
                $role = $user->role;
            }
            if($role!=="recruter"){
                return response()->json([
                    "Error"=>"Unauthorized User does not have the require role"
                ],403);
            }
            
            $joblist = Joblists::create([
            'title' => $request->title,
            'description' => $request->description,
            'requirements'=> $request->requirements,
            "company_name"=>$request->company_name,
            'location'=>$request->location,
            'employer_id'=>$id,
            'categories'=>$request->categories,
            'job_type'=>$request->job_type,
            'experience'=>$request->experience,
            'qualification'=>$request->qualification,
            'salry_range'=>$request->salry_range,
        ]);
        if ($request->has('categories')) {
            $data = $request->input('categories');
            if(!is_array($data)){
                $data=array($data);
            }
            $joblist->category()->attach($data);
        }

        return response()->json(
            [
                'jobList' => $joblist,
                'message'=>'Job Crated Successfully' 
            ]);
            
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage()
            ]);
        }
    }


    
    
    
    public function show($id)
    {
        try{
        $joblist = Joblists::find($id);

        if (!$joblist) {
            return response()->json(['error' => 'Job list not found'], 404);
        }

        return response()->json(['jobList' => $joblist]);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage()
            ]);
        }
    }  


    public function update(Request $request, $id)
    {
        try{

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'requirements'=> 'required|string|max:255',
                "company_name"=>"required|string|max:255",
                'location' => "required|string|",
                'categories'=>"required|array",
                'job_type'=>"required|in:FullTime,PartTime",
                'experience'=>"required|string",
                'qualification'=>"required|string",
                'salry_range'=>"required|string",   
        ]);

        $joblist = Joblists::find($id);

        if (!$joblist) {
            return response()->json(['error' => 'Job list not found'], 404);
        }

        if ($request->has('categories')) {
            $data = $request->input('categories');
            if(!is_array($data)){
                $data=array($data);
            }
            $joblist->category()->sync($data);
        }

        $joblist->title = $request->title;
        $joblist->description = $request->description;
        $joblist->requirements = $request->requirements;
        $joblist->company_name = $request->company_name;
        $joblist->location = $request->location;
        $joblist->job_type = $request->job_type;
        $joblist->experience = $request->experience;
        $joblist->qualification = $request->qualification;
        $joblist->salry_range = $request->salry_range;
        $joblist->save();
        
        return response()->json(['jobList' => $joblist]);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage()
            ]);
        }
    }


    
    public function destroy($id)
    {
        try{

            $joblist = Joblists::find($id);
            
            if (!$joblist) {
                return response()->json(['error' => 'Job list not found'], 404);
            }
            
            $joblist->delete();

            return response()->json(['message' => 'Job list deleted successfully']);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage()
            ]);
        }
    }


       public function getJobsByCategory($id)
    {
        try {
            $category = Categories::find($id);

            if (!$category) {
                return response()->json(['error' => 'Category not found'], 404);
            }

            $jobs = $category->joblists;

            return response()->json(['jobs' => $jobs]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    
    public function searchByTitle($title)
    {
        try {
            $results = Joblists::where('title', 'LIKE', "%{$title}%")->get();

            return response()->json([
                "result" => $results,
                "Message" => "Search by Title Successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "Error" => $e->getMessage(),
            ], 500);
        }
    }

    public function searchByLocation($location)
    {
        try {
            $results = Joblists::where('location', 'LIKE', "%{$location}%")->get();

            return response()->json([
                "result" => $results,
                "Message" => "Search by Location Successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "Error" => $e->getMessage(),
            ], 500);
        }
    }

    public function searchByQualification($qualification)
    {
        try {
            $results = Joblists::where('qualification', $qualification)->get();

            return response()->json([
                "result" => $results,
                "Message" => "Search by Qualification Successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "Error" => $e->getMessage(),
            ], 500);
        }
    }

    public function searchByJobType($jobType)
    {
        try {
            $results = Joblists::where('job_type', $jobType)->get();

            return response()->json([
                "result" => $results,
                "Message" => "Search by Job Type Successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "Error" => $e->getMessage(),
            ], 500);
        }
    }

    public function searchBySalaryRange($salaryRange)
    {
        try {
            $results = Joblists::where('salry_range', $salaryRange)->get();

            return response()->json([
                "result" => $results,
                "Message" => "Search by Salary Range Successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "Error" => $e->getMessage(),
            ], 500);
        }
    }

} 
