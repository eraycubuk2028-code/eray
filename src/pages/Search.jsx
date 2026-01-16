import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { useTranslation } from '../hooks/useTranslation';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query) {
            const searchResults = contentService.searchContent(query);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    }, [query]);

    // Handle item click (reuse logic from Movies/Series)
    // For simplicity, we navigate to the respective page or open a modal
    // Since we don't have a unified "Detail" page yet, and Movies/Series use internal state for drawers,
    // we might need to navigate to /watch if it's a direct play or just show a basic grid for now.
    // Ideally, we'd have a reusable Card component.
    const handleItemClick = (item) => {
        // Navigate to watch directly for now as simple action
        navigate('/watch', { state: { movie: item } });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.pageTitle}>
                    {query ? `"${query}" için sonuçlar` : 'Arama yapın'}
                </h2>
                <p style={styles.pageSubtitle}>
                    {results.length > 0
                        ? `${results.length} içerik bulundu`
                        : query ? 'Maalesef hiçbir içerik bulunamadı.' : ''}
                </p>
            </div>

            <div style={styles.grid}>
                {results.map((item) => (
                    <div
                        key={item.id}
                        style={styles.card}
                        className="movie-card-hover"
                        onClick={() => handleItemClick(item)}
                    >
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={styles.thumbnail}
                        />
                        <div style={styles.cardOverlay} className="card-overlay">
                            <h3 style={styles.cardTitle}>{item.title}</h3>
                            <span style={styles.cardMeta}>{item.year} • {item.type === 'movie' ? 'Film' : 'Dizi'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        paddingTop: '100px', // Extra padding for fixed navbar
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '50px',
    },
    header: {
        marginBottom: '30px',
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
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
        aspectRatio: '2/3',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px 10px 10px 10px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
        color: 'white',
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
};

export default Search;
