const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Function to convert Excel file to structured JSON
function convertExcelToStructuredJson(inputFile, outputFile, options = {}) {
    try {
        console.log(`📂 Converting ${inputFile} to ${outputFile}...`);
        
        // Read the Excel file
        const workbook = XLSX.readFile(inputFile);
        
        // Get the first sheet name if not specified
        const targetSheet = options.sheetName || workbook.SheetNames[0];
        console.log(`📋 Using sheet: ${targetSheet}`);
        
        // Get the worksheet
        const worksheet = workbook.Sheets[targetSheet];
        
        // Convert to JSON without headers first
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        if (rawData.length === 0) {
            console.log('❌ No data found in the Excel file');
            return null;
        }

        // Find the header row (usually the first row with meaningful data)
        let headerRowIndex = 0;
        let headers = [];

        // Look for the header row
        for (let i = 0; i < Math.min(5, rawData.length); i++) {
            const row = rawData[i];
            const values = Object.values(row);

            // Check if this looks like a header row
            if (values.some(val => val && val.toString().toLowerCase().includes('code'))) {
                headerRowIndex = i;
                headers = values.map(val => val ? val.toString().trim().replace(/\r\n/g, ' ') : '');
                break;
            }
        }

        // If no header row found, use the first row
        if (headers.length === 0) {
            headers = Object.values(rawData[0]).map(val => val ? val.toString().trim() : '');
        }

        console.log(`📋 Found headers at row ${headerRowIndex + 1}:`, headers.slice(0, 5));

        // Process data rows (skip header row)
        const jsonData = [];
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
            const row = rawData[i];
            const values = Object.values(row);

            // Skip empty rows
            if (values.every(val => !val || val === '')) continue;

            const record = {};
            for (let j = 0; j < headers.length; j++) {
                if (j < values.length && headers[j]) {
                    record[headers[j]] = values[j];
                }
            }

            // Apply custom field mapping if provided
            if (options.fieldMapping) {
                const mappedRecord = {};
                for (const [originalField, mappedField] of Object.entries(options.fieldMapping)) {
                    if (record[originalField] !== undefined) {
                        mappedRecord[mappedField] = record[originalField];
                    }
                }
                // Only add if we have meaningful data
                if (Object.keys(mappedRecord).length > 0) {
                    jsonData.push(mappedRecord);
                }
            } else {
                jsonData.push(record);
            }
        }
        
        console.log(`📊 Converted ${jsonData.length} records`);
        
        // Save to JSON file
        fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
        console.log(`✅ Saved to ${outputFile}`);
        
        return jsonData;
    } catch (error) {
        console.error(`❌ Error converting ${inputFile}:`, error);
        return null;
    }
}

