<?php

return [

 

    // Paths that will accept CORS requests
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login'],

    // Allowed HTTP methods
    'allowed_methods' => ['*'],

    // Allowed origins (React dev server & localhost variations)
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    // Allowed origin patterns (useful for dynamic subdomains)
    'allowed_origins_patterns' => [],

    // Allowed request headers
    'allowed_headers' => ['*'],

    // Headers exposed to the browser
    'exposed_headers' => [],

    // CORS preflight cache duration (in seconds)
    'max_age' => 0,

    // If you need to send cookies or Authorization headers in requests, keep this true
    'supports_credentials' => true,

];
