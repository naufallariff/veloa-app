// src/app/App.tsx
import { useEffect, useState } from 'react';
import type { LanguageCode } from '@/features/lesson-engine/schema/lesson.schema';
import { getManifestItemById } from '@/features/lesson-engine/services/module-loader';
import { CurriculumHubPage } from '@/features/roadmap-graph/components/CurriculumHubPage';
import { GlobalQuickSearchModal } from '@/features/roadmap-graph/components/GlobalQuickSearchModal';
import { LessonPlayerPage } from '@/features/lesson-engine/components/LessonPlayerPage';

const VALID_LANGS: LanguageCode[] = ['en', 'zh', 'ja', 'ar', 'ko'];

function parseInitialRoute(): { lang: LanguageCode; moduleId: string | null } {
    if (typeof window === 'undefined') {
        return { lang: 'en', moduleId: null };
    }

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const rawModule = params.get('module');
    if (rawModule) {
        const found = getManifestItemById(rawModule);
        if (found) {
            return { lang: found.lang, moduleId: found.id };
        }
    }

    const rawLang = params.get('lang') as LanguageCode | null;
    if (rawLang && VALID_LANGS.includes(rawLang)) {
        return { lang: rawLang, moduleId: null };
    }

    return { lang: 'en', moduleId: null };
}

export function App() {
    const initial = parseInitialRoute();
    const [selectedLang, setSelectedLang] = useState<LanguageCode>(initial.lang);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(initial.moduleId);
    const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

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
        }
        window.history.replaceState(null, '', `#${params.toString()}`);
    }, [selectedLang, activeModuleId]);

    // Global keyboard shortcut: Ctrl+K / Cmd+K
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
                <CurriculumHubPage
                    selectedLang={selectedLang}
                    onChangeLang={setSelectedLang}
                    onOpenModule={handleOpenModule}
                    onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={() => setIsDarkMode((d) => !d)}
                />
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