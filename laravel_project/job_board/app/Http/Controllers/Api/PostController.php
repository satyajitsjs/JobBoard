<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\Posts;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostController extends Controller
{

    public function index()
    {
        try {
            $posts = Posts::where('status', 'publish')
                ->with('user')
                ->with('comments')  
                ->paginate(3);
                
    
            return response()->json(['Posts' => $posts]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }


private function generateUniqueSlug($title)
{
    $slug = Str::slug($title, '_'); 

    $count = Posts::where('slug', $slug)->count();

    if ($count > 0) {
        $suffix = 1;
        while (Posts::where('slug', $slug . '_' . $suffix)->count() > 0) {
            $suffix++;
        }
        $slug .= '_' . $suffix;
    }

    return $slug;
}



    public function store(Request $request)
{


        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "message" => "Unauthorized Credential"
            ]);
        }
        
        $id = $user->id;

        
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'status' => 'required|in:publish,draft',
            'image_path' => 'image|mimes:jpeg,png,jpg,gif',
        ]);

        $slug = $this->generateUniqueSlug($request->title);
        
        try {
            if ($request->hasFile('image_path')) {
                $file = $request->file('image_path');
                $name = time() . ".Hy." . $file->getClientOriginalName();
                $name = preg_replace('/\s+/', '-', $name);
                $file->storeAs('public/images', $name);
                
                $data = Posts::create([
                    'title' => $request->title,
                    'content' => $request->content,
                    'slug' => $slug,
                    'user_id' => $id,
                    'status' => $request->status,
                    'image_path' => $name,
                ]);
        
                return response()->json([
                    'message' => 'Post created successfully',
                    'post' => $data,
                ], 201);
            } else {
                return response()->json([
                    "Error"=>"The image file is not found"
                ]);
            }
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

}



public function show($id)
{
    try {

        $posts = Posts::find($id);


        if (!$posts) {
            return response()->json(['error' => 'Post not found'], 404);
        }
        return response()->json(['posts' => $posts]);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function update(Request $request, $id)
{
    try{
        $user = Auth::user();
        if(!$user){
            return response()->json([
                "Message"=>"Unauthrized Credential"
                
            ]);
        }else{
            $user_id = $user->id;
        }

        $request->validate([
            'title' => 'string',
            'content' => 'string',
            'slug' => 'string',
            'status' => 'in:publish,draft',
        ]);
        // dd($request);

        
        $posts = Posts::find($id);
        // dd($posts);

        if (!$posts) {
            return response()->json([
                'error' => 'Posts not found'
            ], 404);
        }
        
        
        if ($request->hasFile('image_path')) {
            $file = $request->file('image_path');
            $name = time() . ".Hy." . $file->getClientOriginalName();
            $name = preg_replace('/\s+/', '-', $name);
            $file->storeAs('public/images', $name);
            $posts->image_path = $name;
        }
            if ($request->filled('title')){
                $posts->title = $request->title;
            }
            if ($request->filled('slug')){
                $posts->slug = $request->slug;
            }
            if ($request->filled('content')){
                $posts->content = $request->content;
            }
            if ($request->filled('status')){
                $posts->status = $request->status;
            }

            $posts->save();

            return response()->json(
                [
                    'posts' => $posts,
                    'message' => "Posts Updatae SuccessFully"
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
        
        $user = Auth::user();
        if(!$user){
            return response()->json([
                "Message"=>"Unauthrized Credential"
                
            ]);
        }else{
            $user_id = $user->id;
        }
        $posts = Posts::find($id);
        
        if (!$posts) {
            return response()->json(['error' => 'Posts not found'], 404);
        }
        
    $posts->delete();

    return response()->json(['message' => 'Posts deleted successfully']);
    }catch(Exception $e){
        return response()->json([
            'error'=>$e->getMessage()
        ]);
    }
}


public function search($title)
{
    try{
        $results = Posts::where('title', 'LIKE', "%".$title."%")->get();
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


public function comments($id){
    $post = Posts::find($id);
    $comments = $post->comments;

    foreach ($comments as &$comment) {
        $comment['user'] = $comment->user; // Instead of setting $comment['user'] to $post->user, use $comment->user
    }

    return response()->json([
        "Posts" => [
            "id" => $post->id,
            "title" => $post->title,
            "content" => $post->content,
            "comments" => $comments, 
        ],
    ]);
}



}
