
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/i18n.ts' // Import i18n configuration

createRoot(document.getElementById("root")!).render(<App />);
