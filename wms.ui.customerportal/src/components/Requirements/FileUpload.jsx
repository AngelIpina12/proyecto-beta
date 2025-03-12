import React, { useRef } from 'react';
import * as XLSX from 'xlsx';

export const FileUpload = ({ onFileProcessed }) => {
    const inputRef = useRef();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            console.log(jsonData);
            if (jsonData.length > 1) {
            const headers = jsonData[1].map((header) => header?.trim() || '');
            const rows = jsonData.slice(2).filter((row) => row.length === headers.length);
            onFileProcessed({ headers, rows });
            } else {
            alert('El archivo Excel no contiene datos válidos.');
            }
        };
        inputRef.current.value = '';
        reader.readAsArrayBuffer(file);
        }
    };

  return (
    <input
      type="file"
      accept=".xlsx, .xls"
      onChange={handleFileUpload}
      ref={inputRef}
      style={{ display: 'none' }}
      id="file-upload"
    />
  );
};