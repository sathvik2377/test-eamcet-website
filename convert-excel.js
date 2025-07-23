const fs = require('fs');
const path = require('path');

// For Excel files, we'll need to install xlsx package
// npm install xlsx

let XLSX;
try {
    XLSX = require('xlsx');
} catch (error) {
    console.log('xlsx package not found. Please install it with: npm install xlsx');
    process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, 'data');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Convert closing ranks Excel to JSON
function convertClosingRanks() {
    console.log('🔄 Converting closing ranks Excel to JSON...');
    
    const excelPath = path.join(__dirname, 'all_closing_ranks.xlsx');
    if (!fs.existsSync(excelPath)) {
        console.error('❌ Closing ranks Excel file not found:', excelPath);
        return;
    }
    
    try {
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`✅ Converted ${jsonData.length} closing ranks records`);
        
        // Save to JSON file
        const outputPath = path.join(OUTPUT_DIR, 'closing-ranks.json');
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
        
        console.log(`💾 Saved to: ${outputPath}`);
        console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
        
        return jsonData;
    } catch (error) {
        console.error('❌ Error converting closing ranks:', error.message);
    }
}

// Convert Phase 2 cutoffs Excel to JSON
function convertPhase2Cutoffs() {
    console.log('🔄 Converting Phase 2 cutoffs Excel to JSON...');

    const excelPath = path.join(__dirname, 'TGEAPCET_2025_Phase2_Official_Cutoffs.xlsx');
    if (!fs.existsSync(excelPath)) {
        console.error('❌ Phase 2 cutoffs Excel file not found:', excelPath);
        return;
    }

    try {
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Find the header row (usually contains "College_Code", "College_Name", etc.)
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(10, jsonData.length); i++) {
            const row = jsonData[i];
            if (row && row.some(cell =>
                typeof cell === 'string' &&
                (cell.includes('College_Code') || cell.includes('College Code'))
            )) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            console.error('❌ Could not find header row in Phase 2 cutoffs');
            return;
        }

        const headers = jsonData[headerRowIndex];
        const dataRows = jsonData.slice(headerRowIndex + 1);

        // Convert to objects
        const cleanedData = dataRows
            .filter(row => row && row.length > 0 && row[0]) // Filter out empty rows
            .map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    if (header && typeof header === 'string') {
                        obj[header.trim()] = row[index] || '';
                    }
                });
                return obj;
            })
            .filter(obj => obj['College_Code'] || obj['College Code']); // Only keep rows with college codes

        console.log(`✅ Converted ${cleanedData.length} Phase 2 cutoffs records`);

        // Save to JSON file
        const outputPath = path.join(OUTPUT_DIR, 'phase2-cutoffs.json');
        fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));

        console.log(`💾 Saved to: ${outputPath}`);
        console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

        return cleanedData;
    } catch (error) {
        console.error('❌ Error converting Phase 2 cutoffs:', error.message);
    }
}

// Run conversions
if (require.main === module) {
    convertClosingRanks();
    convertPhase2Cutoffs();
}

module.exports = { convertClosingRanks, convertPhase2Cutoffs };
