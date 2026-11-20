// src/shared/storage/user-data-repository.ts

export interface StorageAdapter {
    readonly id: string;
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

export interface UserSessionProfile {
    mode: 'guest' | 'authenticated';
    userId: string;
    displayName: string;
    email: string | null;
    provider: 'local' | 'cloud-ready';
    lastSyncedAt: string | null;
}

const SESSION_STORAGE_KEY = 'veloa.user.session.v1';

const DEFAULT_GUEST_SESSION: UserSessionProfile = {
    mode: 'guest',
    userId: 'guest-local',
    displayName: 'Pelajar Tamu (Lokal)',
    email: null,
    provider: 'local',
    lastSyncedAt: null,
};

/**
 * Adapter penyimpanan default berbasis browser localStorage.
 * Dapat diganti atau diperluas dengan adapter cloud (Supabase / Firebase) tanpa mengubah UI.
 */
export const LocalBrowserStorageAdapter: StorageAdapter = {
    id: 'local-browser',
    getItem(key: string): string | null {
        if (typeof window === 'undefined') return null;
        try {
            return window.localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem(key: string, value: string): void {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, value);
        } catch {
            // Abaikan jika kuota penyimpanan penuh
        }
    },
    removeItem(key: string): void {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.removeItem(key);
        } catch {
            // Abaikan
        }
    },
};

export const VELOA_REPO_CHANGE_EVENT = 'veloa:repository-changed';

export class UserDataRepository {
    private adapter: StorageAdapter;

    constructor(adapter: StorageAdapter = LocalBrowserStorageAdapter) {
        this.adapter = adapter;
    }

    public setAdapter(nextAdapter: StorageAdapter): void {
        this.adapter = nextAdapter;
        this.notifyChange('*');
    }

    public getAdapterId(): string {
        return this.adapter.id;
    }

    public readJson<T>(key: string, fallback: T): T {
        const raw = this.adapter.getItem(key);
        if (!raw) return fallback;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return fallback;
        }
    }

    public writeJson<T>(key: string, value: T): void {
        this.adapter.setItem(key, JSON.stringify(value));
        this.notifyChange(key);
    }

    public getSession(): UserSessionProfile {
        const stored = this.readJson<Partial<UserSessionProfile> | null>(SESSION_STORAGE_KEY, null);
        if (!stored || typeof stored.displayName !== 'string') {
            return DEFAULT_GUEST_SESSION;
        }
        return {
            mode: stored.mode === 'authenticated' ? 'authenticated' : 'guest',
            userId: typeof stored.userId === 'string' ? stored.userId : 'guest-local',
            displayName: stored.displayName,
            email: typeof stored.email === 'string' ? stored.email : null,
            provider: stored.provider === 'cloud-ready' ? 'cloud-ready' : 'local',
            lastSyncedAt: typeof stored.lastSyncedAt === 'string' ? stored.lastSyncedAt : null,
        };
    }

    public signInLocalProfile(params: { displayName: string; email?: string }): UserSessionProfile {
        const cleanName = params.displayName.trim() || 'Pelajar Veloa';
        const cleanEmail = params.email?.trim() || null;
        const session: UserSessionProfile = {
            mode: 'authenticated',
            userId: `veloa-user-${Date.now().toString(36)}`,
            displayName: cleanName,
            email: cleanEmail,
            provider: 'cloud-ready',
            lastSyncedAt: new Date().toISOString(),
        };
        this.writeJson(SESSION_STORAGE_KEY, session);
        return session;
    }

    public signOutToGuest(): UserSessionProfile {
        this.writeJson(SESSION_STORAGE_KEY, DEFAULT_GUEST_SESSION);
        return DEFAULT_GUEST_SESSION;
    }

    private notifyChange(key: string): void {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent(VELOA_REPO_CHANGE_EVENT, { detail: { key } }));
    }
}

export const userDataRepository = new UserDataRepository(LocalBrowserStorageAdapter);