import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useTranslation } from '../hooks/useTranslation';
import SettingsLayout from '../components/SettingsLayout';

const SecuritySettings = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const validatePassword = (password) => {
        if (!password || !user) return { valid: false };

        // 1. Check for Sequential Numbers (e.g., 123, 234, 321, etc.)
        const sequentialDigits = "01234567890 09876543210";
        for (let i = 0; i <= password.length - 3; i++) {
            const triplet = password.substring(i, i + 3);
            if (sequentialDigits.includes(triplet) && /^\d+$/.test(triplet)) {
                return { valid: false, error: t('settings.passwordSequential') };
            }
        }

        // 2. Check for Name/Surname (Case Insensitive)
        const lowerPass = password.toLowerCase();
        const lowerName = user.name.toLowerCase();
        const nameParts = lowerName.split(' ');

        for (const part of nameParts) {
            if (part.length > 2 && lowerPass.includes(part)) {
                return { valid: false, error: t('settings.passwordUserInfo') };
            }
        }

        return { valid: true };
    };

    return (
        <SettingsLayout>
            <div style={styles.section}>
                <div
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: 'var(--primary)'
                    }}
                >
                    <h2 style={{ ...styles.sectionTitle, borderBottom: 'none', marginBottom: 0 }}>
                        {t('settings.security')}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#aaa' }}>{t('settings.changePassword')}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                transition: 'transform 0.3s',
                                transform: showPasswordForm ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>

                {showPasswordForm && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const currentPass = e.target.current.value;
                            const newPass = e.target.new.value;
                            const confirmPass = e.target.confirm.value;

                            // Custom Validations
                            const validation = validatePassword(newPass);
                            if (!validation.valid) {
                                alert(validation.error);
                                return;
                            }

                            if (newPass !== confirmPass) {
                                alert(t('settings.passwordMismatch'));
                                return;
                            }

                            const result = authService.changePassword(user.email, currentPass, newPass);
                            if (result.success) {
                                alert(t('settings.passwordChanged'));
                                e.target.reset();
                                setShowPasswordForm(false);
                            } else {
                                alert(t('settings.passwordError'));
                            }
                        }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}
                    >
                        <input name="current" type="password" placeholder={t('settings.currentPassword')} style={styles.input} required />
                        <input name="new" type="password" placeholder={t('settings.newPassword')} style={styles.input} required />
                        <input name="confirm" type="password" placeholder={t('settings.confirmPassword')} style={styles.input} required />
                        <button type="submit" style={styles.button}>{t('settings.changePassword')}</button>
                    </form>
                )}
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>{t('settings.activity')}</h2>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', color: '#aaa' }}>
                        <div>{t('settings.date')}</div>
                        <div>{t('settings.device')}</div>
                        <div>{t('settings.location')}</div>
                    </div>
                    {user && user.history ? (
                        user.history.map((h, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>{new Date(h.date).toLocaleDateString()}</div>
                                <div>{h.device}</div>
                                <div>{h.location}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '15px' }}>
                            <div>{new Date().toLocaleDateString()}</div>
                            <div>{t('settings.currentDevice')}</div>
                            <div>{t('settings.unknownLocation')}</div>
                        </div>
                    )}
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
    input: {
        width: '100%',
        padding: '12px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '4px',
        color: '#fff',
        outline: 'none',
        fontSize: '1rem'
    },
    button: {
        padding: '12px',
        background: '#E50914',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        marginTop: '10px'
    }
};

export default SecuritySettings;
