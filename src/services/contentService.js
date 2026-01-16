import erayImg from '../assets/eray_placeholder.png';
import kuzenlerImg from '../assets/kuzenler.jpg';

// Generate Movies Data
const movies = [
    {
        id: 'kuzenler-1',
        type: 'movie',
        title: "Kuzenler",
        description: "Kuzenlerin eğlenceli ve komik anları. Bu özel içerikle kahkahaya doyamayacaksınız!",
        year: 2024,
        rawDuration: 15,
        duration: "15 dk.",
        genre: "Komedi",
        match: "98% Eşleşme",
        rawMatch: 98,
        views: 1500,
        likes: 250,
        dislikes: 0,
        badge: "4K",
        thumbnail: kuzenlerImg,
        heroImage: kuzenlerImg,
        videoUrl: "https://www.youtube.com/watch?v=ZixoY-1ET5s"
    },
    ...Array(30).fill(null).map((_, i) => ({
        id: `movie-${i + 1}`,
        type: 'movie',
        title: `Deneme Film ${i + 1}`,
        description: "Telif hakkı olmayan güvenli içerik. Deneme amaçlı oluşturulmuştur.",
        year: 2024,
        rawDuration: 120,
        duration: "120 dk.",
        genre: "Genel",
        match: "99% Eşleşme",
        rawMatch: 99,
        views: 1000,
        likes: 100,
        dislikes: 0,
        badge: "HD",
        thumbnail: erayImg,
        heroImage: erayImg
    }))
];

// Generate Series Data
const series = Array(20).fill(null).map((_, index) => ({
    id: `series-${index + 1}`,
    type: 'series',
    title: `Deneme Dizi ${index + 1}`,
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

// Combine all content
const allContent = [...movies, ...series];

export const contentService = {
    getMovies: () => movies,
    getSeries: () => series,
    getAllContent: () => allContent,
    searchContent: (query) => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return allContent.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
        );
    }
};
