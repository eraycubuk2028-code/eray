import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import moonImg from '../assets/moon.png';
import erayImg from '../assets/eray_placeholder.png';

const NewPopular = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [items, setItems] = useState([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); // all, movie, series
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month, year
    const [sortBy, setSortBy] = useState('views'); // views, like_ratio, newest

    // Styles for Body Scroll Lock
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isDrawerOpen]);

    // Generate Safe Data
    useEffect(() => {
        const generateItem = (id, type) => {
            const isMovie = type === 'movie';
            const uploadDate = new Date(); // Just use today for simplicity/safety or random recent

            return {
                id,
                type,
                title: "Deneme 123",
                description: "Telif hakkı olmayan güvenli içerik. Deneme amaçlı oluşturulmuştur.",
                year: 2024,
                uploadDate: uploadDate,
                views: 1000,
                likes: 100,
                dislikes: 0,
                viewCountDisplay: "1K",
                badge: isMovie ? "HD" : "NEW EP",
                rawMatchVal: 99,
                rawDurationVal: isMovie ? 120 : 1,
                image: erayImg,
                heroImage: erayImg
            };
        };

        const safeItems = Array(50).fill(null).map((_, i) => generateItem(i + 1, i % 2 === 0 ? 'movie' : 'series'));

        setItems(safeItems);
    }, []);

    // Filter Logic
    const getFilteredItems = () => {
        let filtered = [...items];

        // Search
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.title.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'))
            );
        }

        // Type
        if (typeFilter !== 'all') {
            filtered = filtered.filter(item => item.type === typeFilter);
        }

        // Date - Simplified for safe content
        // Keeps the filter UI working but data is all "fresh" basically

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'views': return b.views - a.views;
                case 'likes': return b.likes - a.likes;
                case 'newest': return b.uploadDate - a.uploadDate;
                default: return 0;
            }
        });

        return filtered;
    };

    const displayedItems = getFilteredItems();

    // Handlers
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedItem(null), 300);
    };

    const searchInputRef = React.useRef(null);

    return (
        <div style={styles.container}>
            {/* Control Bar */}
            <div style={styles.controlBarContainer}>
                <div style={styles.controlBar}>
                    {/* Branding */}
                    <div style={styles.logo} onClick={() => navigate('/')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                        KUDRETLİERAYBEY
                    </div>

                    {/* Filter Icon Trigger */}
                    <div style={{ position: 'relative' }}>
                        <button
                            style={{
                                ...styles.iconButton,
                                backgroundColor: (dateFilter !== 'all' || sortBy !== 'views') ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: (dateFilter !== 'all' || sortBy !== 'views') ? 'white' : '#aaa'
                            }}
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            title={t('browse.filterSort')}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="21" x2="4" y2="14"></line>
                                <line x1="4" y1="10" x2="4" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12" y2="3"></line>
                                <line x1="20" y1="21" x2="20" y2="16"></line>
                                <line x1="20" y1="12" x2="20" y2="3"></line>
                                <line x1="1" y1="14" x2="7" y2="14"></line>
                                <line x1="9" y1="8" x2="15" y2="8"></line>
                                <line x1="17" y1="16" x2="23" y2="16"></line>
                            </svg>
                        </button>

                        {/* Filter Popover Menu */}
                        {showFilterMenu && (
                            <div style={styles.filterMenu}>
                                <div style={styles.filterSection}>
                                    <span style={styles.filterLabel}>{t('browse.filterTime')}</span>
                                    <div style={styles.filterOptions}>
                                        {['all', 'year', 'month', 'week', 'today'].map(opt => (
                                            <button
                                                key={opt}
                                                style={dateFilter === opt ? styles.filterOptionActive : styles.filterOption}
                                                onClick={() => setDateFilter(opt)}
                                            >
                                                {opt === 'all' ? t('browse.timeAll') :
                                                    opt === 'year' ? t('browse.timeYear') :
                                                        opt === 'month' ? t('browse.timeMonth') :
                                                            opt === 'week' ? t('browse.timeWeek') : t('browse.timeToday')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={styles.filterSection}>
                                    <span style={styles.filterLabel}>{t('browse.filterSort')}</span>
                                    <div style={styles.filterOptions}>
                                        {['views', 'likes', 'newest'].map(opt => (
                                            <button
                                                key={opt}
                                                style={sortBy === opt ? styles.filterOptionActive : styles.filterOption}
                                                onClick={() => setSortBy(opt)}
                                            >
                                                {opt === 'views' ? t('browse.sortViews') :
                                                    opt === 'likes' ? t('browse.sortLikes') : t('browse.sortNewest')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search & Type */}
                    <div style={styles.controlLeft}>
                        <div
                            style={styles.searchWrapper}
                            onClick={() => searchInputRef.current && searchInputRef.current.focus()}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{ marginRight: '10px', cursor: 'pointer' }}>
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={t('browse.searchPlaceholder')}
                                style={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div style={styles.typeToggle}>
                            <button
                                style={typeFilter === 'all' ? styles.toggleBtnActive : styles.toggleBtn}
                                onClick={() => setTypeFilter('all')}
                            >{t('browse.all')}</button>
                            <button
                                style={typeFilter === 'movie' ? styles.toggleBtnActive : styles.toggleBtn}
                                onClick={() => setTypeFilter('movie')}
                            >{t('browse.movies')}</button>
                            <button
                                style={typeFilter === 'series' ? styles.toggleBtnActive : styles.toggleBtn}
                                onClick={() => setTypeFilter('series')}
                            >{t('browse.series')}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div style={styles.gridContainer}>
                {displayedItems.length > 0 ? (
                    displayedItems.map((item) => (
                        <div
                            key={item.id}
                            style={styles.card}
                            className="movie-card-hover"
                            onClick={() => handleItemClick(item)}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                style={styles.thumbnail}
                            />
                            {/* Stats Overlay on Card */}
                            <div style={styles.statsOverlay}>
                                <div style={styles.statTag}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    {item.viewCountDisplay}
                                </div>
                            </div>

                            <div style={styles.cardOverlay} className="card-overlay">
                                <h3 style={styles.cardTitle}>{item.title}</h3>
                                <div style={styles.cardMetaRow}>
                                    <span>{item.year}</span>
                                    <span>•</span>
                                    <span style={{ textTransform: 'capitalize' }}>{item.type === 'movie' ? t('browse.movies') : t('browse.series')}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.noResults}>
                        <h3>{t('browse.noResults')}</h3>
                        <p>{t('browse.noResultsDesc')}</p>
                    </div>
                )}
            </div>

            {/* Side Drawer Details */}
            <div style={{
                ...styles.drawerBackdrop,
                opacity: isDrawerOpen ? 1 : 0,
                pointerEvents: isDrawerOpen ? 'auto' : 'none',
            }} onClick={handleCloseDrawer}></div>

            <div style={{
                ...styles.drawer,
                transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
            }}>
                {selectedItem && (
                    <div style={styles.drawerContent}>
                        <button style={styles.closeButton} onClick={handleCloseDrawer}>×</button>

                        <div style={{
                            ...styles.drawerHero,
                            backgroundImage: `linear-gradient(to top, #141414, transparent), url(${selectedItem.heroImage})`
                        }}>
                            <div style={styles.drawerHeroContent}>
                                <div style={styles.dateBadge}>{t('browse.uploaded')} {selectedItem.uploadDate.toLocaleDateString('tr-TR')}</div>
                                <h1 style={styles.drawerTitle}>{selectedItem.title}</h1>

                                <div style={styles.statsRow}>
                                    <div style={styles.statItem}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        {selectedItem.views.toLocaleString()} {t('browse.views')}
                                    </div>
                                    <div style={styles.statItem}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                        {selectedItem.likes.toLocaleString()}
                                    </div>
                                    <div style={styles.statItem}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                                        {selectedItem.dislikes.toLocaleString()}
                                    </div>
                                </div>

                                <div style={styles.meta}>
                                    <span style={styles.match}>{selectedItem.rawMatchVal}% {t('browse.match')}</span>
                                    <span style={styles.badge}>{selectedItem.badge}</span>
                                    <span>{selectedItem.rawDurationVal} {selectedItem.type === 'movie' ? t('browse.min') : t('browse.season')}</span>
                                </div>
                                <p style={styles.drawerDescription}>{selectedItem.description}</p>
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
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        paddingTop: '20px',
    },
    controlBarContainer: {
        padding: '20px 4%',
        position: 'relative',
        zIndex: 90,
        backgroundColor: 'rgba(20, 20, 20, 0.95)', // Nearly opaque for contrast
        borderBottom: '1px solid #333',
        backdropFilter: 'blur(10px)',
    },
    controlBar: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '15px',
    },
    controlLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        // flex: 1, // Remove flex 1 to prevent taking too much space if needed, or keep it.
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        marginRight: 'auto', // Push others to right if needed, but we have justify-between
    },
    searchWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '10px 20px',
        borderRadius: '30px',
        flex: 1,
        maxWidth: '400px',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'border-color 0.2s',
    },
    searchInput: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        width: '100%',
    },
    typeToggle: {
        display: 'flex',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '30px',
        padding: '5px',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    toggleBtn: {
        padding: '8px 25px',
        background: 'transparent',
        border: 'none',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '0.9rem',
        borderRadius: '25px',
        transition: 'all 0.2s',
        fontWeight: '500',
    },
    toggleBtnActive: {
        padding: '8px 25px',
        background: 'var(--primary)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        borderRadius: '25px',
        boxShadow: '0 2px 10px rgba(229, 9, 20, 0.4)',
    },
    iconButton: {
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    filterMenu: {
        position: 'absolute',
        top: '60px',
        left: 0,
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '20px',
        width: '300px',
        zIndex: 100,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    },
    filterSection: {
        marginBottom: '20px',
    },
    filterLabel: {
        display: 'block',
        color: '#888',
        fontSize: '0.85rem',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    filterOptions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    filterOption: {
        padding: '6px 14px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.05)',
        color: '#ccc',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    filterOptionActive: {
        padding: '6px 14px',
        borderRadius: '8px',
        background: 'var(--primary)',
        border: '1px solid var(--primary)',
        color: 'white',
        fontSize: '0.9rem',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    gridContainer: {
        padding: '40px 4%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '24px',
    },
    card: {
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: '#1a1a1a',
        aspectRatio: '2/3',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    statsOverlay: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 2,
    },
    statTag: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        fontSize: '0.75rem',
        padding: '3px 8px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
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
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    cardMetaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.8rem',
        color: '#ccc',
    },
    noResults: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '50px',
        color: '#666',
    },
    // Drawer (Reused)
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
        height: '60vh',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '40px',
    },
    drawerHeroContent: {
        width: '100%',
    },
    dateBadge: {
        display: 'inline-block',
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    drawerTitle: {
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '15px',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        lineHeight: 1.1,
    },
    statsRow: {
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        color: '#ddd',
        fontSize: '0.9rem',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
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
};

export default NewPopular;
