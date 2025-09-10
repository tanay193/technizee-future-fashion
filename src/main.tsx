import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

    // 🚨 TEMP debug - remove after verification
    ; (window as any).__VITE_API_URL = (import.meta as any).env?.VITE_API_URL ?? "";
console.log("___VITE_API_URL (runtime)", (import.meta as any).env?.VITE_API_URL);

createRoot(document.getElementById("root")!).render(<App />);
