import { useState, useEffect } from 'react';
import { NavLink } from '.';
import { userService } from 'services';

export { Nav };

function Nav() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const subscription = userService.user.subscribe(x => setUser(x));
        return () => subscription.unsubscribe();
    }, []);

    if (!user) return null;

    return (
        <nav className="bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink href="/" exact className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium">Home</NavLink>
                                <NavLink href="/users" className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium">Users</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <button onClick={userService.logout} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}