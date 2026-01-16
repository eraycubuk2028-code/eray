import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useTranslation } from '../hooks/useTranslation';
import SettingsLayout from '../components/SettingsLayout';

const Settings = () => {
    const { t, language, changeLanguage } = useTranslation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const handleLanguageChange = (e) => {
        changeLanguage(e.target.value);
    };

    return (
        <SettingsLayout>
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>{t('settings.account')}</h2>
                {user ? (
                    <div style={styles.accountCard}>
                        <div style={{ position: 'relative', marginRight: '20px' }}>
                            <div
                                style={{
                                    ...styles.avatar,
                                    width: '80px',
                                    height: '80px',
                                    fontSize: '32px',
                                    backgroundImage: user.avatar ? `url(${user.avatar})` : `url(https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=E50914&color=fff&size=128)`,
                                    cursor: 'pointer'
                                }}
                                onClick={() => document.getElementById('avatar-selector').style.display = 'block'}
                                title={t('settings.changeAvatar')}
                            ></div>
                            <div style={{
                                position: 'absolute', bottom: 0, right: 0,
                                background: '#E50914', borderRadius: '50%', padding: '4px',
                                pointerEvents: 'none'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </div>
                        </div>

                        <div>
                            <div style={styles.accountName}>{user.name}</div>
                            <div style={styles.accountEmail}>{user.email}</div>
                            {user.dob && <div style={styles.accountDetail}>{t('auth.dob')}: {user.dob}</div>}
                        </div>
                    </div>
                ) : (
                    <p style={styles.hint}>{t('settings.noAccount')}</p>
                )}

                {/* Avatar Selector UI (Inline for simplicity) */}
                <div id="avatar-selector" style={{ display: 'none', marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>{t('settings.selectAvatar')}</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {/* Predefined Colors via UI Avatars */}
                        {['E50914', '2196F3', '4CAF50', 'FFC107', '9C27B0', 'FF5722'].map(color => (
                            <div
                                key={color}
                                style={{
                                    width: '50px', height: '50px', borderRadius: '8px', cursor: 'pointer',
                                    backgroundImage: `url(https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || 'U'}&background=${color}&color=fff&size=64)`,
                                    backgroundSize: 'cover',
                                    border: user?.avatar?.includes(color) ? '2px solid white' : '2px solid transparent'
                                }}
                                onClick={() => {
                                    const newAvatar = `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=${color}&color=fff&size=128`;
                                    const updatedUser = { ...user, avatar: newAvatar };
                                    setUser(updatedUser);
                                    authService.updateUser(updatedUser);
                                    document.getElementById('avatar-selector').style.display = 'none';
                                    // Force reload to update Navbar immediately
                                    setTimeout(() => window.location.reload(), 100);
                                }}
                            ></div>
                        ))}
                        {/* Predefined Images (using placeholders for demo) */}
                        {['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot'].map((url, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '50px', height: '50px', borderRadius: '8px', cursor: 'pointer',
                                    backgroundImage: `url(${url})`,
                                    backgroundSize: 'cover',
                                    backgroundColor: '#333',
                                    border: user?.avatar === url ? '2px solid white' : '2px solid transparent'
                                }}
                                onClick={() => {
                                    const updatedUser = { ...user, avatar: url };
                                    setUser(updatedUser);
                                    authService.updateUser(updatedUser);
                                    document.getElementById('avatar-selector').style.display = 'none';
                                    setTimeout(() => window.location.reload(), 100);
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>{t('settings.subscription')}</h2>
                <div style={{ ...styles.settingItem, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                    <div>
                        <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{t('settings.plan')}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t('settings.planName')}</div>
                        <div style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '5px' }}>{t('settings.nextBilling')}: 15/02/2026</div>
                    </div>
                    <button style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #aaa', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
                        {t('settings.manageSubscription')}
                    </button>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>{t('settings.general')}</h2>
                <div style={styles.settingItem}>
                    <div style={styles.settingLabel}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        {t('settings.language')}
                    </div>
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        style={styles.select}
                    >
                        <option value="TR">Türkçe</option>
                        <option value="EN">English</option>
                        <option value="FR">Français</option>
                        <option value="ES">Español</option>
                        <option value="AZ">Azərbaycan</option>
                        <option value="RU">Русский</option>
                        <option value="DE">Deutsch</option>
                        <option value="JA">日本語</option>
                        <option value="IT">Italiano</option>
                    </select>
                    <p style={styles.hint}>{t('settings.languageHint')}</p>
                </div>
            </div>
        </SettingsLayout>
    );
};

const styles = {
    section: {
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        marginBottom: '20px',
        color: 'var(--primary)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: '10px',
    },
    settingItem: {
        marginBottom: '15px',
    },
    settingLabel: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '1rem',
        fontWeight: '500',
    },
    select: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid var(--glass-border)',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        cursor: 'pointer',
    },
    hint: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginTop: '8px',
    },
    accountCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    avatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundSize: 'cover',
    },
    accountName: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    accountEmail: {
        color: 'var(--text-secondary)',
    },
    accountDetail: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        marginTop: '5px',
    }
};

export default Settings;
