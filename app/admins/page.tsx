"use client";

import { useEffect, useState } from 'react';
import { getUserFromToken } from '../actions';
import { Role } from '@prisma/client'; // Assuming Role is from Prisma

interface User {
    id: string;
    name: string | null;
    email: string;
    role: Role;
}

export default function UserInfo() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const userData = await getUserFromToken();
            console.log('User data in component:', userData);
            setUser(userData);
        }
        fetchUser();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>User Information</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
        </div>
    );
}