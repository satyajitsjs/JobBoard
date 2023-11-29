<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;


class UserCotroller extends Controller
{
    public function register(Request $request)
    {

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:recruter,jobseeker,admin',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => $request->role
            ]);
            $token = $user->createToken('Token')->accessToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
                'message' => 'User created Successfully'
            ], 200,);
        } catch (Exception $e) {
            return response()->json([
                'status' => 401,
                'message' => $e->getMessage()
            ], 401);
        }
    }


    public function userPosts()
    {
        $user = auth()->user();
        // dd($user);
        $posts = $user->post; // Assuming you have set up the relationship between users and posts in the models.

        return response()->json($posts);
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required',
                'password' => 'required'
            ]);

            $data = [
                'email' => $request->email,
                'password' => $request->password
            ];

            if (auth()->attempt($data)) {


                $user = auth()->user();
                $userId = $user->id;
                $userName = $user->name;
                $userEmail = $user->email;
                $userRole = $user->role;

                $token = $user->createToken('Token')->accessToken;

                return response()->json([
                    'token' => $token,
                    'user_id' => $userId,
                    'user_email' => $userEmail,
                    'user_Name' => $userName,
                    'user_role' => $userRole,
                    'message' => 'Login Successfully'
                ], 200);
            } else {
                return response()->json([
                    'error' => 'Unauthorized Credentials'
                ], 401);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 401);
        }
    }




    public function logout(Request $request)
    {
        try {
            auth()->user()->token()->delete();
            return response()->json([
                "message" => "Logout Successfully"
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }



    public function update(Request $request, $id)
    {
        try {

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|',
                'password' => 'required|string|min:8',
            ]);

            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'User NOt found'], 404);
            }

            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = $request->password;
            $user->save();

            return response()->json(
                [
                    'category' => $user,
                    'message' => "User Update Successfully"
                ]
            );
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function forgotPassword(Request $request)
    {
        $input = $request->only('email');
        $validator = Validator::make($input, [
            'email' => "required|email"
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors());
        }
        $response = Password::sendResetLink($input);

        $message = $response == Password::RESET_LINK_SENT ? 'Mail send successfully' : GLOBAL_SOMETHING_WANTS_TO_WRONG;

        return response()->json($message);
    }


    public function passwordReset(Request $request)
    {
        $input = $request->only('email', 'token', 'password', 'password_confirmation');
        $validator = Validator::make($input, [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors());
        }
        $response = Password::reset($input, function ($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        });
        $message = $response == Password::PASSWORD_RESET ? 'Password reset successfully' : GLOBAL_SOMETHING_WANTS_TO_WRONG;
        return response()->json($message);
    }
}
