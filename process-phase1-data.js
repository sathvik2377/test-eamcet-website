const fs = require('fs');
const path = require('path');

// Function to parse CSV content
function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        return row;
    });
}

// Function to extract closing ranks from student data
function extractClosingRanks(students) {
    const closingRanks = {};
    
    // Group students by seat category and find the highest rank (closing rank)
    students.forEach(student => {
        const category = student.seatcategory;
        const rank = parseInt(student.rank);
        
        if (!isNaN(rank)) {
            if (!closingRanks[category] || rank > closingRanks[category]) {
                closingRanks[category] = rank;
            }
        }
    });
    
    return closingRanks;
}

// Function to map seat categories to standard format
function mapSeatCategory(category) {
    // Exclude CAP and PH categories
    if (category.includes('_CAP_') || category.includes('_PH')) {
        return null; // Skip these categories
    }

    // Handle OC categories
    if (category.startsWith('OC_')) {
        if (category.includes('GIRLS')) return 'OC Girls';
        return 'OC Boys';
    }

    // Handle BC categories
    if (category.startsWith('BC_A_')) {
        if (category.includes('GIRLS')) return 'BC-A Girls';
        return 'BC-A Boys';
    }
    if (category.startsWith('BC_B_')) {
        if (category.includes('GIRLS')) return 'BC-B Girls';
        return 'BC-B Boys';
    }
    if (category.startsWith('BC_C_')) {
        if (category.includes('GIRLS')) return 'BC-C Girls';
        return 'BC-C Boys';
    }
    if (category.startsWith('BC_D_')) {
        if (category.includes('GIRLS')) return 'BC-D Girls';
        return 'BC-D Boys';
    }
    if (category.startsWith('BC_E_')) {
        if (category.includes('GIRLS')) return 'BC-E Girls';
        return 'BC-E Boys';
    }

    // Handle SC categories (all subcategories map to SC)
    if (category.startsWith('SC_')) {
        if (category.includes('GIRLS')) return 'SC Girls';
        return 'SC Boys';
    }

    // Handle ST categories
    if (category.startsWith('ST_')) {
        if (category.includes('GIRLS')) return 'ST Girls';
        return 'ST Boys';
    }

    // Handle EWS categories
    if (category.startsWith('EWS_')) {
        if (category.includes('GIRLS')) return 'EWS GIRLS';
        return 'EWS GEN OU';
    }

    // Handle minority categories (MUS, CHR, SIK, etc.)
    if (category.startsWith('MUS_') || category.startsWith('CHR_') ||
        category.startsWith('SIK_') || category.startsWith('JAI_') ||
        category.startsWith('BUD_') || category.startsWith('PAR_')) {
        // Map all minorities to OC for now (as they compete in general category)
        if (category.includes('GIRLS')) return 'OC Girls';
        return 'OC Boys';
    }

    // Return unmapped category as is (for debugging)
    return category;
}

// Main processing function
async function processPhase1Data() {
    const dataDir = '2025 phase 1 data';
    const colleges = fs.readdirSync(dataDir);
    const allClosingRanks = [];
    
    console.log(`Processing ${colleges.length} colleges...`);
    
    for (const collegeDir of colleges) {
        const collegePath = path.join(dataDir, collegeDir);
        if (!fs.statSync(collegePath).isDirectory()) continue;
        
        // Extract college code and name
        const collegeCode = collegeDir.split('_')[0];
        const collegeName = collegeDir.substring(collegeCode.length + 1).replace(/_/g, ' ');
        
        console.log(`Processing ${collegeCode}: ${collegeName}`);
        
        const branchFiles = fs.readdirSync(collegePath).filter(f => f.endsWith('.csv'));
        
        for (const branchFile of branchFiles) {
            const branchName = branchFile.replace('.csv', '').replace(/_/g, ' ');
            const filePath = path.join(collegePath, branchFile);
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const students = parseCSV(content);
                const closingRanks = extractClosingRanks(students);
                
                // Create a row for this college-branch combination
                const row = {
                    'College Code': collegeCode,
                    'College Name': collegeName,
                    'Branch Name': branchName,
                    'OC Boys': '',
                    'OC Girls': '',
                    'BC-A Boys': '',
                    'BC-A Girls': '',
                    'BC-B Boys': '',
                    'BC-B Girls': '',
                    'BC-C Boys': '',
                    'BC-C Girls': '',
                    'BC-D Boys': '',
                    'BC-D Girls': '',
                    'BC-E Boys': '',
                    'BC-E Girls': '',
                    'SC Boys': '',
                    'SC Girls': '',
                    'ST Boys': '',
                    'ST Girls': '',
                    'EWS GEN OU': '',
                    'EWS GIRLS': ''
                };
                
                // Fill in the closing ranks
                Object.entries(closingRanks).forEach(([category, rank]) => {
                    const mappedCategory = mapSeatCategory(category);

                    // Skip excluded categories (CAP, PH)
                    if (mappedCategory === null) {
                        return;
                    }

                    if (row.hasOwnProperty(mappedCategory)) {
                        // Keep the highest rank if multiple entries exist
                        if (!row[mappedCategory] || rank > parseInt(row[mappedCategory])) {
                            row[mappedCategory] = rank.toString();
                        }
                    }
                });
                
                allClosingRanks.push(row);
                
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error.message);
            }
        }
    }
    
    console.log(`Processed ${allClosingRanks.length} college-branch combinations`);
    
    // Save to JSON file
    fs.writeFileSync('data/closing-ranks-2025-phase1.json', JSON.stringify(allClosingRanks, null, 2));
    console.log('Saved to data/closing-ranks-2025-phase1.json');
    
    return allClosingRanks;
}

// Run the processing
if (require.main === module) {
    processPhase1Data().catch(console.error);
}

module.exports = { processPhase1Data };
