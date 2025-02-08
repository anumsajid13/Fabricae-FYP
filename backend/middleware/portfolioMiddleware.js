

const path = require('path');
const pptxFilePath = path.join(__dirname, '..', 'uploads', 'presentations', 'my-presentation.pptx');
const JSZip = require('jszip');
const fs = require('fs');
const xml2js = require('xml2js');

// Constants for unit conversion
const EMU_PER_INCH = 914400;
const EMU_PER_POINT = 12700;

const convertEmuToPoints = (emu) => emu / EMU_PER_POINT;
const convertEmuToInches = (emu) => emu / EMU_PER_INCH;

const getColorFromScheme = (solidFill, theme) => {
    // Early return if required parameters are missing
    if (!solidFill) return null;
    
    try {
        // Handle direct RGB colors
        if (solidFill['a:srgbClr']?.[0]?.$?.val) {
            return '#' + solidFill['a:srgbClr'][0].$.val;
        }
        
        // Handle theme colors
        if (solidFill['a:schemeClr']?.[0]?.$?.val && theme) {
            const colorScheme = theme?.themeElements?.[0]?.clrScheme?.[0];
            if (!colorScheme) return null;
            
            const schemeName = solidFill['a:schemeClr'][0].$.val;
            
            // Map scheme color names to their values with safe navigation
            const colorMap = {
                'bg1': colorScheme['lt1']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'tx1': colorScheme['dk1']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'bg2': colorScheme['lt2']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'tx2': colorScheme['dk2']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'accent1': colorScheme['accent1']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'accent2': colorScheme['accent2']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'accent3': colorScheme['accent3']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'accent4': colorScheme['accent4']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'accent5': colorScheme['accent5']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'accent6': colorScheme['accent6']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'hlink': colorScheme['hlink']?.[0]?.['a:srgbClr']?.[0]?.$?.val,
                'folHlink': colorScheme['folHlink']?.[0]?.['a:srgbClr']?.[0]?.$?.val
            };
            
            return colorMap[schemeName] ? '#' + colorMap[schemeName] : null;
        }
    } catch (error) {
        console.warn('Warning: Error processing color scheme:', error);
        return null;
    }
    
    return null;
};

const processTextProperties = (rPr, theme) => {
    if (!rPr) return {};
    
    const styles = {};
    try {
        // Font size in points
        if (rPr['a:sz']?.[0]?.$?.val) {
            const fontSize = parseInt(rPr['a:sz'][0].$.val);
            if (!isNaN(fontSize)) {
                styles.fontSize = convertEmuToPoints(fontSize) + 'pt';
            }
        }
        
        // Font color - now with null safety
        if (rPr['a:solidFill']) {
            const color = getColorFromScheme(rPr['a:solidFill'][0], theme);
            if (color) styles.color = color;
        }
        
        // Font family with fallbacks
        if (rPr['a:latin']?.[0]?.$?.typeface) {
            styles.fontFamily = rPr['a:latin'][0].$.typeface;
            styles.fontSource = 'latin';
        } else if (rPr['a:ea']?.[0]?.$?.typeface) {
            styles.fontFamily = rPr['a:ea'][0].$.typeface;
            styles.fontSource = 'ea';
        }
        
        // Boolean properties with explicit checks
        if (rPr.$ && rPr.$.b === '1') styles.fontWeight = 'bold';
        if (rPr.$ && rPr.$.i === '1') styles.fontStyle = 'italic';
        
        // Text effects with null check
        if (rPr['a:effectLst'] && typeof processEffects === 'function') {
            const effects = processEffects(rPr['a:effectLst'][0]);
            if (effects) styles.textEffects = effects;
        }
    } catch (error) {
        console.warn('Warning: Error processing text properties:', error);
    }
    
    return styles;
};

const extractThemeInfo = async (zip) => {
    try {
        const themePath = 'ppt/theme/theme1.xml';
        if (!zip.files[themePath]) {
            console.warn('Warning: Theme file not found');
            return null;
        }
        
        const themeXml = await zip.files[themePath].async('text');
        const themeData = await xml2js.parseStringPromise(themeXml);
        return themeData['a:theme'] || null;
    } catch (error) {
        console.warn('Warning: Error extracting theme info:', error);
        return null;
    }
};

