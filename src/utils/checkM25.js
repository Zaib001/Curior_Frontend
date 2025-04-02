// List of Postcode Areas and Districts Inside the M25
const m25Postcodes = [
    'E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC',
    'BR', 'CR', 'DA', 'EN', 'HA', 'IG', 'KT',
    'RM', 'SM', 'TW', 'UB'
  ];
  
  const checkIfWithinM25 = (postcode) => {
    if (!postcode) return false;
  
    // Extract the area (e.g., "SE15" -> "SE")
    const area = postcode.match(/^[A-Z]{1,2}/)?.[0];
    return m25Postcodes.includes(area);
  };
  
  export default checkIfWithinM25;
  