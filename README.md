# TS EAMCET 2025 Phase 1 Cutoffs - Student Results Finder

A modern, responsive web application for searching and exploring TS EAMCET 2025 Phase 1 cutoff results. Features a clean, glassy UI with space-themed background and comprehensive search functionality.

## Features

- 🔍 **Advanced Search**: Search by student name, hall ticket number, or college name
- 🏫 **Filter by College**: Browse results from specific engineering colleges
- 📚 **Filter by Branch**: Filter results by engineering branches/departments
- 🎯 **Filter by Category**: Filter by seat category (OC, BC, SC, ST, etc.)
- 📊 **Real-time Statistics**: View total records, colleges, and branches
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- ✨ **Modern UI**: Glass morphism design with space-themed background
- 📥 **Export Results**: Export filtered results to CSV format
- ⚡ **Fast Performance**: Optimized data loading and search algorithms

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
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
