import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import heroBg from '../assets/moon.png';

const Hero = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <header style={styles.hero}>
            <div style={styles.background}>
                <img src={heroBg} alt="Hero Background" style={styles.image} />
                <div style={styles.gradient}></div>
            </div>
            <div style={styles.content}>
                <h1 style={styles.title}>FUTURISTIC VISION</h1>
                <p style={styles.description}>
                    In a world where technology transcends humanity, one vision changes everything.
                    Experience the cinematic journey of the decade.
                </p>
                <div style={styles.buttons}>
                    <button
                        style={{ ...styles.button, ...styles.playButton }}
                        onClick={() => navigate('/watch')}
                    >
                        ▶ {t('hero.play')}
                    </button>
                    <button style={{ ...styles.button, ...styles.infoButton }}>ℹ {t('hero.moreInfo')}</button>
                </div>
            </div>
        </header>
    );
};

const styles = {
    hero: {
        position: 'relative',
        height: '85vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4%',
        background: 'var(--background)',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '20vh',
        background: 'var(--gradient-hero)',
    },
    content: {
        maxWidth: '600px',
        zIndex: 10,
        marginTop: '0',
    },
    title: {
        fontSize: '4rem',
        fontWeight: '900',
        marginBottom: '1rem',
        lineHeight: '1.1',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    },
    description: {
        fontSize: '1.2rem',
        lineHeight: '1.5',
        color: '#e5e5e5',
        marginBottom: '2rem',
        textShadow: '0 1px 4px rgba(0,0,0,0.7)',
    },
    buttons: {
        display: 'flex',
        gap: '1rem',
    },
    button: {
        padding: '0.8rem 2rem',
        borderRadius: '4px',
        fontSize: '1.1rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'transform var(--transition-fast)',
    },
    playButton: {
        backgroundColor: '#fff',
        color: '#000',
    },
    infoButton: {
        backgroundColor: 'rgba(109, 109, 110, 0.7)',
        color: '#fff',
    }
};

export default Hero;
