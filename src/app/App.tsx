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
import { AppShellLayout, type AppSectionId } from '@/shared/ui/AppShellLayout';

const VALID_LANGS: LanguageCode[] = ['en', 'zh', 'ja', 'ar', 'ko'];
const VALID_SECTIONS: AppSectionId[] = ['HOME', 'LEARNING', 'PRACTICE', 'LIBRARY', 'PROGRESS'];

function parseInitialRoute(): {
    lang: LanguageCode;
    section: AppSectionId;
    moduleId: string | null;
} {
    if (typeof window === 'undefined') {
        return { lang: 'en', section: 'HOME', moduleId: null };
    }

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const rawModule = params.get('module');
    if (rawModule) {
        const found = getManifestItemById(rawModule);
        if (found) {
            return { lang: found.lang, section: 'LEARNING', moduleId: found.id };
        }
    }

    const rawLang = params.get('lang') as LanguageCode | null;
    const lang: LanguageCode = rawLang && VALID_LANGS.includes(rawLang) ? rawLang : 'en';

    const rawSection = params.get('tab') as AppSectionId | null;
    const section: AppSectionId =
        rawSection && VALID_SECTIONS.includes(rawSection) ? rawSection : 'HOME';

    return { lang, section, moduleId: null };
}

export function App() {
    const initial = parseInitialRoute();
    const [selectedLang, setSelectedLang] = useState<LanguageCode>(initial.lang);
    const [activeSection, setActiveSection] = useState<AppSectionId>(initial.section);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(initial.moduleId);
    const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);

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

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('lang', selectedLang);
        if (activeModuleId) {
            params.set('module', activeModuleId);
        } else if (activeSection !== 'HOME') {
            params.set('tab', activeSection);
        }
        window.history.replaceState(null, '', `#${params.toString()}`);
    }, [selectedLang, activeSection, activeModuleId]);

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

    const handleOpenModule = (moduleId: string) => {
        const meta = getManifestItemById(moduleId);
        if (meta) {
            setSelectedLang(meta.lang);
        }
        setActiveModuleId(moduleId);
    };

    return (
        <>
            {activeModuleId ? (
                <LessonPlayerPage
                    moduleId={activeModuleId}
                    onBackToHub={() => setActiveModuleId(null)}
                    onSelectModule={handleOpenModule}
                    onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
                />
            ) : (
                <AppShellLayout
                    activeSection={activeSection}
                    onChangeSection={setActiveSection}
                    selectedLang={selectedLang}
                    onChangeLang={setSelectedLang}
                    onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={() => setIsDarkMode((d) => !d)}
                    dueSrsCount={dueSrsForActiveLang}
                    bookmarkCount={bookmarkedEntryIds.length}
                >
                    {activeSection === 'HOME' && (
                        <HomeDashboardView
                            selectedLang={selectedLang}
                            onOpenModule={handleOpenModule}
                            onNavigateSection={setActiveSection}
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
                </AppShellLayout>
            )}

            <GlobalQuickSearchModal
                isOpen={isQuickSearchOpen}
                onClose={() => setIsQuickSearchOpen(false)}
                onSelectModule={handleOpenModule}
            />
        </>
    );
}

export default App;