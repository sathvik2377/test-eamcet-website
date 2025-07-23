const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to convert Excel to JSON with proper header handling
function convertExcelToJSON(filePath, outputPath, phase = null) {
    try {
        console.log(`Converting ${filePath}...`);

        // Read the Excel file
        const workbook = XLSX.readFile(filePath);

        // Get the first sheet name
        const sheetName = workbook.SheetNames[0];

        // Convert sheet to JSON without headers first
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawData.length < 3) {
            console.log('❌ Not enough data in file');
            return null;
        }

        // Get headers from second row (row 1) and clean them
        const headers = rawData[1].map(header => {
            if (!header) return null;
            return header.toString().trim().replace(/\r?\n/g, ' ').replace(/\s+/g, '_').toLowerCase();
        });

        // Map column names to standard names
        const columnMapping = {
            'inst_code': 'college_code',
            'institute_name': 'college_name',
            'place': 'place',
            'dist_code': 'district_code',
            'co_education': 'co_education',
            'college_type': 'college_type',
            'year_of_estab': 'year_established',
            'branch_code': 'branch_code',
            'branch_name': 'branch_name',
            'oc_boys': 'oc_boys',
            'oc_girls': 'oc_girls',
            'bc_a_boys': 'bc_a_boys',
            'bc_a_girls': 'bc_a_girls',
            'bc_b_boys': 'bc_b_boys',
            'bc_b_girls': 'bc_b_girls',
            'bc_c_boys': 'bc_c_boys',
            'bc_c_girls': 'bc_c_girls',
            'bc_d_boys': 'bc_d_boys',
            'bc_d_girls': 'bc_d_girls',
            'bc_e_boys': 'bc_e_boys',
            'bc_e_girls': 'bc_e_girls',
            'sc_boys': 'sc_boys',
            'sc_girls': 'sc_girls',
            'st_boys': 'st_boys',
            'st_girls': 'st_girls',
            'ews_gen_ou': 'ews_boys',
            'ews_girls_ou': 'ews_girls',
            'tuition_fee': 'tuition_fee',
            'affiliated_to': 'affiliated_to'
        };

        // Convert data rows to objects (start from row 2, index 2)
        const cleanedData = [];
        for (let i = 2; i < rawData.length; i++) {
            const row = rawData[i];
            const cleanedRow = {};

            headers.forEach((header, index) => {
                if (header && row[index] !== undefined) {
                    const standardKey = columnMapping[header] || header;
                    let value = row[index];

                    // Clean the value
                    if (typeof value === 'string') {
                        value = value.trim();
                        if (value === 'NA' || value === '' || value === '-') {
                            value = null;
                        }
                    }

                    cleanedRow[standardKey] = value;
                }
            });

            // Add phase information
            if (phase) {
                cleanedRow.phase = phase;
            }

            // Only add row if it has meaningful data
            if (cleanedRow.college_code || cleanedRow.college_name) {
                cleanedData.push(cleanedRow);
            }
        }

        // Write JSON to file
        fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));

        console.log(`✅ Converted ${filePath} to ${outputPath}`);
        console.log(`📊 Records: ${cleanedData.length}`);

        // Show sample of first record for verification
        if (cleanedData.length > 0) {
            console.log('📋 Sample record keys:', Object.keys(cleanedData[0]));
        }

        return cleanedData;
    } catch (error) {
        console.error(`❌ Error converting ${filePath}:`, error.message);
        return null;
    }
}

// Function to convert 2025 predicted cutoffs (might have different structure)
function convertPredictedCutoffs(filePath, outputPath) {
    try {
        console.log(`Converting predicted cutoffs ${filePath}...`);

        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawData.length < 2) {
            console.log('❌ Not enough data in predicted cutoffs file');
            return null;
        }

        // Find the header row (might not be the first row)
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(5, rawData.length); i++) {
            const row = rawData[i];
            if (row && row.some(cell => cell && cell.toString().toLowerCase().includes('college'))) {
                headerRowIndex = i;
                break;
            }
        }

        const headers = rawData[headerRowIndex].map(header => {
            if (!header) return null;
            return header.toString().trim().replace(/\r?\n/g, ' ').replace(/\s+/g, '_').toLowerCase();
        });

        const cleanedData = [];
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
            const row = rawData[i];
            const cleanedRow = {};

            headers.forEach((header, index) => {
                if (header && row[index] !== undefined) {
                    let value = row[index];

                    if (typeof value === 'string') {
                        value = value.trim();
                        if (value === 'NA' || value === '' || value === '-') {
                            value = null;
                        }
                    }

                    cleanedRow[header] = value;
                }
            });

            cleanedRow.phase = 'Predicted Phase 2';

            // Only add row if it has meaningful data
            if (Object.values(cleanedRow).some(val => val !== null && val !== undefined && val !== '')) {
                cleanedData.push(cleanedRow);
            }
        }

        fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));

        console.log(`✅ Converted predicted cutoffs to ${outputPath}`);
        console.log(`📊 Records: ${cleanedData.length}`);

        if (cleanedData.length > 0) {
            console.log('📋 Sample predicted cutoffs keys:', Object.keys(cleanedData[0]));
        }

        return cleanedData;
    } catch (error) {
        console.error(`❌ Error converting predicted cutoffs:`, error.message);
        return null;
    }
}

// Convert all Excel files
const files = [
    {
        input: './01_TGEAPCET_2024_FirstPhase_LastRanks.xlsx',
        output: './data/2024-phase1-cutoffs.json',
        phase: 'Phase 1',
        type: 'cutoffs'
    },
    {
        input: './02_TGEAPCET_2024_SecondPhase_LastRanks.xlsx',
        output: './data/2024-phase2-cutoffs.json',
        phase: 'Phase 2',
        type: 'cutoffs'
    },
    {
        input: './03_TGEAPCET_2024_FinalPhase_LastRanks.xlsx',
        output: './data/2024-phase3-cutoffs.json',
        phase: 'Phase 3',
        type: 'cutoffs'
    },
    {
        input: './TGEAPCET_2025_Phase2_Official_Cutoffs.xlsx',
        output: './data/2025-phase2-predicted-cutoffs.json',
        phase: 'Predicted Phase 2',
        type: 'predicted'
    }
];

// Ensure data directory exists
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

// Convert all files
const allData = {};
files.forEach(file => {
    let data;
    if (file.type === 'predicted') {
        data = convertPredictedCutoffs(file.input, file.output);
    } else {
        data = convertExcelToJSON(file.input, file.output, file.phase);
    }

    if (data) {
        allData[file.phase] = data;
    }
});

// Create consolidated previous year cutoffs file
const previousYearData = {
    'Phase 1': allData['Phase 1'] || [],
    'Phase 2': allData['Phase 2'] || [],
    'Phase 3': allData['Phase 3'] || []
};

fs.writeFileSync('./data/previous-year-cutoffs.json', JSON.stringify(previousYearData, null, 2));
console.log('✅ Created consolidated previous year cutoffs file');

console.log('\n🎉 All Excel files converted successfully!');
