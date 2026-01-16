import React from 'react';

const MovieCard = ({ title, image }) => {
    return (
        <div style={styles.card} className="movie-card">
            <img src={image} alt={title} style={styles.image} />
            <div style={styles.overlay}>
                <h4 style={styles.title}>{title}</h4>
                <div style={styles.meta}>
                    <span style={styles.match}>98% Match</span>
                    <span style={styles.age}>16+</span>
                    <span>1h 45m</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        minWidth: '220px',
        height: '130px',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform var(--transition-smooth), z-index 0s',
        marginRight: '10px',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '10px',
        background: 'var(--gradient-card)',
        opacity: 0,
        transition: 'opacity var(--transition-fast)',
    },
    title: {
        fontSize: '0.9rem',
        marginBottom: '5px',
    },
    meta: {
        display: 'flex',
        gap: '8px',
        fontSize: '0.7rem',
        color: '#ccc',
    },
    match: {
        color: '#46d369',
        fontWeight: 'bold',
    },
    age: {
        border: '1px solid #666',
        padding: '0 2px',
        borderRadius: '2px',
    }
};

/* We'll add hover effect via global CSS or inline styles in parent? 
   Inline hover is hard in React without state. 
   Better to put the detailed hover logic in CSS.
*/
export default MovieCard;
