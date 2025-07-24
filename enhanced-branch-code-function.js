
// Enhanced getBranchCode function using official 2024 branch codes
function getBranchCode(branchName) {
    if (!branchName) return '';
    
    // Official branch codes from TS EAMCET (corrected mapping)
    const officialBranchCodes = {
        // Mechanical & Related
        "AERONAUTICAL ENGINEERING": "ANE",
        "AUTOMATION AND ROBOTICS": "ARB",
        "AUTOMOBILE ENGINEERING": "AUT",
        "BUILDING SERVICES ENGG": "BSE",
        "CIVIL ENGINEERING": "CIV",
        "INDUSTRIAL PRODUCTION ENGINEERING": "IPE",
        "MECHANICAL (MECHTRONICS) ENGINEERING": "MCT",
        "MECHANICAL ENGINEERING": "MEC",
        "METALLURGICAL ENGINEERING": "MET",
        "BTECH MECHANICAL WITH MTECH MANUFACTURING SYSTEMS": "MMS",
        "BTECH MECHANICAL WITH MTECH MANUFACTURING  SYSTEMS": "MMS",
        "BTECH MECHANICAL WITH MTECH THERMAL ENGG": "MTE",
        "B.PLANNING": "PLG",

        // Agricultural & Bio
        "AGRICULTURAL ENGINEERING": "AGR",
        "BIO-TECHNOLOGY": "BIO",
        "CHEMICAL ENGINEERING": "CHE",
        "DAIRYING": "DRG",
        "FOOD TECHNOLOGY": "FDT",
        "GEO INFORMATICS": "GEO",
        "MINING ENGINEERING": "MIN",
        "METALLURGY AND MATERIAL ENGINEERING": "MMT",
        "PHARMACEUTICAL ENGINEERING": "PHE",
        "TEXTILE TECHNOLOGY / TEXTILE ENGINEERING": "TEX",

        // Computer Science & IT
        "COMPUTER ENGINEERING": "CME",
        "COMPUTER SCIENCE AND ENGG (ARTIFICIAL INTELLIGENCE)": "CSA",
        "COMPUTER SCIENCE & DESIGN": "CSG",
        "COMPUTER SCIENCE & ENGINEERING (NETWORKS)": "CSN",
        "COMPUTER SCIENCE AND ENGINEERING (IOT)": "CSO",
        "COMPUTER SCIENCE AND TECHNOLOGY": "CST",
        "COMPUTER ENGINEERING(SOFTWARE ENGINEERING)": "CSW",
        "DIGITAL TECHNIQUES FOR DESIGN AND PLANNING": "DTD",
        "INFORMATION TECHNOLOGY": "INF",
        "INFORMATION TECHNOLOGY AND ENGINEERING": "ITE",

        // AI & Data Science
        "ARTIFICIAL INTELLIGENCE": "AI",
        "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE": "AID",
        "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING": "AIM",
        "CSE (IOT AND CYBER SECURITY INCLUDING BLOCK CHAIN TECHNOLOGY)": "CIC",
        "CSE (IoT AND CYBER SECURITY INCLUDING BLOCK CHAIN TECHNOLOGY)": "CIC",
        "COMPUTER SCIENCE": "CS",
        "COMPUTER SCIENCE AND BUSINESS SYSTEM": "CSB",
        "COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)": "CSC",
        "COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)": "CSD",
        "COMPUTER SCIENCE AND ENGINEERING": "CSE",
        "COMPUTER SCIENCE AND INFORMATION TECHNOLOGY": "CSI",
        "COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)": "CSM",

        // Electronics & Electrical
        "BIO-MEDICAL ENGINEERING": "BME",
        "ELECTRONICS AND COMMUNICATION (ADVANCED COMMUNICATION TECH)": "ECA",
        "ELECTRONICS AND COMMUNICATION ENGINEERING": "ECE",
        "ELECTRONICS COMMUNICATION AND INSTRUMENTATION ENGINEERING": "ECI",
        "ELECTRONICS AND COMPUTER ENGINEERING": "ECM",
        "ELECTRICAL AND ELECTRONICS ENGINEERING": "EEE",
        "ELECTRONICS AND INSTRUMENTATION ENGINEERING": "EIE",
        "ELECTRONICS AND TELECOMMUNICATION ENGG": "ETE",
        "ELECTRONICS AND TELEMATICS": "ETM",
        "ELECTRONICS ENGINEERING (VLSI DESIGN AND TECHNOLOGY)": "EVL",

        // Pharmacy
        "PHARM - D (M.P.C. STREAM)": "PHD",
        "B. PHARMACY (M.P.C. STREAM)": "PHM"
    };
    
    // Normalize input branch name
    const normalizedName = branchName.toUpperCase().trim();
    
    // Try exact match first
    if (officialBranchCodes[normalizedName]) {
        return officialBranchCodes[normalizedName];
    }
    
    // Try partial matches for common variations
    for (const [name, code] of Object.entries(officialBranchCodes)) {
        if (name.includes(normalizedName) || normalizedName.includes(name)) {
            return code;
        }
    }
    
    // Fallback to first 3-4 characters if no match found
    return branchName.substring(0, 4).toUpperCase();
}