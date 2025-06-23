import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        Email: '',
        Password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

            {status && <div>{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="Email">Email</label>
                    <input
                        id="Email"
                        type="email"
                        name="Email"
                        value={data.Email}
                        onChange={(e) => setData('Email', e.target.value)}
                        autoComplete="username"
                        autoFocus
                    />
                    {errors.Email && <div>{errors.Email}</div>}
                </div>

                <div>
                    <label htmlFor="Password">Password</label>
                    <input
                        id="Password"
                        type="password"
                        name="Password"
                        value={data.Password}
                        onChange={(e) => setData('Password', e.target.value)}
                        autoComplete="current-password"
                    />
                    {errors.Password && <div>{errors.Password}</div>}
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        Remember me
                    </label>
                </div>

                <div>
                    {canResetPassword && (
                        <Link href={route('password.request')}>
                            Forgot your password?
                        </Link>
                    )}

                    <button type="submit" disabled={processing}>
                        Log in
                    </button>
                </div>
            </form>
        </>
    );
}
