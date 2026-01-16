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
                    <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <p style={{ color: '#ddd', marginBottom: '15px', fontSize: '0.9rem' }}>
                            {t('settings.passwordResetDescription') || "Güvenliğiniz için şifre değiştirme işlemleri e-posta doğrulama bağlantısı üzerinden yapılmaktadır."}
                        </p>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={async () => {
                                    const result = await authService.changePassword(user.email);
                                    alert(result.message);
                                    if (result.success) setShowPasswordForm(false);
                                }}
                                style={styles.button}
                            >
                                {t('settings.sendResetLink') || "Sıfırlama Bağlantısı Gönder"}
                            </button>
                            <button
                                onClick={() => setShowPasswordForm(false)}
                                style={{ ...styles.button, background: 'transparent', border: '1px solid #555' }}
                            >
                                {t('common.cancel') || "İptal"}
                            </button>
                        </div>
                    </div>
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
