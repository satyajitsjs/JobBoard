<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class CommentController extends Controller
{

    public function index(){
        try{
            $comment = Comments::with('user')->get();
    
            return response()->json(['comments' => $comment]);
            }catch(Exception $e){
                return response()->json([
                    'error'=> $e->getMessage()
                ]);
            }
    }


    public function store(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized Credential"
        ], 401); 
    }

    $request->validate([
        'post_id' => 'required|exists:posts,id',
        'content' => 'required|string',
        'parent_id' => 'nullable|exists:comments,id',
    ]);

    try {
        $data = [
            'post_id' => $request->post_id,
            'user_id' => $user->id,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
        ];

        $comment = Comments::create($data);

        $user = $comment->user;

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    // Add other user properties as needed
                ],
            ],
        ], 201);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


public function show($id)
{
    try {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                "message" => "Unauthorized Credential"
            ], 401); 
        }

        $comment = Comments::with('user')->find($id);

        if (!$comment) {
            return response()->json([
                "message" => "Comment not found"
            ], 404);
        }

        return response()->json([
            'comment' => $comment,
        ]);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 404);
    }
}


    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "message" => "Unauthorized Credential"
            ]);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        try {
            $comment = Comments::findOrFail($id);

            if ($comment->user_id !== $user->id) {
                return response()->json([
                    "message" => "You are not authorized to update this comment"
                ], 403);
            }

            $comment->content = $request->content;
            $comment->save();

            return response()->json([
                'message' => 'Comment updated successfully',
                'comment' => $comment,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    // Delete a comment
    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "message" => "Unauthorized Credential"
            ]);
        }

        try {
            $comment = Comments::findOrFail($id);

            if ($comment->user_id !== $user->id) {
                return response()->json([
                    "message" => "You are not authorized to delete this comment"
                ], 403);
            }

            $comment->delete();

            return response()->json([
                'message' => 'Comment deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
}