// src/app/App.tsx
import { useEffect, useMemo, useState } from 'react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { getManifestItemById } from '@/features/lesson-engine/services/module-loader';
import { useLessonProgress } from '@/features/lesson-engine/hooks/useLessonProgress';
import { useMasteryEngine } from '@/features/practice-engine/hooks/useMasteryEngine';
import { LessonPlayerPage } from '@/features/lesson-engine/components/LessonPlayerPage';
import { HomeDashboardView } from '@/features/roadmap-graph/components/HomeDashboardView';
import { LearningHubView } from '@/features/roadmap-graph/components/LearningHubView';
import { GlobalQuickSearchModal } from '@/features/roadmap-graph/components/GlobalQuickSearchModal';
import { PracticeCenterView } from '@/features/practice-engine/components/PracticeCenterView';
import { KnowledgeLibraryView } from '@/features/practice-engine/components/KnowledgeLibraryView';
import { MyProgressView } from '@/features/practice-engine/components/MyProgressView';
import {
    AppShellLayout,
    type AppSectionId,
    type LessonHeaderContext,
} from '@/shared/ui/AppShellLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { AuthModal } from '@/features/auth/AuthModal';
import { ProfileSettingsView } from '@/features/auth/ProfileSettingsView';
import { StatusErrorPage } from '@/shared/ui/ErrorPages';
import { SuperadminConsoleView } from '@/features/admin/SuperadminConsoleView';
import { syncCloudCurriculumOverrides } from '@/features/lesson-engine/services/module-loader';
import { ContentStudioView } from '@/features/studio/ContentStudioView';

const VALID_LANGS: LanguageCode[] = ['en', 'zh', 'ja', 'ar', 'ko'];
const VALID_SECTIONS: AppSectionId[] = [
    'HOME',
    'LEARNING',
    'PRACTICE',
    'LIBRARY',
    'PROGRESS',
    'SETTINGS',
    'STUDIO',
    'ADMIN',
];

function parseInitialRoute(): {
    lang: LanguageCode;
    section: AppSectionId;
    moduleId: string | null;
    isNotFound: boolean;
} {
    if (typeof window === 'undefined') {
        return { lang: 'en', section: 'HOME', moduleId: null, isNotFound: false };
    }

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const rawModule = params.get('module');
    if (rawModule) {
        const found = getManifestItemById(rawModule);
        if (found) {
            return { lang: found.lang, section: 'LEARNING', moduleId: found.id, isNotFound: false };
        }
        return { lang: 'en', section: 'HOME', moduleId: null, isNotFound: true };
    }

    const rawLang = params.get('lang') as LanguageCode | null;
    const lang: LanguageCode = rawLang && VALID_LANGS.includes(rawLang) ? rawLang : 'en';

    const rawSection = params.get('tab')?.toUpperCase() as AppSectionId | undefined;
    if (!rawSection) {
        return { lang, section: 'HOME', moduleId: null, isNotFound: false };
    }
    if (VALID_SECTIONS.includes(rawSection)) {
        return { lang, section: rawSection, moduleId: null, isNotFound: false };
    }

    return { lang, section: 'HOME', moduleId: null, isNotFound: true };
}

