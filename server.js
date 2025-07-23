const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API endpoints for closing ranks and phase 2 cutoffs
app.get('/api/closing-ranks', (req, res) => {
    try {
        console.log('📋 Getting closing ranks data...');
        const dataPath = path.join(__dirname, 'data', 'closing-ranks-2025-phase1.json');

        if (!fs.existsSync(dataPath)) {
            console.log('❌ Closing ranks data file not found:', dataPath);
            return res.json([]);
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`✅ Loaded ${data.length} closing ranks records`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error reading closing ranks:', error);
        res.status(500).json({ error: 'Failed to read closing ranks data' });
    }
});

app.get('/api/phase2-cutoffs', (req, res) => {
    try {
        console.log('📋 Getting Phase 2 cutoffs data...');
        const dataPath = path.join(__dirname, 'data', 'phase2-cutoffs.json');

        if (!fs.existsSync(dataPath)) {
            console.log('❌ Phase 2 cutoffs data file not found:', dataPath);
            return res.json([]);
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`✅ Loaded ${data.length} Phase 2 cutoffs records`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error reading Phase 2 cutoffs:', error);
        res.status(500).json({ error: 'Failed to read Phase 2 cutoffs data' });
    }
});

app.get('/api/previous-year-cutoffs', (req, res) => {
    try {
        console.log('📋 Getting previous year cutoffs data...');
        const dataPath = path.join(__dirname, 'data', 'previous-year-cutoffs.json');

        if (!fs.existsSync(dataPath)) {
            console.log('❌ Previous year cutoffs data file not found:', dataPath);
            return res.json({});
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log(`✅ Loaded previous year cutoffs data with ${Object.keys(data).length} phases`);
        res.json(data);
    } catch (error) {
        console.error('❌ Error reading previous year cutoffs:', error);
        res.status(500).json({ error: 'Failed to read previous year cutoffs data' });
    }
});

// Data directory
const DATA_DIR = path.join(__dirname, '2025 phase 1 data');

// Debug logging
console.log('🔍 Current directory:', __dirname);
console.log('📂 Data directory path:', DATA_DIR);
console.log('📁 Data directory exists:', fs.existsSync(DATA_DIR));

// API Routes

// Get list of all colleges
app.get('/api/colleges', (req, res) => {
    try {
        console.log('📋 Getting colleges list...');
        if (!fs.existsSync(DATA_DIR)) {
            console.log('❌ Data directory does not exist:', DATA_DIR);
            return res.json([]);
        }

        const colleges = fs.readdirSync(DATA_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();

        console.log(`✅ Found ${colleges.length} colleges`);
        res.json(colleges);
    } catch (error) {
        console.error('❌ Error reading colleges:', error);
        res.status(500).json({ error: 'Failed to read colleges' });
    }
});

// Get list of branches (CSV files) for a specific college
app.get('/api/colleges/:collegeDir/branches', (req, res) => {
    try {
        const collegeDir = decodeURIComponent(req.params.collegeDir);
        const collegePath = path.join(DATA_DIR, collegeDir);

        if (!fs.existsSync(collegePath)) {
            return res.json([]);
        }

        const branches = fs.readdirSync(collegePath)
            .filter(file => file.endsWith('.csv'))
            .sort();

        res.json(branches);
    } catch (error) {
        console.error('Error reading branches:', error);
        res.status(500).json({ error: 'Failed to read branches' });
    }
});

// Get CSV data for a specific college and branch
app.get('/api/data/:collegeDir/:branchFile', (req, res) => {
    try {
        const collegeDir = decodeURIComponent(req.params.collegeDir);
        const branchFile = decodeURIComponent(req.params.branchFile);
        const filePath = path.join(DATA_DIR, collegeDir, branchFile);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        const csvContent = fs.readFileSync(filePath, 'utf8');
        res.type('text/csv').send(csvContent);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ error: 'Failed to read CSV file' });
    }
});

// Get all data as JSON (for faster loading)
app.get('/api/all-data', (req, res) => {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            return res.json([]);
        }

        const allData = [];
        const colleges = fs.readdirSync(DATA_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const collegeDir of colleges) {
            const collegePath = path.join(DATA_DIR, collegeDir);
            const collegeName = collegeDir.replace(/_/g, ' ');
            
            const csvFiles = fs.readdirSync(collegePath)
                .filter(file => file.endsWith('.csv'));

            for (const csvFile of csvFiles) {
                const branchName = csvFile.replace('.csv', '').replace(/_/g, ' ');
                const filePath = path.join(collegePath, csvFile);
                
                try {
                    const csvContent = fs.readFileSync(filePath, 'utf8');
                    const records = parseCSV(csvContent);
                    
                    // Add college and branch info to each record
                    records.forEach(record => {
                        record.college = collegeName;
                        record.branch = branchName;
                    });
                    
                    allData.push(...records);
                } catch (fileError) {
                    console.warn(`Could not read ${filePath}:`, fileError.message);
                }
            }
        }

        res.json(allData);
    } catch (error) {
        console.error('Error loading all data:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

// Get statistics
app.get('/api/stats', (req, res) => {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            return res.json({ colleges: 0, branches: 0, records: 0 });
        }

        let totalRecords = 0;
        let totalBranches = 0;
        const colleges = fs.readdirSync(DATA_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory());

        for (const college of colleges) {
            const collegePath = path.join(DATA_DIR, college.name);
            const csvFiles = fs.readdirSync(collegePath)
                .filter(file => file.endsWith('.csv'));
            
            totalBranches += csvFiles.length;

            for (const csvFile of csvFiles) {
                const filePath = path.join(collegePath, csvFile);
                try {
                    const csvContent = fs.readFileSync(filePath, 'utf8');
                    const lines = csvContent.trim().split('\n');
                    totalRecords += Math.max(0, lines.length - 1); // Subtract header
                } catch (fileError) {
                    console.warn(`Could not read ${filePath}:`, fileError.message);
                }
            }
        }

        res.json({
            colleges: colleges.length,
            branches: totalBranches,
            records: totalRecords
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// Utility function to parse CSV
function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const record = {};
            headers.forEach((header, index) => {
                record[header] = values[index].replace(/"/g, '').trim();
            });
            data.push(record);
        }
    }
    
    return data;
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TS EAMCET 2025 Results Server running on http://localhost:${PORT}`);
    console.log(`📊 Data directory: ${DATA_DIR}`);
    
    // Check if data directory exists
    if (!fs.existsSync(DATA_DIR)) {
        console.warn('⚠️  Data directory not found. Please ensure the "2025 phase 1 data" folder exists.');
    } else {
        const colleges = fs.readdirSync(DATA_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory()).length;
        console.log(`📚 Found ${colleges} colleges in data directory`);
    }
});

module.exports = app;
