const XLSX = require('xlsx');
const fs = require('fs');

console.log('Converting Phase 1 data from all_closing_ranks.xlsx...');

try {
    // Read the Excel file
    const workbook = XLSX.readFile('all_closing_ranks.xlsx');
    const sheetName = workbook.SheetNames[0]; // 'Closing Ranks'
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to array of arrays
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    console.log(`Total rows in Excel: ${rawData.length}`);
    
    // Skip header row (row 0) and process data
    const headerRow = rawData[0];
    console.log('Headers:', headerRow);
    
    const convertedData = [];
    
    // Categories and their column mappings
    const categories = [
        { name: 'OC', boyCol: 3, girlCol: 4 },
        { name: 'BC_A', boyCol: 5, girlCol: 6 },
        { name: 'BC_B', boyCol: 7, girlCol: 8 },
        { name: 'BC_C', boyCol: 9, girlCol: 10 },
        { name: 'BC_D', boyCol: 11, girlCol: 12 },
        { name: 'BC_E', boyCol: 13, girlCol: 14 },
        { name: 'SC', boyCol: 15, girlCol: 16 },
        { name: 'ST', boyCol: 17, girlCol: 18 },
        { name: 'EWS', boyCol: 19, girlCol: 20 }
    ];
    
    // Process each data row (skip header)
    for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        
        if (!row || row.length < 3) continue; // Skip empty rows
        
        const collegeCode = row[0];
        const collegeName = row[1];
        const branchName = row[2];
        
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
                    closing_rank: typeof boyRank === 'number' ? boyRank : parseInt(boyRank) || null
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
                    closing_rank: typeof girlRank === 'number' ? girlRank : parseInt(girlRank) || null
                });
            }
        });
    }
    
    console.log(`Converted ${convertedData.length} records`);
    
    // Sort by closing rank (ascending)
    convertedData.sort((a, b) => {
        if (a.closing_rank === null) return 1;
        if (b.closing_rank === null) return -1;
        return a.closing_rank - b.closing_rank;
    });
    
    // Save to JSON file
    fs.writeFileSync('data/2024-phase1-cutoffs.json', JSON.stringify(convertedData, null, 2));
    
    console.log('✅ Phase 1 data converted successfully!');
    console.log(`📁 Saved to: data/2024-phase1-cutoffs.json`);
    console.log(`📊 Total records: ${convertedData.length}`);
    
    // Show sample data
    console.log('\n📋 Sample records:');
    convertedData.slice(0, 5).forEach((record, i) => {
        console.log(`${i + 1}. ${record.college_code} - ${record.branch_name} - ${record.category} ${record.gender} - Rank: ${record.closing_rank}`);
    });
    
} catch (error) {
    console.error('❌ Error converting Phase 1 data:', error);
}
