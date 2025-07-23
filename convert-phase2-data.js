const XLSX = require('xlsx');
const fs = require('fs');

console.log('Converting Phase 2 data from TGEAPCET_2025_Phase2_Official_Cutoffs.xlsx...');

try {
    // Read the Excel file
    const workbook = XLSX.readFile('TGEAPCET_2025_Phase2_Official_Cutoffs.xlsx');
    const sheetName = workbook.SheetNames[0]; // 'Phase2_Cutoffs'
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to array of arrays
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    console.log(`Total rows in Excel: ${rawData.length}`);
    
    // Find the header row (row 3 based on our analysis)
    const headerRow = rawData[3];
    console.log('Headers:', headerRow);
    
    const convertedData = [];
    
    // Categories and their column mappings (based on header row)
    const categories = [
        { name: 'OC', boyCol: 4, girlCol: 5 },
        { name: 'BC_A', boyCol: 6, girlCol: 7 },
        { name: 'BC_B', boyCol: 8, girlCol: 9 },
        { name: 'BC_C', boyCol: 10, girlCol: 11 },
        { name: 'BC_D', boyCol: 12, girlCol: 13 },
        { name: 'BC_E', boyCol: 14, girlCol: 15 },
        { name: 'SC', boyCol: 16, girlCol: 17 },
        { name: 'ST', boyCol: 18, girlCol: 19 },
        { name: 'EWS', boyCol: 20, girlCol: 21 }
    ];
    
    // Process each data row (start from row 4, skip headers and title rows)
    for (let i = 4; i < rawData.length; i++) {
        const row = rawData[i];
        
        if (!row || row.length < 4) continue; // Skip empty rows
        
        const sno = row[0];
        const collegeCode = row[1];
        const collegeName = row[2];
        const branchName = row[3];
        
        if (!collegeCode || !collegeName || !branchName) continue;
        
        // Create entries for each category and gender
        categories.forEach(category => {
            // Boys entry
            const boyRank = row[category.boyCol];
            if (boyRank && boyRank !== 'NA' && boyRank !== '') {
                convertedData.push({
                    college_code: collegeCode,
                    college_name: collegeName,
                    branch_name: branchName,
                    category: category.name,
                    gender: 'Male',
                    predicted_cutoff: typeof boyRank === 'number' ? boyRank : parseInt(boyRank) || null
                });
            }
            
            // Girls entry
            const girlRank = row[category.girlCol];
            if (girlRank && girlRank !== 'NA' && girlRank !== '') {
                convertedData.push({
                    college_code: collegeCode,
                    college_name: collegeName,
                    branch_name: branchName,
                    category: category.name,
                    gender: 'Female',
                    predicted_cutoff: typeof girlRank === 'number' ? girlRank : parseInt(girlRank) || null
                });
            }
        });
    }
    
    console.log(`Converted ${convertedData.length} records`);
    
    // Sort by predicted cutoff (ascending)
    convertedData.sort((a, b) => {
        if (a.predicted_cutoff === null) return 1;
        if (b.predicted_cutoff === null) return -1;
        return a.predicted_cutoff - b.predicted_cutoff;
    });
    
    // Save to JSON file
    fs.writeFileSync('data/2025-phase2-predicted-cutoffs.json', JSON.stringify(convertedData, null, 2));
    
    console.log('✅ Phase 2 data converted successfully!');
    console.log(`📁 Saved to: data/2025-phase2-predicted-cutoffs.json`);
    console.log(`📊 Total records: ${convertedData.length}`);
    
    // Show sample data
    console.log('\n📋 Sample records:');
    convertedData.slice(0, 5).forEach((record, i) => {
        console.log(`${i + 1}. ${record.college_code} - ${record.branch_name} - ${record.category} ${record.gender} - Predicted Rank: ${record.predicted_cutoff}`);
    });
    
} catch (error) {
    console.error('❌ Error converting Phase 2 data:', error);
}
