<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\Joblists;
use App\Models\Categories;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index(){
        try{
            $category = Categories::all();
    
            return response()->json(['category' => $category]);
            }catch(Exception $e){
                return response()->json([
                    'error'=> $e->getMessage()
                ]);
            }
    }

    public function store(Request $request){
        try{
        $request->validate(
            [
                'name'=>'required|string|unique:categories'
            ]
            );
            
            $user = Auth::user();
            if(!$user){
                return response()->json([
                    "Message"=>"Unauthrized Credential"
                    
                ]);
            }else{
                $id = $user->id;
                $role = $user->role;
            }
            if($role!=="admin"){
                return response()->json([
                    "Error"=>"Unauthorized User does not have the require role"
                ],403);
            }
        $category = Categories::create([
            'name'=>$request->name
        ]);
        if($category){
            return response()->json([
                'categories'=>$category,
                'message'=> "Category created Successfully"
            ] , 200);
        }else{
            return response()->json([
                'categories'=>$category,
                'error'=>"Categories already Exist"
            ] , 401);
        }
        
        }catch(Exception $e){
            return response()->json([
                "Error"=>$e->getMessage()
            ]);
        }
    }

    public function show($id)
    {
        try {
            $category = Categories::find($id);
    
            if (!$category) {
                return response()->json(['error' => 'Category not found'], 404);
            }
    
            $jobs = $category->joblists;
    
            return response()->json(['category' => $category, 'jobs' => $jobs]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    

    public function update(Request $request , $id)
    {
        try{

            $request->validate([
                'name'=>'required|string|unique:categories'
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
        if($role!=="admin"){
            return response()->json([
                "Error"=>"Unauthorized User does not have the require role"
            ],403);
        }

        $category = Categories::find($id);

        if (!$category) {
            return response()->json(['error' => 'category not found'], 404);
        }

        $category->name = $request->name;
        $category->save();
        
        return response()->json(
            [
            'category' => $category,
            'message' => "Category Updatae SuccessFully"
            ]
        );
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage()
            ]);
        }
    }


    public function destroy($id)
    {
        try{

            $category = Categories::find($id);
            
            if (!$category) {
                return response()->json(['error' => 'Category not found'], 404);
            }
            
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
        }catch(Exception $e){
            return response()->json([
                'error'=>$e->getMessage()
            ]);
        }
}



    public function search($name)
    {
        try{
            $results = Categories::where('name', 'LIKE', "%".$name."%")->get();
            return response()->json(
                [
                    "result"=>$results,
                    "Message"=>"Search Found Successfully",
                ]);
        }catch(Exception $e){
            return response()->json([
                "Error"=>$e->getMessage()
            ]);
        }
    }

   
    public function getJobsByCategory($id)
    {
        try {
            
            $category = Categories::find($id);
            
            if (!$category) {
                return response()->json(['error' => 'Job not found'], 404);
            }

            $user = Auth::user();
            if(!$user){
                return response()->json([
                    "Message"=>"Unauthrized Credential"
                    
                ]);
            }else{
                $id = $user->id;
                $role = $user->role;
            }

            if($role == "recruter"){
                $jobs = $category->joblist()->where('employer_id',$id)->get();
                return response()->json(['jobs' => $jobs]);
            }else{

            $jobs = $category->joblist;
        }
            return response()->json(['jobs' => $jobs]);
            
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
