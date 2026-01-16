import { useState, useEffect } from 'react';
import { getTranslation } from '../utils/translations';

export const useTranslation = () => {
    const [language, setLanguage] = useState('EN');

    useEffect(() => {
        // 1. Check LocalStorage
        const savedLang = localStorage.getItem('cinemax_language');
        if (savedLang) {
            setLanguage(savedLang);
            return;
        }

        // 2. Check Device Language (Auto-detect)
        const browserLang = navigator.language.split('-')[0].toUpperCase();
        const supportedLangs = ['TR', 'EN', 'FR', 'ES', 'AZ', 'RU', 'DE', 'JA', 'IT'];

        if (supportedLangs.includes(browserLang)) {
            setLanguage(browserLang);
            localStorage.setItem('cinemax_language', browserLang); // Save auto-detected pref
        } else {
            setLanguage('EN'); // Default Fallback
            localStorage.setItem('cinemax_language', 'EN');
        }
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('cinemax_language', lang);
        window.location.reload(); // Reload to ensure strict application across all components
    };

    const t = (key) => getTranslation(language, key);

    return { t, language, changeLanguage };
};
