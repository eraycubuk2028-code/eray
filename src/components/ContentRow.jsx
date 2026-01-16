import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import moonImg from '../assets/moon.png';
import erayImg from '../assets/eray_placeholder.png';

const ContentRow = ({ title, items = [] }) => {
    const rowRef = useRef(null);

    // Generate safe placeholders if no items provided
    const displayItems = items.length ? items : Array(10).fill(null).map((_, i) => ({
        id: i,
        title: "Deneme 123",
        image: erayImg
    }));

    return (
        <div style={styles.row}>
            <h3 style={styles.title}>{title}<span style={styles.explore}>Explore All &gt;</span></h3>
            <div style={styles.list} ref={rowRef}>
                {displayItems.map((item, i) => (
                    <MovieCard
                        key={item.id || i}
                        title={item.title}
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    );
};

const styles = {
    row: {
        margin: '3vw 0',
        padding: '0 4%',
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#e5e5e5',
        display: 'flex',
        alignItems: 'baseline',
        gap: '10px',
    },
    explore: {
        fontSize: '0.8rem',
        color: 'var(--primary)',
        opacity: 0, // Hidden by default, could show on hover of title
        cursor: 'pointer',
        transition: 'opacity var(--transition-fast)',
    },
    list: {
        display: 'flex',
        overflowX: 'auto',
        gap: '10px',
        padding: '20px 0', // Space for hover scales
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE
    }
};

export default ContentRow;
