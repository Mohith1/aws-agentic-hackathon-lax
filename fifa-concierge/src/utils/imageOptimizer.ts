// Optimize images for better performance using weserv.nl

export const optimizeImageUrl = (url: string, width: number, quality: number = 85): string => {
    // Use weserv.nl for image optimization (converts to WebP automatically)
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp`;
};

export const getOptimizedFlagUrl = (countryCode: string, width: number = 160): string => {
    const baseUrl = `https://flagcdn.com/w${width}/${countryCode.toLowerCase()}.png`;
    return optimizeImageUrl(baseUrl, width);
};

// Placeholder image generator for loading states
export const getPlaceholder = (width: number, height: number, text?: string): string => {
    const bgColor = '00369C';
    const textColor = 'FFFFFF';
    const displayText = text || `${width}x${height}`;
    return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(displayText)}`;
};

// Image preloader utility
export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};

// Batch preload multiple images
export const preloadImages = (urls: string[]): Promise<void[]> => {
    return Promise.all(urls.map(url => preloadImage(url)));
};
