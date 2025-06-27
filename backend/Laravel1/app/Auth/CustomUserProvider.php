<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;

class CustomUserProvider extends EloquentUserProvider
{
    public function retrieveByCredentials(array $credentials)
{
    \Log::info('retrieveByCredentials called', $credentials);

    $query = $this->createModel()->newQuery();

    foreach ($credentials as $key => $value) {
        if ($key !== 'password') {
            if ($key === 'email') {
                \Log::info('Querying Email column with:', ['Email' => $value]);
                $query->where('Email', $value);
            } else {
                $query->where($key, $value);
            }
        }
    }

    $user = $query->first();

    if ($user) {
        \Log::info('User found in provider', ['id' => $user->id, 'Email' => $user->Email]);
    } else {
        \Log::warning('No user found in provider for credentials', $credentials);
    }

    return $user;
}

}
