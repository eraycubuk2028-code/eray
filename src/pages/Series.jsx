import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import moonImg from '../assets/moon.png';
import erayImg from '../assets/eray_placeholder.png';

const Series = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isDrawerOpen]);

    // Safe Content Series
    const series = Array(20).fill(null).map((_, index) => ({
        id: index + 1,
        title: "Deneme 123",
        description: "Telif hakkı olmayan güvenli içerik. Deneme amaçlı oluşturulmuştur.",
        year: 2024,
        rawMatch: 99,
        seasons: 1,
        price: "1.00",
        author: "Safe Content",
        badge: "HD",
        thumbnail: erayImg,
        heroImage: erayImg
    }));

    const handleSeriesClick = (item) => {
        setSelectedSeries(item);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedSeries(null), 300);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerTop}>
                    <div style={styles.logo} onClick={() => navigate('/')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                        KUDRETLİERAYBEY
                    </div>
                </div>
                <h2 style={styles.pageTitle}>{t('browse.popularSeries')}</h2>
            </div>

            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>{t('browse.moviesSubtitle')}</h3>
                <div style={styles.seriesGrid}>
                    {series.map((item) => (
                        <div
                            key={item.id}
                            style={styles.seriesCard}
                            className="series-card-hover"
                            onClick={() => handleSeriesClick(item)}
                        >
                            <div style={styles.imageWrapper}>
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    style={styles.seriesThumbnail}
                                />
                            </div>
                            <div style={styles.seriesInfo}>
                                <h4 style={styles.seriesTitle}>{item.title}</h4>
                                <div style={styles.seriesMeta}>
                                    <span style={{ color: '#46d369' }}>{item.rawMatch}% {t('browse.match')}</span>
                                    <span>{item.year}</span>
                                    <span>{item.seasons} {t('browse.season')}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>
                                    <span style={{ color: '#46d369', fontWeight: 'bold' }}>${item.price}</span> {t('browse.perEpisode')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Drawer Modal */}
            <div style={{
                ...styles.drawerBackdrop,
                opacity: isDrawerOpen ? 1 : 0,
                pointerEvents: isDrawerOpen ? 'auto' : 'none',
            }} onClick={handleCloseDrawer}></div>

            <div style={{
                ...styles.drawer,
                transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
            }}>
                {selectedSeries && (
                    <div style={styles.drawerContent}>
                        <button style={styles.closeButton} onClick={handleCloseDrawer}>×</button>

                        <div style={{
                            ...styles.drawerHero,
                            backgroundImage: `linear-gradient(to top, #141414, transparent), url(${selectedSeries.heroImage})`
                        }}>
                            <div style={styles.drawerHeroContent}>
                                <h1 style={styles.drawerTitle}>{selectedSeries.title}</h1>

                                <div style={styles.meta}>
                                    <span style={styles.match}>{selectedSeries.rawMatch}% {t('browse.match')}</span>
                                    <span>{selectedSeries.year}</span>
                                    <span style={styles.badge}>{selectedSeries.badge}</span>
                                    <span>{selectedSeries.seasons} {t('browse.season')}</span>
                                    <span style={{ ...styles.badge, borderColor: '#46d369', color: '#46d369' }}>
                                        ${selectedSeries.price} {t('browse.perEpisode')}
                                    </span>
                                </div>

                                <p style={styles.drawerDescription}>{selectedSeries.description}</p>

                                <div style={styles.actions}>
                                    <button style={styles.playButton}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        {t('browse.play')}
                                    </button>
                                    <button style={styles.listButton}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        {t('browse.addToList')}
                                    </button>
                                </div>
                                <div style={{ marginTop: '15px', color: '#888', fontSize: '0.9rem' }}>
                                    {t('browse.firstEpFree')}
                                </div>

                                <div style={{ marginTop: '30px' }}>
                                    <h3>{t('browse.episodes')}</h3>
                                    <div style={styles.episodeList}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} style={styles.episodeItem}>
                                                <span style={styles.episodeNum}>{i + 1}</span>
                                                <div style={{ ...styles.episodeThumb, backgroundImage: `url(${moonImg})`, backgroundSize: 'cover' }}></div>
                                                <div style={styles.episodeInfo}>
                                                    <h4>Bölüm {i + 1}</h4>
                                                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 5 }}>Telif hakkı olmayan güvenli içerik.</p>
                                                </div>
                                                <span style={styles.episodeDur}>45m</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        paddingTop: '20px', // Reduced spacing
        overflowX: 'hidden',
    },
    header: {
        padding: '0 4% 20px 4%',
    },
    headerTop: {
        marginBottom: '20px',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
    },
    pageTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
    },
    section: {
        padding: '0 4%',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        marginBottom: '20px',
        color: '#aaa',
    },
    seriesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px',
        paddingBottom: '40px',
    },
    seriesCard: {
        width: '100%',
        cursor: 'pointer',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
    },
    imageWrapper: {
        position: 'relative',
        aspectRatio: '2/3',
        width: '100%',
    },
    seriesThumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    seriesInfo: {
        padding: '10px',
    },
    seriesTitle: {
        fontSize: '0.95rem',
        fontWeight: 'bold',
        marginBottom: '5px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    seriesMeta: {
        display: 'flex',
        gap: '10px',
        fontSize: '0.75rem',
        color: '#aaa',
    },

    // Drawer Styles
    drawerBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 150,
        transition: 'opacity 0.3s ease',
    },
    drawer: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '600px',
        maxWidth: '90%', // For mobile
        height: '100%',
        backgroundColor: '#141414',
        zIndex: 200,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
        transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        overflowY: 'auto',
    },
    drawerContent: {
        position: 'relative',
        minHeight: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
        background: 'rgba(0,0,0,0.5)',
        border: 'none',
        color: 'white',
        fontSize: '2rem',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerHero: {
        height: '50vh', // Half height for side panel look
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '30px',
    },
    drawerHeroContent: {
        width: '100%',
    },
    drawerTitle: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
    },
    drawerDescription: {
        fontSize: '1rem',
        color: '#ddd',
        marginBottom: '20px',
        lineHeight: '1.4',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '15px',
        fontSize: '0.9rem',
        color: '#fff',
    },
    match: {
        color: '#46d369',
        fontWeight: 'bold',
    },
    badge: {
        border: '1px solid rgba(255,255,255,0.4)',
        padding: '0 4px',
        borderRadius: '2px',
        fontSize: '0.7rem',
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    playButton: {
        padding: '10px 25px',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    listButton: {
        padding: '10px 25px',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: 'rgba(109, 109, 110, 0.7)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    episodeList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    episodeItem: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '6px',
        transition: 'background 0.2s',
    },
    episodeNum: {
        color: '#aaa',
        fontSize: '1.2rem',
        width: '20px',
    },
    episodeThumb: {
        width: '120px',
        height: '70px',
        backgroundColor: '#333',
        borderRadius: '4px',
    },
    episodeInfo: {
        flex: 1,
    },
    episodeDur: {
        color: '#aaa',
        fontSize: '0.9rem',
    }
};

export default Series;