// Main conversion function
async function convertAllCutoffData() {
    console.log('🚀 Starting Cutoff Data Conversion...\n');
    
    // 1. Convert 2024 Phase 3 Final Cutoffs
    const phase3Mapping = {
        'Inst\r\n Code': 'college_code',
        'Institute Name': 'college_name',
        'Place': 'location',
        'Dist \r\nCode': 'district_code',
        'Co Education': 'coed_status',
        'College Type': 'college_type',
        'Year of Estab': 'established_year',
        'Branch Code': 'branch_code',
        'Branch Name': 'branch_name',
        'OC \r\nBOYS': 'OC_BOYS',
        'OC \r\nGIRLS': 'OC_GIRLS',
        'BC_A \r\nBOYS': 'BC_A_BOYS',
        'BC_A \r\nGIRLS': 'BC_A_GIRLS',
        'BC_B \r\nBOYS': 'BC_B_BOYS',
        'BC_B \r\nGIRLS': 'BC_B_GIRLS',
        'BC_C \r\nBOYS': 'BC_C_BOYS',
        'BC_C \r\nGIRLS': 'BC_C_GIRLS',
        'BC_D \r\nBOYS': 'BC_D_BOYS',
        'BC_D \r\nGIRLS': 'BC_D_GIRLS',
        'BC_E \r\nBOYS': 'BC_E_BOYS',
        'BC_E \r\nGIRLS': 'BC_E_GIRLS',
        'SC \r\nBOYS': 'SC_BOYS',
        'SC \r\nGIRLS': 'SC_GIRLS',
        'ST \r\nBOYS': 'ST_BOYS',
        'ST \r\nGIRLS': 'ST_GIRLS',
        'EWS \r\nBOYS': 'EWS_BOYS',
        'EWS \r\nGIRLS': 'EWS_GIRLS',
        'Tuition Fee': 'tuition_fee',
        'Affiliated To': 'affiliated_to'
    };
    
    const phase3Data = convertExcelToStructuredJson(
        './03_TGEAPCET_2024_FinalPhase_LastRanks.xlsx',
        './data/2024-phase3-cutoffs.json',
        {
            sheetName: 'TGEAPCET_FINAL PHASE',
            fieldMapping: phase3Mapping
        }
    );
    
    // 2. Convert 2025 Phase 1 All Closing Ranks
    const phase1Mapping = {
        'College Code': 'college_code',
        'College Name': 'college_name',
        'Branch Code': 'branch_code',
        'Branch Name': 'branch_name',
        'OC Boys': 'OC_BOYS',
        'OC Girls': 'OC_GIRLS',
        'BC-A Boys': 'BC_A_BOYS',
        'BC-A Girls': 'BC_A_GIRLS',
        'BC-B Boys': 'BC_B_BOYS',
        'BC-B Girls': 'BC_B_GIRLS',
        'BC-C Boys': 'BC_C_BOYS',
        'BC-C Girls': 'BC_C_GIRLS',
        'BC-D Boys': 'BC_D_BOYS',
        'BC-D Girls': 'BC_D_GIRLS',
        'BC-E Boys': 'BC_E_BOYS',
        'BC-E Girls': 'BC_E_GIRLS',
        'SC Boys': 'SC_BOYS',
        'SC Girls': 'SC_GIRLS',
        'ST Boys': 'ST_BOYS',
        'ST Girls': 'ST_GIRLS',
        'EWS Boys': 'EWS_BOYS',
        'EWS Girls': 'EWS_GIRLS'
    };
    
    const phase1Data = convertExcelToStructuredJson(
        './all_closing_ranks.xlsx',
        './data/2025-phase1-cutoffs.json',
        {
            sheetName: 'Closing Ranks',
            fieldMapping: phase1Mapping
        }
    );
    
    // 3. Convert 2025 Phase 2 Official Cutoffs
    const phase2Mapping = {
        'College Code': 'college_code',
        'College Name': 'college_name',
        'Branch Code': 'branch_code',
        'Branch Name': 'branch_name',
        'OC Boys': 'OC_BOYS',
        'OC Girls': 'OC_GIRLS',
        'BC-A Boys': 'BC_A_BOYS',
        'BC-A Girls': 'BC_A_GIRLS',
        'BC-B Boys': 'BC_B_BOYS',
        'BC-B Girls': 'BC_B_GIRLS',
        'BC-C Boys': 'BC_C_BOYS',
        'BC-C Girls': 'BC_C_GIRLS',
        'BC-D Boys': 'BC_D_BOYS',
        'BC-D Girls': 'BC_D_GIRLS',
        'BC-E Boys': 'BC_E_BOYS',
        'BC-E Girls': 'BC_E_GIRLS',
        'SC Boys': 'SC_BOYS',
        'SC Girls': 'SC_GIRLS',
        'ST Boys': 'ST_BOYS',
        'ST Girls': 'ST_GIRLS',
        'EWS Boys': 'EWS_BOYS',
        'EWS Girls': 'EWS_GIRLS'
    };
    
    const phase2Data = convertExcelToStructuredJson(
        './TGEAPCET_2025_Phase2_Official_Cutoffs.xlsx',
        './data/2025-phase2-cutoffs.json',
        {
            sheetName: 'Phase2_Cutoffs',
            fieldMapping: phase2Mapping
        }
    );
    
    console.log('\n📊 Conversion Summary:');
    console.log(`✅ 2024 Phase 3 Final Cutoffs: ${phase3Data ? phase3Data.length : 0} records`);
    console.log(`✅ 2025 Phase 1 All Closing Ranks: ${phase1Data ? phase1Data.length : 0} records`);
    console.log(`✅ 2025 Phase 2 Official Cutoffs: ${phase2Data ? phase2Data.length : 0} records`);
    
    console.log('\n🎉 All conversions completed!');
}

// Run the conversion
if (require.main === module) {
    convertAllCutoffData().catch(console.error);
}

module.exports = { convertExcelToStructuredJson };
