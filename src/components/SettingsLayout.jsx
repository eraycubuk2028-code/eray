import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const SettingsLayout = ({ children }) => {
    const { t } = useTranslation();

    return (
        <div style={styles.pageContainer}>
            <div style={styles.header}>
                <Link to="/" style={styles.backLink}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    {t('settings.backToHome')}
                </Link>
                <h1 style={styles.title}>{t('settings.title')}</h1>
            </div>

            <div style={styles.layout}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    <NavLink
                        to="/settings"
                        end
                        style={({ isActive }) => ({ ...styles.sidebarItem, ...(isActive ? styles.activeItem : {}) })}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        {t('settings.general')}
                    </NavLink>

                    <NavLink
                        to="/settings/security"
                        style={({ isActive }) => ({ ...styles.sidebarItem, ...(isActive ? styles.activeItem : {}) })}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        {t('settings.security')}
                    </NavLink>
                </div>

                {/* Content Area */}
                <div style={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        padding: '100px 5% 40px',
    },
    header: {
        marginBottom: '30px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '20px',
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        marginBottom: '15px',
        fontSize: '0.9rem',
        transition: 'color 0.2s',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '700',
    },
    layout: {
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
    },
    sidebar: {
        flex: '1',
        minWidth: '250px',
        maxWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    sidebarItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'var(--text-secondary)',
        fontSize: '1.1rem',
        transition: 'all 0.2s',
        border: '1px solid transparent',
    },
    activeItem: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        fontWeight: 'bold',
    },
    content: {
        flex: '3',
        minWidth: '300px',
    }
};

export default SettingsLayout;
