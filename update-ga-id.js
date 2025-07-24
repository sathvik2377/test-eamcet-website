const fs = require('fs');
const path = require('path');

// Script to update Google Analytics ID across all HTML files
// Usage: node update-ga-id.js YOUR_ACTUAL_GA4_ID

function updateGoogleAnalyticsId(newGaId) {
    if (!newGaId || !newGaId.startsWith('G-')) {
        console.error('❌ Error: Please provide a valid GA4 Measurement ID (starts with G-)');
        console.log('📝 Usage: node update-ga-id.js G-XXXXXXXXXX');
        process.exit(1);
    }

    const htmlFiles = [
        'index.html',
        'closing-ranks.html', 
        'phase2-cutoffs.html',
        'previous-year-cutoffs.html',
        'college-predictor.html'
    ];

    console.log(`🔄 Updating Google Analytics ID to: ${newGaId}`);
    console.log('📁 Files to update:', htmlFiles.join(', '));

    let updatedCount = 0;

    htmlFiles.forEach(filename => {
        const filePath = path.join(__dirname, filename);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filename}`);
            return;
        }

        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace placeholder IDs
            const oldPatterns = [
                /G-XXXXXXXXXX/g,
                /YOUR_GA4_MEASUREMENT_ID/g
            ];

            let hasChanges = false;
            oldPatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    content = content.replace(pattern, newGaId);
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Updated: ${filename}`);
                updatedCount++;
            } else {
                console.log(`ℹ️  No changes needed: ${filename}`);
            }

        } catch (error) {
            console.error(`❌ Error updating ${filename}:`, error.message);
        }
    });

    console.log(`\n🎉 Update complete! Updated ${updatedCount} files.`);
    console.log(`📊 Your Google Analytics is now tracking with ID: ${newGaId}`);
    console.log('\n📋 Next steps:');
    console.log('1. Deploy your website');
    console.log('2. Visit analytics.google.com to see your data');
    console.log('3. Data will appear within 24-48 hours');
}

// Get GA ID from command line argument
const gaId = process.argv[2];

if (!gaId) {
    console.log('📊 Google Analytics ID Updater');
    console.log('================================');
    console.log('');
    console.log('📝 Usage: node update-ga-id.js YOUR_GA4_MEASUREMENT_ID');
    console.log('');
    console.log('📋 Steps to get your GA4 ID:');
    console.log('1. Go to analytics.google.com');
    console.log('2. Create account and property');
    console.log('3. Set up web data stream');
    console.log('4. Copy the Measurement ID (starts with G-)');
    console.log('5. Run: node update-ga-id.js G-XXXXXXXXXX');
    console.log('');
    console.log('💡 Example: node update-ga-id.js G-ABC123DEF4');
    process.exit(0);
}

updateGoogleAnalyticsId(gaId);
