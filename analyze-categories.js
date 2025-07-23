const fs = require('fs');
const path = require('path');

function getAllCategories() {
    const categories = new Set();
    const dataDir = '2025 phase 1 data';
    const colleges = fs.readdirSync(dataDir);
    
    for (const collegeDir of colleges) {
        const collegePath = path.join(dataDir, collegeDir);
        if (!fs.statSync(collegePath).isDirectory()) continue;
        
        const branchFiles = fs.readdirSync(collegePath).filter(f => f.endsWith('.csv'));
        for (const branchFile of branchFiles) {
            const filePath = path.join(collegePath, branchFile);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.trim().split('\n');
                
                for (let i = 1; i < lines.length; i++) {
                    const values = [];
                    let current = '';
                    let inQuotes = false;
                    
                    for (let j = 0; j < lines[i].length; j++) {
                        const char = lines[i][j];
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
                    
                    if (values.length >= 8) {
                        const category = values[7].replace(/"/g, '');
                        if (category && category !== 'seatcategory') {
                            categories.add(category);
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error.message);
            }
        }
    }
    
    return Array.from(categories).sort();
}

console.log('All seat categories found:');
const categories = getAllCategories();
categories.forEach(cat => console.log(cat));

console.log(`\nTotal categories: ${categories.length}`);

// Check which categories are not mapped
const mappedCategories = [
    'OC_GEN_OU', 'OC_GIRLS_OU', 'OC_GEN_UR', 'OC_GIRLS_UR',
    'BC_A_GEN_OU', 'BC_A_GIRLS_OU', 'BC_A_GEN_UR', 'BC_A_GIRLS_UR',
    'BC_B_GEN_OU', 'BC_B_GIRLS_OU', 'BC_B_GEN_UR', 'BC_B_GIRLS_UR',
    'BC_C_GEN_OU', 'BC_C_GIRLS_OU', 'BC_C_GEN_UR', 'BC_C_GIRLS_UR',
    'BC_D_GEN_OU', 'BC_D_GIRLS_OU', 'BC_D_GEN_UR', 'BC_D_GIRLS_UR',
    'BC_E_GEN_OU', 'BC_E_GIRLS_OU', 'BC_E_GEN_UR', 'BC_E_GIRLS_UR',
    'SC_GEN_OU', 'SC_GIRLS_OU', 'SC_III_GEN_OU', 'SC_III_GIRLS_OU',
    'ST_GEN_OU', 'ST_GIRLS_OU',
    'EWS_GEN_OU', 'EWS_GIRLS_OU', 'EWS_GEN_UR', 'EWS_GIRLS_UR'
];

console.log('\nUnmapped categories:');
const unmapped = categories.filter(cat => !mappedCategories.includes(cat));
unmapped.forEach(cat => console.log(cat));
