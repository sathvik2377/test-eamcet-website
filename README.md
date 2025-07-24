# TS EAMCET 2025 Cutoffs & College Predictor

A comprehensive web application for TS EAMCET (Telangana State Engineering, Agriculture & Medical Common Entrance Test) cutoff analysis and college prediction. Features multiple themed pages, advanced analytics, and comprehensive search functionality.

## 🎯 Features

### 📊 Cutoff Analysis

- **Phase 1 Closing Ranks**: Real-time 2025 Phase 1 cutoff data with official branch codes
- **Phase 2 Predictions**: AI-powered Phase 2 cutoff predictions
- **Previous Year Data**: Historical cutoffs for trend analysis (2024 data)
- **Advanced Filtering**: Filter by college, branch, category, and rank ranges
- **Smart Sorting**: Proper numerical rank sorting with NA values handled correctly

### 🔍 Search & Navigation

- **Smart Search**: Find colleges and branches quickly with autocomplete
- **Category Filters**: Filter by caste categories (OC, SC, ST, BC-A/B/C/D/E, EWS)
- **Responsive Design**: Optimized for mobile and desktop with consistent layouts
- **Export Functionality**: Download filtered results as CSV
- **Fixed Scrolling**: Resolved scrolling issues across all pages

### 🎯 College Predictor

- **Rank-based Prediction**: Enter your rank to get college suggestions
- **Category-wise Results**: Personalized results based on your category
- **Probability Analysis**: Get admission probability for each college

### 📈 Analytics & Tracking

- **Google Analytics 4**: Comprehensive user behavior tracking
- **Real-time Monitoring**: Track page views, user flow, and popular searches
- **Performance Insights**: Monitor site performance and user engagement

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom themes
- **Backend**: Node.js with Express
- **Data**: JSON-based data storage with data cleaning scripts
- **Analytics**: Google Analytics 4 (GA4) - ID: G-BEX3M5R4MZ

## 🎨 Themes & Design

The website features multiple themed pages with unique visual identities:

- **Main Page**: Student Results Finder theme with blue gradients
- **Phase 1**: Closing Ranks theme with cosmic blue effects
- **Phase 2**: Deep Space Anomaly theme with purple gradients
- **Previous Year**: Archival Nebula theme with green/gold accents
- **Predictor**: Cosmic Trajectory theme with interactive elements

## 📊 Recent Updates (Latest Version)

### ✅ Data Quality Improvements

- **Cleaned Data**: Removed 400k+ invalid rank values, replaced with "-"
- **Quality Filter**: Removed colleges with insufficient data (less than 10/18 valid columns)
- **Official Branch Codes**: Updated to match TS EAMCET 2024 standards (CSE→CSE, AI/ML→CSM, etc.)
- **Consistent Display**: Standardized "-" for all missing/invalid data

### ✅ User Experience Enhancements

- **Fixed Scrolling**: Resolved persistent scrolling issues in previous year page
- **Consistent Layouts**: Standardized table layouts between Phase 1 and Phase 2
- **Improved Sorting**: Proper numerical rank sorting with NA values at bottom
- **Mobile Optimization**: Enhanced responsive design across all pages

### ✅ Analytics & Tracking

- **Google Analytics 4**: Full implementation across all 5 pages
- **Real-time Tracking**: Monitor user behavior and popular content
- **Performance Monitoring**: Track page load times and user engagement
- **Data**: CSV files organized by college and branch
- **Styling**: Glass morphism effects, space-themed animations

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:

- Express.js (web server)
- CORS (cross-origin resource sharing)
- Puppeteer (for data scraping, if needed)

### Step 2: Ensure Data Directory Exists

Make sure you have the `2025 phase 1 data` directory with college subdirectories and CSV files. The structure should be:

```
2025 phase 1 data/
├── COLLEGE_NAME_1/
│   ├── BRANCH_1.csv
│   ├── BRANCH_2.csv
│   └── ...
├── COLLEGE_NAME_2/
│   ├── BRANCH_1.csv
│   ├── BRANCH_2.csv
│   └── ...
└── ...
```

### Step 3: Start the Server

```bash
npm start
```

Or for development:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Search for results** using any of these methods:

   - Enter a student name in the search box
   - Enter a hall ticket number
   - Enter a college name
   - Use the dropdown filters for college, branch, or category

3. **View results** in the responsive table with sortable columns

4. **Export results** by clicking the "Export Results" button to download a CSV file

## Data Structure

Each CSV file contains student records with the following columns:

- `sno`: Serial number
- `hallticketno`: Student's hall ticket number
- `rank`: EAMCET rank
- `name`: Student's name
- `sex`: Gender (M/F)
- `caste`: Caste category
- `region`: Region (OU/AU/SVU/etc.)
- `seatcategory`: Seat category (OC_GEN_OU, BC_A_GIRLS_OU, etc.)

## API Endpoints

The application provides several REST API endpoints:

- `GET /api/colleges` - Get list of all colleges
- `GET /api/colleges/:collegeDir/branches` - Get branches for a specific college
- `GET /api/data/:collegeDir/:branchFile` - Get CSV data for specific college/branch
- `GET /api/all-data` - Get all data as JSON (optimized for frontend)
- `GET /api/stats` - Get statistics (total colleges, branches, records)

## Data Scraping

If you need to scrape fresh data from the official TS EAMCET website:

```bash
npm run scrape
```

This will run the `scraper.js` file to fetch the latest cutoff data.

## Customization

### Styling

- Modify the Tailwind CSS classes in `index.html`
- Adjust the space background and glass morphism effects in the `<style>` section
- Colors and animations can be customized in the Tailwind config

### Functionality

- Add new search filters by modifying the JavaScript functions
- Extend the API endpoints in `server.js` for additional features
- Customize the CSV parsing logic for different data formats

## Performance Optimization

- Data is loaded once and cached in memory
- Search operations use efficient filtering algorithms
- Responsive design ensures fast loading on all devices
- API endpoints are optimized for minimal data transfer

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Support

For issues or questions:

1. Check the console for error messages
2. Ensure the data directory structure is correct
3. Verify all dependencies are installed
4. Check that the server is running on the correct port

## Acknowledgments

- Data sourced from official TS EAMCET 2025 Phase 1 cutoffs
- Built with modern web technologies for optimal user experience
- Designed with accessibility and responsiveness in mind
