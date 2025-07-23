const XLSX = require('xlsx');
const fs = require('fs');

// Debug function to examine Excel structure
function debugExcelFile(filePath) {
    console.log(`\n=== Debugging ${filePath} ===`);
    
    try {
        const workbook = XLSX.readFile(filePath);
        console.log('Sheet names:', workbook.SheetNames);
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Get raw data with headers as array
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log('Total rows:', rawData.length);
        console.log('First 3 rows:');
        for (let i = 0; i < Math.min(3, rawData.length); i++) {
            console.log(`Row ${i}:`, rawData[i]);
        }
        
        // Try to find header row
        for (let i = 0; i < Math.min(10, rawData.length); i++) {
            const row = rawData[i];
            if (row && row.length > 5) {
                console.log(`\nRow ${i} (${row.length} columns):`, row.slice(0, 10));
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Debug all files
const files = [
    './01_TGEAPCET_2024_FirstPhase_LastRanks.xlsx',
    './02_TGEAPCET_2024_SecondPhase_LastRanks.xlsx',
    './03_TGEAPCET_2024_FinalPhase_LastRanks.xlsx',
    './TGEAPCET_2025_Phase2_Official_Cutoffs.xlsx'
];

files.forEach(debugExcelFile);
