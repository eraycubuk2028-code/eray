import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { contentService } from '../services/contentService';

const Movies = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [stats, setStats] = useState({});

    // Fetch stats on mount and listen for real-time updates
    useEffect(() => {
        const unsubscribe = viewService.listenToAllStats((data) => {
            setStats(data);
        });
        return () => unsubscribe();
    }, []);

    // Effect to handle body scroll lock
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    // Get Movies from Service
    const rawMovies = contentService.getMovies();

    // Merge stats with movies
    const movies = rawMovies.map(movie => {
        const movieStats = stats[movie.id];
        return {
            ...movie,
            views: movieStats?.views || movie.views,
            likes: movieStats?.likes || movie.likes,
            dislikes: movieStats?.dislikes || movie.dislikes
        };
    });

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedMovie(null), 300);
    };

    const handleLike = async (e, movie) => {
        e.stopPropagation();
        if (!movie) return;

        // Optimistic update
        setStats(prev => ({
            ...prev,
            [movie.id]: {
                ...prev[movie.id],
                likes: (prev[movie.id]?.likes || 0) + 1
            }
        }));

        await viewService.likeMovie(movie.id);
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
                <h2 style={styles.pageTitle}>{t('browse.moviesTitle')}</h2>
                <p style={styles.pageSubtitle}>{t('browse.moviesSubtitle')}</p>
            </div>

            <div style={styles.grid}>
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        style={styles.card}
                        className="movie-card-hover"
                        onClick={() => handleMovieClick(movie)}
                    >
                        <img
                            src={movie.thumbnail}
                            alt={movie.title}
                            style={styles.thumbnail}
                        />
                        <div style={styles.cardOverlay} className="card-overlay">
                            <h3 style={styles.cardTitle}>{movie.title}</h3>
                            <span style={styles.cardMeta}>{movie.year} • {movie.genre}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Side Drawer */}
            <div style={{
                ...styles.drawerBackdrop,
                opacity: isDrawerOpen ? 1 : 0,
                pointerEvents: isDrawerOpen ? 'auto' : 'none',
            }} onClick={handleCloseDrawer}></div>

            <div style={{
                ...styles.drawer,
                transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
            }}>
                {selectedMovie && (() => {
                    const currentMovie = movies.find(m => m.id === selectedMovie.id) || selectedMovie;
                    return (
                        <div style={styles.drawerContent}>
                            <button style={styles.closeButton} onClick={handleCloseDrawer}>×</button>

                            {/* Drawer Hero Section */}
                            <div style={{
                                ...styles.drawerHero,
                                backgroundImage: `linear-gradient(to top, #141414, transparent), url(${currentMovie.heroImage})`
                            }}>
                                <div style={styles.drawerHeroContent}>
                                    <h1 style={styles.drawerTitle}>{currentMovie.title}</h1>

                                    <div style={styles.meta}>
                                        <span style={styles.match}>{currentMovie.rawMatch}% {t('browse.match')}</span>
                                        <span>{currentMovie.year}</span>
                                        <span style={styles.badge}>{currentMovie.badge}</span>
                                        <span>{currentMovie.rawDuration} {t('browse.min')}</span>
                                    </div>

                                    <div style={styles.genreTag}>{currentMovie.genre}</div>

                                    <p style={styles.drawerDescription}>{currentMovie.description}</p>

                                    <div style={styles.actions}>
                                        <button style={styles.playButton} onClick={() => navigate('/watch', { state: { movie: currentMovie } })}>
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

                                    <div style={styles.statsRow}>
                                        <div style={styles.statItem}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            {currentMovie.views.toLocaleString()} {t('browse.views')}
                                        </div>
                                        <div style={{ ...styles.statItem, cursor: 'pointer' }} onClick={(e) => handleLike(e, currentMovie)}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                            {currentMovie.likes.toLocaleString()}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* More Like This (Placeholder) */}
                            <div style={styles.moreLikeThis}>
                                <h3 style={styles.sectionTitle}>Bunu Beğenenler Şunları da İzledi</h3>
                                <div style={styles.recommendationGrid}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={styles.recommendationCard}>
                                            <div style={styles.recPlaceholder}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        paddingTop: '20px', // Reduced spacing
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '50px',
    },
    header: {
        marginBottom: '30px',
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
        fontSize: '2rem',
        color: 'var(--text-primary)',
        marginBottom: '10px',
    },
    pageSubtitle: {
        color: 'var(--text-secondary)',
        fontSize: '1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', // Auto responsive grid
        gap: '20px',
        width: '100%',
    },
    card: {
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: '#1a1a1a',
        aspectRatio: '2/3', // Poster aspect ratio
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'opacity 0.3s',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px 10px 10px 10px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
        color: 'white',
        opacity: 0,
        transition: 'opacity 0.3s',
        display: 'flex',
        flexDirection: 'column',
    },
    cardTitle: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    cardMeta: {
        fontSize: '0.8rem',
        color: '#ccc',
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
        maxWidth: '90%',
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
        height: '60vh', // Taller for movies
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '40px',
    },
    drawerHeroContent: {
        width: '100%',
    },
    drawerTitle: {
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        lineHeight: 1.1,
    },
    drawerDescription: {
        fontSize: '1.1rem',
        color: '#ddd',
        marginBottom: '25px',
        lineHeight: '1.5',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        maxWidth: '500px',
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '15px',
        fontSize: '1rem',
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
    genreTag: {
        display: 'inline-block',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        marginBottom: '15px',
        color: 'white',
    },
    actions: {
        display: 'flex',
        gap: '15px',
    },
    playButton: {
        padding: '12px 35px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    listButton: {
        padding: '12px 35px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'rgba(109, 109, 110, 0.7)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    statsRow: {
        display: 'flex',
        gap: '20px',
        marginTop: '20px',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.9rem',
        color: '#ccc',
    },
    moreLikeThis: {
        padding: '40px',
    },
    sectionTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    recommendationGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
    },
    recommendationCard: {
        aspectRatio: '16/9',
        backgroundColor: '#222',
        borderRadius: '4px',
    },
    recPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#333'
    }
};

export default Movies;
