export function RoadmapSpineConnector() {
    return (
        <div
            aria-hidden="true"
            className="flex flex-col items-center justify-center py-2 select-none"
        >
            <div className="h-3 w-3 rounded-full bg-white/90 border border-white shadow-sm" />
            <div className="h-10 w-0.5 bg-linear-to-b from-white/90 via-white/50 to-white/90" />
            <div className="h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-white/90 -mt-1.5" />
        </div>
    );
}