<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Http;

class ApiClientMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // $accessToken = $request->bearerToken();

        // $response = Http::withHeaders([
        //     'Accept' => 'application/json',
        //     'Authorization' => 'Bearer ' . $accessToken,
        // ])->send(
        //     $request->method(),
        //     $request->url(),
        //     $request->all()
        // );

        // if ($response->status() === 401) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }

        return $next($request);
    }
}
