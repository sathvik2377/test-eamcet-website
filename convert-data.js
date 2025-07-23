const fs = require('fs');
const path = require('path');

// Data directory
const DATA_DIR = path.join(__dirname, '2025 phase 1 data');
const OUTPUT_DIR = path.join(__dirname, 'data');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Function to parse CSV
function parseCSV(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length === headers.length) {
            const record = {};
            headers.forEach((header, index) => {
                record[header.toLowerCase().replace(/\s+/g, '')] = values[index];
            });
            records.push(record);
        }
    }
    
    return records;
}

// Convert all CSV files to JSON
function convertAllData() {
    console.log('🔄 Converting CSV data to JSON...');
    
    if (!fs.existsSync(DATA_DIR)) {
        console.error('❌ Data directory not found:', DATA_DIR);
        return;
    }
    
    const allData = [];
    const colleges = fs.readdirSync(DATA_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`📚 Found ${colleges.length} colleges`);
    
    colleges.forEach(collegeDir => {
        const collegePath = path.join(DATA_DIR, collegeDir);
        const csvFiles = fs.readdirSync(collegePath)
            .filter(file => file.endsWith('.csv'));
        
        console.log(`📋 Processing ${collegeDir}: ${csvFiles.length} branches`);
        
        csvFiles.forEach(csvFile => {
            const csvPath = path.join(collegePath, csvFile);
            const csvContent = fs.readFileSync(csvPath, 'utf8');
            const records = parseCSV(csvContent);
            
            // Add college and branch info to each record
            records.forEach(record => {
                record.college = collegeDir.replace(/_/g, ' ');
                record.branch = csvFile.replace('.csv', '').replace(/_/g, ' ');
            });
            
            allData.push(...records);
        });
    });
    
    console.log(`✅ Converted ${allData.length} total records`);
    
    // Save to JSON file
    const outputPath = path.join(OUTPUT_DIR, 'all-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    
    console.log(`💾 Saved to: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    return allData;
}

// Run conversion
if (require.main === module) {
    convertAllData();
}

module.exports = { convertAllData };
