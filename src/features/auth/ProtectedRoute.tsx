// src/features/auth/ProtectedRoute.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth, type UserRole } from './AuthContext';
import { StatusErrorPage } from '@/shared/ui/ErrorPages';

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    onGoHome: () => void;
    onOpenAuth: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    allowedRoles,
    children,
    onGoHome,
    onOpenAuth,
}) => {
    const { role, isLoading, isGuest } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 text-(--text-secondary)">
                <Loader2 className="h-7 w-7 animate-spin text-(--accent-primary)" />
                <p className="text-xs font-semibold">Memverifikasi hak akses sesi...</p>
            </div>
        );
    }

    // Jika pengunjung masih Guest tetapi mencoba masuk halaman khusus akun terdaftar
    if (isGuest && !allowedRoles.includes('guest')) {
        return (
            <StatusErrorPage
                code="401"
                title="Autentikasi Diperlukan"
                description="Halaman ini hanya tersedia untuk pengguna yang telah masuk ke akun Veloa. Silakan masuk atau daftar gratis untuk menyimpan progres Anda."
                onGoHome={onGoHome}
                onOpenAuth={onOpenAuth}
            />
        );
    }

    // Jika sudah login tetapi role tidak mencukupi (misal Member biasa membuka Admin/Studio)
    if (!allowedRoles.includes(role)) {
        return (
            <StatusErrorPage
                code="403"
                title="Akses Ditolak (Forbidden)"
                description={`Role akun Anda saat ini (${role.toUpperCase()}) tidak memiliki izin untuk mengakses halaman terproteksi ini.`}
                onGoHome={onGoHome}
            />
        );
    }

    return <>{children}</>;
};