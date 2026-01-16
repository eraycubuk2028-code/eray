import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useTranslation } from '../hooks/useTranslation';

const LoginModal = ({ onClose, onLogin }) => {
    const { t } = useTranslation();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // Date of Birth state
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [showAvatars, setShowAvatars] = useState(false);

    const [error, setError] = useState('');

    const handleGoogleClick = () => {
        // Mock Google Login Flow
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
            'https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin',
            'Google Login',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        // In a real app, we would listen for a postMessage from the popup
        const timer = setInterval(() => {
            if (popup.closed) {
                clearInterval(timer);
                // Simulate success after popup close
                alert("Google Authentication Successful! (Mock)");
                onLogin({
                    name: "Google User",
                    email: "user@gmail.com",
                    avatar: "https://lh3.googleusercontent.com/a/default-user"
                });
                onClose();
            }
        }, 500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Generic Email Validation
        const lowerEmail = email.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(lowerEmail)) {
            setError(t('auth.errors.invalidEmail'));
            return;
        }

        if (isSignUp) {
            if (firstName.length < 3) {
                setError(t('auth.errors.nameLength'));
                return;
            }
            if (lastName.length < 3) {
                setError(t('auth.errors.surnameLength'));
                return;
            }
            if (!day || !month || !year) {
                setError(t('auth.errors.dob'));
                return;
            }

            const result = authService.register({
                email,
                password,
                name: `${firstName} ${lastName}`,
                dob: `${day}/${month}/${year}`,
                avatar: selectedAvatar || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=E50914&color=fff&size=128`
            });

            if (result.success) {
                onLogin(result.user);
                onClose();
            } else {
                setError(t('auth.errors.emailExists')); // Translating backend-like error dynamically usually requires mapping, but here simple
            }

        } else {
            // Sign In Logic
            const result = authService.login(email, password);

            if (result.success) {
                onLogin(result.user);
                onClose();
            } else {
                setError(t('auth.errors.invalidCreds'));
            }
        }
    };

    // Generate arrays for dropdowns
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]; // Can be translated too, but simple strings are fine for this level.
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 style={styles.title}>{isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {isSignUp && (
                        <>
                            <div style={styles.row}>
                                <input
                                    type="text"
                                    placeholder={t('auth.name')}
                                    style={styles.input}
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder={t('auth.surname')}
                                    style={styles.input}
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={styles.dobContainer}>
                                <label style={styles.label}>{t('auth.dob')}</label>
                                <div style={styles.dobSelects}>
                                    <select style={styles.select} value={day} onChange={e => setDay(e.target.value)} required>
                                        <option value="">{t('auth.day')}</option>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select style={styles.select} value={month} onChange={e => setMonth(e.target.value)} required>
                                        <option value="">{t('auth.month')}</option>
                                        {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                    </select>
                                    <select style={styles.select} value={year} onChange={e => setYear(e.target.value)} required>
                                        <option value="">{t('auth.year')}</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={styles.avatarSection}>
                                <div
                                    style={styles.avatarToggle}
                                    onClick={() => setShowAvatars(!showAvatars)}
                                >
                                    <span>{t('settings.profilePicture')}</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{showAvatars ? '−' : '+'}</span>
                                </div>

                                {showAvatars && (
                                    <div style={styles.avatarGrid}>
                                        {['E50914', '2196F3', '4CAF50', 'FFC107', '9C27B0', 'FF5722'].map(color => {
                                            const url = `https://ui-avatars.com/api/?name=${firstName || 'U'}+${lastName || 'P'}&background=${color}&color=fff&size=128`;
                                            return (
                                                <div
                                                    key={color}
                                                    style={{
                                                        ...styles.avatarOption,
                                                        backgroundImage: `url(${url})`,
                                                        backgroundSize: 'cover',
                                                        border: selectedAvatar === url ? '2px solid var(--primary)' : '2px solid transparent'
                                                    }}
                                                    onClick={() => setSelectedAvatar(url)}
                                                />
                                            );
                                        })}
                                        {['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot'].map((url, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    ...styles.avatarOption,
                                                    backgroundImage: `url(${url})`,
                                                    backgroundColor: '#333',
                                                    backgroundSize: 'cover',
                                                    border: selectedAvatar === url ? '2px solid var(--primary)' : '2px solid transparent'
                                                }}
                                                onClick={() => setSelectedAvatar(url)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <input
                        type="email"
                        placeholder={t('auth.email')}
                        style={styles.input}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder={t('auth.password')}
                        style={styles.input}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" style={styles.submitButton}>
                        {isSignUp ? t('auth.submitSignUp') : t('auth.submitSignIn')}
                    </button>

                    <div style={styles.orDivider}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={styles.orText}>{t('auth.or')}</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    <button type="button" style={styles.googleButton} onClick={handleGoogleClick}>
                        <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24.81-.6z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        {t('auth.google')}
                    </button>

                </form>

                <div style={styles.toggleText}>
                    {isSignUp ? t('auth.alreadyMember') : t('auth.newToKUDRETLİERAYBEY')}{' '}
                    <span style={styles.toggleLink} onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                        {isSignUp ? t('auth.signInNow') : t('auth.signUpNow')}
                    </span>
                </div>
            </div>
        </div >
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: 'var(--surface)',
        padding: '40px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '450px', // Wider for row inputs
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        textAlign: 'center',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    closeButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        color: 'var(--text-secondary)',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '5px',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '10px',
        color: 'var(--text-primary)',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        marginBottom: '20px',
        fontSize: '0.9rem',
    },
    error: {
        color: '#ff4d4d',
        marginTop: '10px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    row: {
        display: 'flex',
        gap: '10px',
    },
    inputGroup: {
        flex: 1,
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '6px',
        border: '1px solid #333',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    avatarSection: {
        textAlign: 'left',
        marginTop: '10px',
    },
    avatarToggle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '12px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        border: '1px solid #333',
        color: '#aaa',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
    },
    avatarGrid: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginTop: '15px',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease'
    },
    avatarOption: {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        cursor: 'pointer',
        backgroundSize: 'cover',
        transition: 'transform 0.2s, border-color 0.2s',
        '&:hover': {
            transform: 'scale(1.1)',
        }
    },
    label: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginLeft: '2px',
        display: 'block',
    },
    dobContainer: {
        textAlign: 'left',
    },
    dobSelects: {
        display: 'flex',
        gap: '10px',
        marginTop: '8px',
    },
    select: {
        flex: 1,
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #333',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        outline: 'none',
        cursor: 'pointer',
    },
    dateLabel: {
        textAlign: 'left',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        marginBottom: '-10px',
        marginLeft: '2px',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        backgroundColor: 'var(--primary)',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: '600',
        marginTop: '5px',
        cursor: 'pointer',
    },
    googleButton: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        backgroundColor: '#fff',
        color: '#000',
        fontSize: '1rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    orDivider: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
        width: '100%',
    },
    orText: {
        padding: '0 10px',
        color: '#666',
        fontSize: '0.8rem',
    },
    footer: {
        marginTop: '20px',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
    },
    toggleText: {
        marginTop: '20px',
        fontSize: '0.9rem',
        color: '#aaa',
    },
    toggleLink: {
        color: 'var(--primary)',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginLeft: '5px',
        textDecoration: 'underline',
    }
};

export default LoginModal;
