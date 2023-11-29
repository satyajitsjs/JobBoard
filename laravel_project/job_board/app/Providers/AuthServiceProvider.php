<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;
class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy', 
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {

        // Passport::personalAccessClientSecret(config('M802xMj92yJ1xgpXNJ4z0dhzucABMGFNqfQUAicI'));
        // Passport::personalAccessClientId(config('1'));
        
        // $this->registerPolicies(); 
        // if (! $this->app->routesAreCached()){
        //     Passport::routes(); 
        // }
    }
}
