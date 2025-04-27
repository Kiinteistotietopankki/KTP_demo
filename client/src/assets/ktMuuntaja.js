
export function ktKokomuotoon(kiinteistotunnus) {
    // Remove hyphens and split the string into parts
  // Check if the input contains hyphens
    if (kiinteistotunnus.includes('-')) {
    // Remove hyphens and split the string into parts
    const parts = kiinteistotunnus.split('-');

    // Apply specific padding for each part
    const paddedParts = [
        parts[0].padStart(3, '0'), // First part, pad to 3 digits
        parts[1].padStart(3, '0'), // Second part, pad to 3 digits
        parts[2].padStart(4, '0'), // Third part, pad to 4 digits
        parts[3].padStart(4, '0')  // Fourth part, pad to 4 digits
    ];

    // Join the padded parts back together into a single string
    return paddedParts.join('');
    }

    // If no hyphens, return the input unchanged
    return kiinteistotunnus;
}

export function ktEsitysmuotoon(kiinteistotunnus) {
    // Check if the input is already in the format without hyphens (i.e., no hyphens exist)
    if (!kiinteistotunnus.includes('-')) {
      // Split the string into parts (assuming correct length for each part)
      const parts = [
        kiinteistotunnus.slice(0, 3),   // First 3 digits
        kiinteistotunnus.slice(3, 6),   // Next 3 digits
        kiinteistotunnus.slice(6, 10),  // Next 4 digits
        kiinteistotunnus.slice(10, 14)  // Last 4 digits
      ];
  
      // Remove leading zeros from each part (using parseInt ensures leading zeros are removed)
      const cleanedParts = parts.map(part => parseInt(part, 10).toString());
  
      // Join the cleaned parts with hyphens
      return cleanedParts.join('-');
    }
  
    // If already in hyphenated form, return unchanged
    return kiinteistotunnus;
  }
  