const processShapeProperties = (spPr, theme) => {
    if (!spPr) return {};
    
    const styles = {};
    try {
        // Background fill
        if (spPr['a:solidFill']) {
            const bgColor = getColorFromScheme(spPr['a:solidFill'][0], theme);
            if (bgColor) styles.backgroundColor = bgColor;
        }
        
        // Position and size
        if (spPr['a:xfrm']?.[0]) {
            const xfrm = spPr['a:xfrm'][0];
            
            // Handle rotation
            if (xfrm.$?.rot) {
                styles.rotation = parseInt(xfrm.$.rot) / 60000; // Convert to degrees
            }
            
            // Position
            if (xfrm['a:off']?.[0]?.$) {
                styles.position = 'absolute';
                styles.left = convertEmuToInches(parseInt(xfrm['a:off'][0].$.x)) + 'in';
                styles.top = convertEmuToInches(parseInt(xfrm['a:off'][0].$.y)) + 'in';
            }
            
            // Size
            if (xfrm['a:ext']?.[0]?.$) {
                styles.width = convertEmuToInches(parseInt(xfrm['a:ext'][0].$.cx)) + 'in';
                styles.height = convertEmuToInches(parseInt(xfrm['a:ext'][0].$.cy)) + 'in';
            }
        }
        
        // Shape type
        if (spPr['a:prstGeom']?.[0]?.$?.prst) {
            styles.shapeType = spPr['a:prstGeom'][0].$.prst;
        }
        
        // Border/outline
        if (spPr['a:ln']) {
            styles.border = processLineProperties(spPr['a:ln'][0]);
        }
    } catch (error) {
        console.warn('Warning: Error processing shape properties:', error);
    }
    
    return styles;
};
const processLineProperties = (ln) => {
    if (!ln) return {};

    const lineStyles = {};
    try {
        // Line width
        if (ln['a:w']?.[0]?.$?.val) {
            lineStyles.width = convertEmuToPoints(parseInt(ln['a:w'][0].$.val)) + 'pt';
        }

        // Line color
        if (ln['a:solidFill']) {
            const color = getColorFromScheme(ln['a:solidFill'][0], theme);
            if (color) lineStyles.color = color;
        }

        // Line style (e.g., solid, dashed)
        if (ln['a:prstDash']?.[0]?.$?.val) {
            lineStyles.style = ln['a:prstDash'][0].$.val;
        }
    } catch (error) {
        console.warn('Warning: Error processing line properties:', error);
    }

    return lineStyles;
};


const processCrop = (srcRect) => {
    if (!srcRect) return {};

    const cropStyles = {};
    try {
        // Crop values are typically in percentages (0-100000)
        if (srcRect.l) cropStyles.left = parseInt(srcRect.l) / 1000 + '%';
        if (srcRect.r) cropStyles.right = parseInt(srcRect.r) / 1000 + '%';
        if (srcRect.t) cropStyles.top = parseInt(srcRect.t) / 1000 + '%';
        if (srcRect.b) cropStyles.bottom = parseInt(srcRect.b) / 1000 + '%';
    } catch (error) {
        console.warn('Warning: Error processing crop:', error);
    }

    return cropStyles;
};

const processImageProperties = async (pic, zip, theme) => {
    const imageData = {
        type: 'image',
        styles: processShapeProperties(pic['p:spPr']?.[0], theme)
    };

    try {
        const blip = pic['p:blipFill']?.[0]?.['a:blip']?.[0];
        if (blip?.$?.['r:embed']) {
            const embedId = blip.$['r:embed'];

            // Extract image data from the ZIP
            const relsPath = 'ppt/slides/_rels/slide1.xml.rels';

            // Check if the relationships file exists
            if (!zip.files[relsPath]) {
                console.warn(`Warning: Relationships file not found in ZIP: ${relsPath}`);
                return imageData;
            }

            const relsXml = await zip.files[relsPath].async('text');
            const rels = await xml2js.parseStringPromise(relsXml);

            const imageRels = rels['Relationships']['Relationship'];
            const targetRel = imageRels.find(rel => rel.$.Id === embedId);

            if (targetRel) {
                let imagePath = targetRel.$.Target;

                // Resolve relative paths (e.g., "../media/image1.jpeg")
                if (imagePath.startsWith('../')) {
                    imagePath = imagePath.replace('../', 'ppt/');
                } else {
                    imagePath = `ppt/${imagePath}`;
                }

                // Check if the image file exists in the ZIP
                if (!zip.files[imagePath]) {
                    console.warn(`Warning: Image file not found in ZIP: ${imagePath}`);
                    return imageData;
                }

                const imageBuffer = await zip.files[imagePath].async('nodebuffer');

                // Save image to disk or convert to base64
                const imageExt = path.extname(imagePath);
                const imageName = `image_${embedId}${imageExt}`;
                const outputPath = path.join(__dirname, '..', 'uploads', 'presentations', 'media', imageName);

                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                fs.writeFileSync(outputPath, imageBuffer);

                imageData.src = `/uploads/presentations/media/${imageName}`;

                // Process image crop and effects
                if (pic['p:blipFill']?.[0]?.['a:srcRect']?.[0]?.$) {
                    imageData.styles.crop = processCrop(pic['p:blipFill'][0]['a:srcRect'][0].$);
                }
            }
        }
    } catch (error) {
        console.warn('Warning: Error processing image:', error);
    }

    return imageData;
};

