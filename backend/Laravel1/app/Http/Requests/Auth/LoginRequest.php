<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'Email' => ['required', 'string', 'email'],
            'Password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
{
    $this->ensureIsNotRateLimited();

    $credentials = [
        'Email' => $this->Email,        // 'Email' exactly matches your Users table column
        'password' => $this->Password,  // keep password key lowercase
    ];

    if (! \Auth::attempt($credentials, $this->boolean('remember'))) {
        \RateLimiter::hit($this->throttleKey());

        \Log::warning('[LOGIN_FAILURE] Auth::attempt failed for Email: '.$this->Email);

        throw \Illuminate\Validation\ValidationException::withMessages([
            'Email' => trans('auth.failed'),
        ]);
    }

    \RateLimiter::clear($this->throttleKey());

    \Log::info('[LOGIN_SUCCESS] Auth::attempt succeeded for Email: '.$this->Email);
}






    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'Email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('Email')).'|'.$this->ip());
    }
}
