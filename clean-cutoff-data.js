const fs = require('fs');
const path = require('path');

// Official branch code mappings based on TS EAMCET 2024 data
const branchCodeMappings = {
    // Computer Science variants
    'COMPUTER SCIENCE AND ENGINEERING': 'CSE',
    'COMPUTER SCIENCE AND ENGINEERING ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'CSM',
    'COMPUTER SCIENCE AND ENGINEERING DATA SCIENCE': 'CSD',
    'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE': 'AID',
    'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AIM',
    'ARTIFICIAL INTELLIGENCE': 'AI',
    'CSE IoT AND CYBER SECURITY INCLUDING BLOCK CHAIN TECHNOLOGY': 'CSC',
    'COMPUTER SCIENCE AND ENGG ARTIFICIAL INTELLIGENCE': 'CSM',
    'INFORMATION TECHNOLOGY': 'IT',
    
    // Electronics variants
    'ELECTRONICS AND COMMUNICATION ENGINEERING': 'ECE',
    'ELECTRONICS AND TELECOMMUNICATION ENGG': 'ETE',
    'ELECTRONICS AND INSTRUMENTATION ENGINEERING': 'EIE',
    'ELECTRONICS AND ELECTRICAL ENGINEERING': 'EEE',
    
    // Mechanical and Civil
    'MECHANICAL ENGINEERING': 'ME',
    'CIVIL ENGINEERING': 'CE',
    'ELECTRICAL AND ELECTRONICS ENGINEERING': 'EEE',
    
    // Other branches
    'CHEMICAL ENGINEERING': 'CHE',
    'BIOTECHNOLOGY': 'BT',
    'BIOMEDICAL ENGINEERING': 'BME',
    'AERONAUTICAL ENGINEERING': 'AE',
    'AUTOMOBILE ENGINEERING': 'AUTO',
    'MINING ENGINEERING': 'MIN',
    'METALLURGICAL ENGINEERING': 'MET',
    'PETROLEUM ENGINEERING': 'PE',
    'TEXTILE TECHNOLOGY': 'TT',
    'FOOD TECHNOLOGY': 'FT',
    'DAIRYING': 'DT',
    'AGRICULTURAL ENGINEERING': 'AGE',
    'FASHION TECHNOLOGY': 'FT',
    'PRINTING TECHNOLOGY': 'PT'
};

// Function to get branch code
function getBranchCode(branchName) {
    if (!branchName) return '';
    
    // Direct mapping
    if (branchCodeMappings[branchName]) {
        return branchCodeMappings[branchName];
    }
    
    // Fuzzy matching for variations
    const upperBranch = branchName.toUpperCase();
    
    // CSE variants
    if (upperBranch.includes('COMPUTER SCIENCE') && upperBranch.includes('ARTIFICIAL INTELLIGENCE') && upperBranch.includes('MACHINE LEARNING')) {
        return 'CSM';
    }
    if (upperBranch.includes('COMPUTER SCIENCE') && upperBranch.includes('DATA SCIENCE')) {
        return 'CSD';
    }
    if (upperBranch.includes('ARTIFICIAL INTELLIGENCE') && upperBranch.includes('DATA SCIENCE')) {
        return 'AID';
    }
    if (upperBranch.includes('ARTIFICIAL INTELLIGENCE') && upperBranch.includes('MACHINE LEARNING')) {
        return 'AIM';
    }
    if (upperBranch.includes('COMPUTER SCIENCE')) {
        return 'CSE';
    }
    if (upperBranch.includes('INFORMATION TECHNOLOGY')) {
        return 'IT';
    }
    
    // Electronics variants
    if (upperBranch.includes('ELECTRONICS') && upperBranch.includes('COMMUNICATION')) {
        return 'ECE';
    }
    if (upperBranch.includes('ELECTRONICS') && upperBranch.includes('TELECOMMUNICATION')) {
        return 'ETE';
    }
    if (upperBranch.includes('ELECTRONICS') && upperBranch.includes('INSTRUMENTATION')) {
        return 'EIE';
    }
    if (upperBranch.includes('ELECTRICAL') && upperBranch.includes('ELECTRONICS')) {
        return 'EEE';
    }
    
    // Other branches
    if (upperBranch.includes('MECHANICAL')) {
        return 'ME';
    }
    if (upperBranch.includes('CIVIL')) {
        return 'CE';
    }
    if (upperBranch.includes('CHEMICAL')) {
        return 'CHE';
    }
    if (upperBranch.includes('BIOTECHNOLOGY')) {
        return 'BT';
    }
    if (upperBranch.includes('BIOMEDICAL')) {
        return 'BME';
    }
    if (upperBranch.includes('AERONAUTICAL')) {
        return 'AE';
    }
    if (upperBranch.includes('AUTOMOBILE')) {
        return 'AUTO';
    }
    
    // Default: create abbreviation from first letters
    return branchName.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 4);
}

// Function to clean rank values
function cleanRankValue(value) {
    if (!value || value === 'NA' || value === '') {
        return '-';
    }
    
    const numValue = parseInt(value);
    
    // Replace 400k+ values with '-'
    if (numValue >= 400000) {
        return '-';
    }
    
    return value;
}