const extractSlideContent = async () => {
    try {
        const data = fs.readFileSync(pptxFilePath);
        const zip = await JSZip.loadAsync(data);
        const theme = await extractThemeInfo(zip);
        
        const slides = [];
        let slideIndex = 1;
        
        while (zip.files[`ppt/slides/slide${slideIndex}.xml`]) {
            const slideXml = await zip.files[`ppt/slides/slide${slideIndex}.xml`].async('text');
            const slideContent = await xml2js.parseStringPromise(slideXml);
            
            const elements = [];
            const spTree = slideContent['p:sld']?.['p:cSld']?.[0]?.['p:spTree']?.[0];
            
            // Process shapes
            if (spTree?.['p:sp']) {
                for (const shape of spTree['p:sp']) {
                    const element = {
                        type: 'shape',
                        styles: processShapeProperties(shape['p:spPr']?.[0], theme),
                        content: []
                    };
                    
                    // Process text content
                    if (shape['p:txBody']) {
                        element.content = await processTextBody(shape['p:txBody'][0], theme);
                    }
                    
                    elements.push(element);
                }
            }
            
            // Process images
            if (spTree?.['p:pic']) {
                for (const pic of spTree['p:pic']) {
                    const imageElement = await processImageProperties(pic, zip, theme);
                    elements.push(imageElement);
                }
            }
            
            slides.push({
                slideNumber: slideIndex,
                elements
            });
            
            slideIndex++;
        }
        
        return slides;
    } catch (error) {
        console.error('Error extracting slide content:', error);
        throw error;
    }
};

const processTextBody = async (txBody, theme) => {
    const paragraphs = [];
    
    if (txBody['a:p']) {
        for (const paragraph of txBody['a:p']) {
            const paraContent = {
                type: 'paragraph',
                styles: processParagraphProperties(paragraph['a:pPr']?.[0]),
                runs: []
            };
            
            // Process text runs
            if (paragraph['a:r']) {
                for (const run of paragraph['a:r']) {
                    paraContent.runs.push({
                        text: run['a:t']?.[0] || '',
                        styles: processTextProperties(run['a:rPr']?.[0], theme)
                    });
                }
            }
            
            paragraphs.push(paraContent);
        }
    }
    
    return paragraphs;
};

const processParagraphProperties = (pPr) => {
    if (!pPr) return {};
    
    const styles = {};
    
    try {
        // Alignment
        if (pPr.$?.algn) {
            styles.textAlign = pPr.$.algn;
        }
        
        // Line spacing
        if (pPr['a:lnSpc']?.[0]?.['a:spcPts']?.[0]?.$?.val) {
            styles.lineHeight = parseInt(pPr['a:lnSpc'][0]['a:spcPts'][0].$.val) / 100 + 'pt';
        }
        
        // Indentation
        if (pPr['a:indent']?.[0]?.$) {
            styles.textIndent = convertEmuToPoints(parseInt(pPr['a:indent'][0].$.firstLine)) + 'pt';
        }
    } catch (error) {
        console.warn('Warning: Error processing paragraph properties:', error);
    }
    
    return styles;
};


/**
 * Saves changes to the PPTX file.
 * @param {Array} slides - Updated slide data.
 * @returns {Promise<void>}
 */
const saveChanges = async (slides) => {
    try {
        // Read the PPTX file
        const data = fs.readFileSync(pptxFilePath);
        const zip = await JSZip.loadAsync(data);

        // Update slides with new content
        for (const slide of slides) {
            const slidePath = `ppt/slides/slide${slide.slideNumber}.xml`;
            const slideXml = await zip.files[slidePath].async('text');
            const slideContent = await xml2js.parseStringPromise(slideXml);

            // Update text and images (example: only text is updated here)
            const textElements = slideContent['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'];
            textElements.forEach((element, index) => {
                const text = slide.content.find((item) => item.type === 'text' && item.index === index);
                if (text) {
                    element['p:txBody'][0]['a:p'][0]['a:r'][0]['a:t'][0] = text.text;
                }
            });

            // Convert updated XML back to string
            const builder = new xml2js.Builder();
            const updatedSlideXml = builder.buildObject(slideContent);

            // Update the ZIP file
            zip.file(slidePath, updatedSlideXml);
        }

        // Save the updated PPTX file
        const outputPath = path.join(__dirname, '..', 'uploads', 'presentations', 'updated-presentation.pptx');
        const updatedData = await zip.generateAsync({ type: 'nodebuffer' });
        fs.writeFileSync(outputPath, updatedData);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to save changes');
    }
};

module.exports = {
    extractSlideContent,
    saveChanges,
};