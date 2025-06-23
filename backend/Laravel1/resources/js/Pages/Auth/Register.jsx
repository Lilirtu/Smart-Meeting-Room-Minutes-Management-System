import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        FullName: '',
        Email: '',
        Password: '',
        Password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('Password', 'Password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="FullName" value=" Full Name" />

                    <TextInput
                        id="FullName"
                        name="FullName"
                        value={data.FullName}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('FullName', e.target.value)}
                        required
                    />

                    <InputError message={errors.FullName} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="Email" value="Email" />

                    <TextInput
                        id="Email"
                        type="email"
                        name="Email"
                        value={data.Email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('Email', e.target.value)}
                        required
                    />

                    <InputError message={errors.Email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="Password" value="Password" />

                    <TextInput
                        id="Password"
                        type="password"
                        name="Password"
                        value={data.Password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('Password', e.target.value)}
                        required
                    />

                    <InputError message={errors.Password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="Password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="Password_confirmation"
                        type="password"
                        name="Password_confirmation"
                        value={data.Password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('Password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.Password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