// Function to count valid data points for a college-branch combination
function countValidDataPoints(record) {
    const rankColumns = [
        'OC Boys', 'OC Girls', 'EWS GEN OU', 'EWS GIRLS',
        'SC Boys', 'SC Girls', 'ST Boys', 'ST Girls',
        'BC-A Boys', 'BC-A Girls', 'BC-B Boys', 'BC-B Girls',
        'BC-C Boys', 'BC-C Girls', 'BC-D Boys', 'BC-D Girls',
        'BC-E Boys', 'BC-E Girls'
    ];
    
    let validCount = 0;
    rankColumns.forEach(col => {
        const value = record[col];
        if (value && value !== 'NA' && value !== '' && parseInt(value) < 400000) {
            validCount++;
        }
    });
    
    return validCount;
}

// Function to process closing ranks data
function processClosingRanks() {
    console.log('🔄 Processing closing ranks data...');
    
    const filePath = path.join(__dirname, 'data', 'closing-ranks-2025-phase1.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`📊 Original records: ${data.length}`);
    
    // Clean and filter data
    const cleanedData = data
        .map(record => {
            // Clean all rank values
            const cleanedRecord = { ...record };
            Object.keys(cleanedRecord).forEach(key => {
                if (key !== 'College Code' && key !== 'College Name' && key !== 'Branch Name') {
                    cleanedRecord[key] = cleanRankValue(cleanedRecord[key]);
                }
            });
            
            // Add branch code
            cleanedRecord['Branch Code'] = getBranchCode(record['Branch Name']);
            
            return cleanedRecord;
        })
        .filter(record => {
            // Filter out records with insufficient data
            const validDataPoints = countValidDataPoints(record);
            return validDataPoints >= 10; // At least 10 out of 18 columns should have valid data
        });
    
    console.log(`✅ Cleaned records: ${cleanedData.length}`);
    console.log(`🗑️ Removed records: ${data.length - cleanedData.length}`);
    
    // Save cleaned data
    fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2));
    console.log('💾 Saved cleaned closing ranks data');
    
    return cleanedData;
}

// Function to process phase2 cutoffs data
function processPhase2Cutoffs() {
    console.log('🔄 Processing phase2 cutoffs data...');

    const filePath = path.join(__dirname, 'data', 'phase2-cutoffs.json');
    if (!fs.existsSync(filePath)) {
        console.log('⚠️ Phase2 cutoffs file not found, skipping...');
        return [];
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📊 Original phase2 records: ${data.length}`);

    // Clean and enhance data
    const cleanedData = data
        .map(record => {
            // Clean all rank values
            const cleanedRecord = { ...record };
            Object.keys(cleanedRecord).forEach(key => {
                if (!['College_Code', 'College_Name', 'Branch_Code', 'Branch_Name'].includes(key)) {
                    cleanedRecord[key] = cleanRankValue(cleanedRecord[key]);
                }
            });

            // Add missing codes if not present
            if (!cleanedRecord['College_Code'] && cleanedRecord['College_Name']) {
                // Extract college code from name or create one
                const words = cleanedRecord['College_Name'].split(' ');
                cleanedRecord['College_Code'] = words.map(w => w.charAt(0)).join('').toUpperCase().substring(0, 4);
            }

            if (!cleanedRecord['Branch_Code'] && cleanedRecord['Branch_Name']) {
                cleanedRecord['Branch_Code'] = getBranchCode(cleanedRecord['Branch_Name']);
            }

            return cleanedRecord;
        })
        .filter(record => {
            // Filter out records with insufficient data (adapt column names for phase2)
            const rankColumns = Object.keys(record).filter(key =>
                !['College_Code', 'College_Name', 'Branch_Code', 'Branch_Name'].includes(key)
            );

            let validCount = 0;
            rankColumns.forEach(col => {
                const value = record[col];
                if (value && value !== 'NA' && value !== '' && value !== '-' && parseInt(value) < 400000) {
                    validCount++;
                }
            });

            return validCount >= Math.min(10, Math.floor(rankColumns.length * 0.5)); // At least 50% valid data
        });

    console.log(`✅ Cleaned phase2 records: ${cleanedData.length}`);
    console.log(`🗑️ Removed phase2 records: ${data.length - cleanedData.length}`);

    // Save cleaned data
    fs.writeFileSync(filePath, JSON.stringify(cleanedData, null, 2));
    console.log('💾 Saved cleaned phase2 cutoffs data');

    return cleanedData;
}

// Function to process previous year cutoffs data
function processPreviousYearCutoffs() {
    console.log('🔄 Processing previous year cutoffs data...');

    const filePath = path.join(__dirname, 'data', 'previous-year-cutoffs.json');
    if (!fs.existsSync(filePath)) {
        console.log('⚠️ Previous year cutoffs file not found, skipping...');
        return [];
    }

    console.log('⚠️ Previous year cutoffs has complex structure, skipping for now...');
    console.log('💡 Manual processing required for previous year data');

    return [];
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting data cleaning process...');

        const cleanedClosingRanks = processClosingRanks();
        const cleanedPhase2 = processPhase2Cutoffs();
        const cleanedPreviousYear = processPreviousYearCutoffs();

        console.log('✅ Data cleaning completed successfully!');
        console.log(`📈 Final datasets:`);
        console.log(`   - Closing ranks: ${cleanedClosingRanks.length} records`);
        console.log(`   - Phase 2: ${cleanedPhase2.length} records`);
        console.log(`   - Previous year: ${cleanedPreviousYear.length} records`);

    } catch (error) {
        console.error('❌ Error during data cleaning:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    cleanRankValue,
    getBranchCode,
    countValidDataPoints
};
