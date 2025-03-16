'use client';  // Add this line

import { zIndex } from 'html2canvas/dist/types/css/property-descriptors/z-index';
import { useState } from 'react';
import { Uploader, Radio } from 'rsuite';

const FileUploader = () => {
  const [selectedOption, setSelectedOption] = useState(1);

  const handleRadioChange = (value: any) => {
    setSelectedOption(value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Upload your sketch</h2>
      
      <div  style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '10px',
          backgroundColor: '#f1f1f1',  // Light gray background
          borderRadius: '6px',
          marginBottom: '20px',
          zIndex:'100'
        }}>
        <Radio value={1} checked={selectedOption === 1} onChange={() => handleRadioChange(1)} style={{ marginRight: '10px' }}>Option 1</Radio>
        <Radio value={2} checked={selectedOption === 2} onChange={() => handleRadioChange(2)} style={{ marginRight: '10px' }}>Option 2</Radio>
        <Radio value={3} checked={selectedOption === 3} onChange={() => handleRadioChange(3)} style={{ marginRight: '10px' }}>Option 3</Radio>
      </div>
      
      <Uploader action="//jsonplaceholder.typicode.com/posts/" draggable>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Click or Drag files to this area to upload</span>
        </div>
      </Uploader>
    </div>
  );
};

export default FileUploader;
