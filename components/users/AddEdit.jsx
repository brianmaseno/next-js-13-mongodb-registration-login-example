import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService, alertService } from 'services';

export { AddEdit };

function AddEdit(props) {
    const user = props?.user;
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            // password optional in edit mode
            .concat(user ? null : Yup.string().required('Password is required'))
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (user) {
        formOptions.defaultValues = props.user;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(data) {
        alertService.clear();
        try {
            // create or update user based on user prop
            let message;
            if (user) {
                await userService.update(user.id, data);
                message = 'User updated';
            } else {
                await userService.register(data);
                message = 'User added';
            }

            // redirect to user list with success message
            router.push('/users');
            alertService.success(message, true);
        } catch (error) {
            alertService.error(error);
            console.error(error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{user ? 'Edit User' : 'Add User'}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        {...register('firstName')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        {...register('lastName')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        {...register('username')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
                    />
                    {errors.username && <p className="text-red-500 text-xs italic">{errors.username.message}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                        {user && <span className="text-sm font-normal ml-1">(Leave blank to keep the same password)</span>}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        {...register('password')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={formState.isSubmitting}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    <button
                        onClick={() => reset(formOptions.defaultValues)}
                        type="button"
                        disabled={formState.isSubmitting}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Reset
                    </button>
                    <Link href="/users" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}