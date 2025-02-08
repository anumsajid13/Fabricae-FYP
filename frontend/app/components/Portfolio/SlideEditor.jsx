import React, { useState, useEffect } from 'react';

const SlideEditor = ({ slide, onSave, onCancel }) => {
    // Ensure content is always an array (fallback to empty array if undefined)
    const content = slide?.content || [];

    const [editedContent, setEditedContent] = useState(content);

    useEffect(() => {
        // Reset the editedContent whenever the slide changes
        setEditedContent(content);
    }, [slide]);

    const handleContentChange = (index, value) => {
        const updatedContent = [...editedContent];
        updatedContent[index] = value;
        setEditedContent(updatedContent);
    };

    const handleSave = () => {
        onSave(editedContent);
    };

    return (
        <div className="slide-editor">
            <h2>Edit Slide {slide?.slideNumber}</h2>
            {content.length === 0 ? (
                <p>No content available for this slide.</p>
            ) : (
                content.map((item, index) => (
                    <div key={index}>
                        {item.type === 'text' && (
                            <textarea
                                value={editedContent[index]}
                                onChange={(e) => handleContentChange(index, e.target.value)}
                            />
                        )}
                    </div>
                ))
            )}
            <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default SlideEditor;
