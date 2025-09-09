// src/hooks/use-kiosk.tsx
import { useEffect, useState } from "react";

/**
 * useKiosk
 *
 * Safe hook for detecting kiosk mode. DOES NOT use `process`.
 * Reads:
 *  - import.meta.env.VITE_KIOSK (Vite env — set in .env as VITE_KIOSK=true)
 *  - ?kiosk=1 query param (useful for testing)
 *
 * Returns boolean `isKiosk`.
 */
export function useKiosk() {
    const [isKiosk, setIsKiosk] = useState<boolean>(() => {
        try {
            // Prefer Vite-style env (import.meta.env). Avoid `process`.
            // (import.meta is available in Vite dev & build; we guard defensively)
            const viteFlag =
                typeof import.meta !== "undefined" && !!(import.meta as any).env?.VITE_KIOSK;

            // Query param fallback so you can test with ?kiosk=1 in URL
            const urlFlag =
                typeof window !== "undefined" &&
                new URLSearchParams(window.location.search).get("kiosk") === "1";

            const initial = !!viteFlag || !!urlFlag;

            // 🔍 Debug log
            console.log("[useKiosk:init] VITE_KIOSK =", (import.meta as any).env?.VITE_KIOSK);
            console.log("[useKiosk:init] urlFlag =", urlFlag);
            console.log("[useKiosk:init] initial =", initial);

            return initial;
        } catch {
            return false;
        }
    });

    useEffect(() => {
        if (!isKiosk) return;

        // Example behavior for kiosk: try to request fullscreen once (best-effort).
        // Note: requestFullscreen must usually be triggered by user gesture; it may fail.
        const tryFullscreen = async () => {
            try {
                const el = document.documentElement;
                if (el && (el as any).requestFullscreen) {
                    await (el as any).requestFullscreen();
                }
            } catch {
                // ignore errors
            }
        };

        // Call once on mount (best-effort).
        tryFullscreen();
    }, [isKiosk]);

    return isKiosk;
}

// default export to match `import useKiosk from "@/hooks/use-kiosk"`
export default useKiosk;
