// src/shared/storage/useUserSession.ts
import { useCallback, useEffect, useState } from 'react';
import {
    userDataRepository,
    VELOA_REPO_CHANGE_EVENT,
    type UserSessionProfile,
} from './user-data-repository';

export function useUserSession() {
    const [session, setSession] = useState<UserSessionProfile>(() =>
        userDataRepository.getSession(),
    );

    useEffect(() => {
        const sync = () => setSession(userDataRepository.getSession());
        window.addEventListener('storage', sync);
        window.addEventListener(VELOA_REPO_CHANGE_EVENT, sync);
        return () => {
            window.removeEventListener('storage', sync);
            window.removeEventListener(VELOA_REPO_CHANGE_EVENT, sync);
        };
    }, []);

    const signIn = useCallback((displayName: string, email?: string) => {
        const next = userDataRepository.signInLocalProfile({ displayName, email });
        setSession(next);
    }, []);

    const signOut = useCallback(() => {
        const next = userDataRepository.signOutToGuest();
        setSession(next);
    }, []);

    return {
        session,
        isAuthenticated: session.mode === 'authenticated',
        signIn,
        signOut,
    };
}