export function App() {
    const initial = parseInitialRoute();
    const [selectedLang, setSelectedLang] = useState<LanguageCode>(initial.lang);
    const [activeSection, setActiveSection] = useState<AppSectionId>(initial.section);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(initial.moduleId);
    const [isNotFound, setIsNotFound] = useState<boolean>(initial.isNotFound);
    const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);
    const [lessonHeaderContext, setLessonHeaderContext] = useState<LessonHeaderContext | null>(
        null,
    );
    const [authModal, setAuthModal] = useState<{
        isOpen: boolean;
        mode: 'LOGIN' | 'REGISTER';
    }>({ isOpen: false, mode: 'LOGIN' });

    // Default tema selalu Light Mode (false) agar fokus & editorial
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const { bookmarkedEntryIds } = useLessonProgress();
    const { srsRecords } = useMasteryEngine();

    const dueSrsForActiveLang = useMemo(() => {
        const now = Date.now();
        return Object.values(srsRecords).filter(
            (rec) => rec.lang === selectedLang && rec.nextReviewAt <= now,
        ).length;
    }, [srsRecords, selectedLang]);

    const [, setCloudSyncTick] = useState<number>(0);

    useEffect(() => {
        void (async () => {
            await syncCloudCurriculumOverrides();
            setCloudSyncTick((t) => t + 1);
        })();
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (isNotFound) return;
        const params = new URLSearchParams();
        params.set('lang', selectedLang);
        if (activeModuleId) {
            params.set('module', activeModuleId);
        } else if (activeSection !== 'HOME') {
            params.set('tab', activeSection);
        }
        window.history.replaceState(null, '', `#${params.toString()}`);
    }, [selectedLang, activeSection, activeModuleId, isNotFound]);

    // Dengarkan perubahan hash manual oleh pengguna di address bar
    useEffect(() => {
        const handleHashChange = () => {
            const parsed = parseInitialRoute();
            setSelectedLang(parsed.lang);
            setActiveSection(parsed.section);
            setActiveModuleId(parsed.moduleId);
            setIsNotFound(parsed.isNotFound);
            if (!parsed.moduleId) {
                setLessonHeaderContext(null);
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Pintasan keyboard global Ctrl+K / Cmd+K
    useEffect(() => {
        const handleGlobalShortcut = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsQuickSearchOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleGlobalShortcut);
        return () => window.removeEventListener('keydown', handleGlobalShortcut);
    }, []);

    const handleChangeSection = (section: AppSectionId) => {
        setIsNotFound(false);
        setActiveModuleId(null);
        setLessonHeaderContext(null);
        setActiveSection(section);
    };

    const handleOpenModule = (moduleId: string) => {
        const meta = getManifestItemById(moduleId);
        if (meta) {
            setSelectedLang(meta.lang);
        }
        setIsNotFound(false);
        setActiveModuleId(moduleId);
    };

    const handleExitModule = () => {
        setActiveModuleId(null);
        setLessonHeaderContext(null);
    };

    const handleOpenAuthModal = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
        setAuthModal({ isOpen: true, mode });
    };

    return (
        <>
            <AppShellLayout
                activeSection={activeSection}
                onChangeSection={handleChangeSection}
                selectedLang={selectedLang}
                onChangeLang={setSelectedLang}
                onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode((d) => !d)}
                dueSrsCount={dueSrsForActiveLang}
                bookmarkCount={bookmarkedEntryIds.length}
                onOpenAuthModal={handleOpenAuthModal}
                lessonContext={activeModuleId ? lessonHeaderContext : null}
            >
                {activeModuleId ? (
                    <LessonPlayerPage
                        moduleId={activeModuleId}
                        onBackToHub={handleExitModule}
                        onSelectModule={handleOpenModule}
                        onHeaderContextChange={setLessonHeaderContext}
                    />
                ) : isNotFound ? (
                    <StatusErrorPage
                        code="404"
                        title="Halaman atau Modul Tidak Ditemukan"
                        description="Tautan yang Anda buka tidak tersedia di kurikulum Veloa."
                        onGoHome={() => handleChangeSection('HOME')}
                    />
                ) : (
                    <>
                        {activeSection === 'HOME' && (
                            <HomeDashboardView
                                selectedLang={selectedLang}
                                onOpenModule={handleOpenModule}
                                onNavigateSection={handleChangeSection}
                            />
                        )}

                        {activeSection === 'LEARNING' && (
                            <LearningHubView
                                selectedLang={selectedLang}
                                onOpenModule={handleOpenModule}
                            />
                        )}

                        {activeSection === 'PRACTICE' && (
                            <PracticeCenterView selectedLang={selectedLang} />
                        )}

                        {activeSection === 'LIBRARY' && (
                            <KnowledgeLibraryView
                                selectedLang={selectedLang}
                                onOpenModule={handleOpenModule}
                            />
                        )}

                        {activeSection === 'PROGRESS' && (
                            <MyProgressView
                                selectedLang={selectedLang}
                                onSelectLanguage={setSelectedLang}
                            />
                        )}

                        {activeSection === 'SETTINGS' && (
                            <ProtectedRoute
                                allowedRoles={['member', 'curator', 'superadmin']}
                                onGoHome={() => handleChangeSection('HOME')}
                                onOpenAuth={() => handleOpenAuthModal('LOGIN')}
                            >
                                <ProfileSettingsView
                                    onSelectLang={setSelectedLang}
                                    onLoggedOut={() => handleChangeSection('HOME')}
                                />
                            </ProtectedRoute>
                        )}

                        {activeSection === 'STUDIO' && (
                            <ProtectedRoute
                                allowedRoles={['curator', 'superadmin']}
                                onGoHome={() => handleChangeSection('HOME')}
                                onOpenAuth={() => handleOpenAuthModal('LOGIN')}
                            >
                                <ContentStudioView onPreviewModule={handleOpenModule} />
                            </ProtectedRoute>
                        )}

                        {activeSection === 'ADMIN' && (
                            <ProtectedRoute
                                allowedRoles={['superadmin']}
                                onGoHome={() => handleChangeSection('HOME')}
                                onOpenAuth={() => handleOpenAuthModal('LOGIN')}
                            >
                                <SuperadminConsoleView
                                    onOpenStudio={() => handleChangeSection('STUDIO')}
                                />
                            </ProtectedRoute>
                        )}
                    </>
                )}
            </AppShellLayout>

            <GlobalQuickSearchModal
                isOpen={isQuickSearchOpen}
                onClose={() => setIsQuickSearchOpen(false)}
                onSelectModule={handleOpenModule}
            />

            <AuthModal
                isOpen={authModal.isOpen}
                initialMode={authModal.mode}
                onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}

export default App;