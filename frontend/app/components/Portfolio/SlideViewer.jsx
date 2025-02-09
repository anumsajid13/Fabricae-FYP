// PowerPointViewer.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Edit, Loader } from 'lucide-react';
import SlideEditor from './SlideEditor';

const convertStyleUnits = (styles) => {
    if (!styles) return {};
    
    const convertedStyles = { ...styles };
    
    // Convert inch measurements to pixels (assuming 96dpi)
    if (styles.width?.endsWith('in')) {
        convertedStyles.width = `${parseFloat(styles.width) * 96}px`;
    }
    if (styles.height?.endsWith('in')) {
        convertedStyles.height = `${parseFloat(styles.height) * 96}px`;
    }
    if (styles.left?.endsWith('in')) {
        convertedStyles.left = `${parseFloat(styles.left) * 96}px`;
    }
    if (styles.top?.endsWith('in')) {
        convertedStyles.top = `${parseFloat(styles.top) * 96}px`;
    }
    
    // Convert point measurements to pixels
    if (styles.fontSize?.endsWith('pt')) {
        convertedStyles.fontSize = `${parseFloat(styles.fontSize) * 1.333333}px`;
    }
    if (styles.lineHeight?.endsWith('pt')) {
        convertedStyles.lineHeight = `${parseFloat(styles.lineHeight) * 1.333333}px`;
    }
    
    // Handle rotation
    if (typeof styles.rotation === 'number') {
        convertedStyles.transform = `rotate(${styles.rotation}deg)`;
        delete convertedStyles.rotation;
    }
    
    return convertedStyles;
};

const ImageElement = ({ src, styles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <div style={convertStyleUnits(styles)} className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader className="animate-spin" />
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500">
                    Failed to load image
                </div>
            )}
            <img
                src={src}
                alt="Slide content"
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                    setIsLoading(false);
                    setError(e);
                }}
                className={isLoading ? 'invisible' : 'visible'}
            />
        </div>
    );
};

const ShapeElement = ({ content, styles }) => {
    return (
        <div style={convertStyleUnits(styles)}>
            {content.map((paragraph, pIndex) => (
                <div key={pIndex} style={convertStyleUnits(paragraph.styles)}>
                    {paragraph.runs.map((run, rIndex) => (
                        <span key={rIndex} style={convertStyleUnits(run.styles)}>
                            {run.text}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

const PowerPointViewer = () => {
    const [slides, setSlides] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('http://localhost:5000/api/presentation');
                
                if (!response.ok) {
                    throw new Error(`Failed to load presentation: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (!Array.isArray(data.slides)) {
                    throw new Error('Invalid presentation data format');
                }
                
                setSlides(data.slides);
            } catch (error) {
                console.error('Error fetching slides:', error);
                setError(error.message || 'Failed to load presentation');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchSlides();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNextSlide();
            if (e.key === 'ArrowLeft') handlePreviousSlide();
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentSlideIndex, isFullscreen]);

    const handleNextSlide = () => {
        if (slides && currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const handlePreviousSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async (updatedContent) => {
        try {
            setIsSaving(true);
            const response = await fetch('http://localhost:5000/api/presentation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slideNumber: currentSlideIndex + 1,
                    content: updatedContent
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save changes');
            }
            
            // Update local state
            const updatedSlides = [...slides];
            updatedSlides[currentSlideIndex] = {
                ...updatedSlides[currentSlideIndex],
                elements: updatedContent
            };
            setSlides(updatedSlides);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving changes:', error);
            // You might want to show an error notification here
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const renderCurrentSlide = () => {
        if (!slides || !slides[currentSlideIndex]) return null;

        const slide = slides[currentSlideIndex];
        const slideStyle = {
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'white' // Default background
        };

        return (
            <div style={slideStyle}>
                {slide.elements?.map((element, index) => {
                    if (element.type === 'image') {
                        return <ImageElement key={index} {...element} />;
                    }
                    if (element.type === 'shape') {
                        return <ShapeElement key={index} {...element} />;
                    }
                    return null;
                })}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader className="animate-spin mr-2" />
                <span className="text-gray-500">Loading presentation...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-red-500 bg-red-50 p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Error Loading Presentation</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!slides || slides.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-gray-500">No slides available</div>
            </div>
        );
    }

    return (
        <div className={`relative ${isFullscreen ? 'fixed inset-0 bg-black z-50' : 'min-h-screen bg-gray-100 p-6'}`}>
            <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            {isEditing ? (
                <SlideEditor
                    slide={slides[currentSlideIndex]}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isSaving={isSaving}
                />
            ) : (
                <>
                    <div className={`relative ${isFullscreen ? 'h-screen' : 'aspect-[16/9] max-w-6xl mx-auto shadow-2xl'}`}>
                        {renderCurrentSlide()}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 text-white px-4 py-2 rounded-full">
                            <button
                                onClick={handlePreviousSlide}
                                disabled={currentSlideIndex === 0}
                                className="p-1 hover:bg-white/20 rounded-full disabled:opacity-50 transition-colors"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <span>
                                {currentSlideIndex + 1} / {slides.length}
                            </span>
                            <button
                                onClick={handleNextSlide}
                                disabled={currentSlideIndex === slides.length - 1}
                                className="p-1 hover:bg-white/20 rounded-full disabled:opacity-50 transition-colors"
                                aria-label="Next slide"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleEdit}
                        className="absolute top-4 left-4 z-10 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                        aria-label="Edit slide"
                    >
                        <Edit size={20} />
                    </button>
                </>
            )}
        </div>
    );
};

export default PowerPointViewer;