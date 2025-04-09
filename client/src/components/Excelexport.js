import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (rakennus) => {
   
       
        const data = [];
    
        // Yleistiedot Section
        data.push({ Ominaisuus: "Rakennustunnus:", Arvo: rakennus.properties.yleistiedot.Rakennustunnus || "-" });
        data.push({ Ominaisuus: "Kiinteistötunnus:", Arvo: rakennus.properties.yleistiedot.Kiinteistötunnus || "-" });
        data.push({ Ominaisuus: "Kohteen nimi:", Arvo: rakennus.properties.yleistiedot["Kohteen nimi"] || "-" });
        data.push({ Ominaisuus: "Kohteen osoite:", Arvo: rakennus.properties.yleistiedot["Kohteen osoite"] || "-" });
        data.push({ Ominaisuus: "Postinumero:", Arvo: rakennus.properties.yleistiedot.Postinumero || "-" });
        data.push({ Ominaisuus: "Toimipaikka:", Arvo: rakennus.properties.yleistiedot.Toimipaikka || "-" });
        
        
    
        // Tekniset tiedot
        data.push({ Ominaisuus: "Rakennusvuosi:", Arvo: rakennus.properties.teknisettiedot.Rakennusvuosi || "-" });
        data.push({ Ominaisuus: "Kokonaisala (m²):", Arvo: rakennus.properties.teknisettiedot["Kokonaisala (m²)"] || "-" });
        data.push({ Ominaisuus: "Kerrosala (m²):", Arvo: rakennus.properties.teknisettiedot["Kerrosala (m²)"] || "-" });
        data.push({ Ominaisuus: "Huoneistoala (m²):", Arvo: rakennus.properties.teknisettiedot["Huoneistoala (m²)"] || "-" });
        data.push({ Ominaisuus: "Tilavuus (m³):", Arvo: rakennus.properties.teknisettiedot["Tilavuus (m³)"] || "-" });
        data.push({ Ominaisuus: "Kerroksia:", Arvo: rakennus.properties.teknisettiedot["Kerroksia"] || "-" });

    
        // Rakennustiedot
        data.push({ Ominaisuus: "Rakennusluokitus:", Arvo: rakennus.properties.rakennustiedot.Rakennusluokitus || "-" });
        data.push({ Ominaisuus: "Runkotapa:", Arvo: rakennus.properties.rakennustiedot.Runkotapa || "-" });
        data.push({ Ominaisuus: "Käytössäolotilanne:", Arvo: rakennus.properties.rakennustiedot["Käytössäolotilanne"] || "-" });
        data.push({ Ominaisuus: "Julkisivun rakennusaine:", Arvo: rakennus.properties.rakennustiedot["JulkisivunRakennusaine"] || "-" });
        data.push({ Ominaisuus: "Lämmitystapa:", Arvo: rakennus.properties.rakennustiedot.Lammitystapa || "-" });
        data.push({ Ominaisuus: "Kantavanrakenteen rakennusaine:",Arvo: rakennus.properties.rakennustiedot["Kantavanrakenteen rakennusaine"] || "-" });
    
        
         data.push({ Ominaisuus: "Pohjavesialueella:", Arvo: rakennus.properties.aluetiedot.Pohjavesialueella || "-" });
        data.push({ Ominaisuus: "Tulvariski:", Arvo: rakennus.properties.aluetiedot.Tulvariski || "-" });
    
        //Create the worksheet from the data array
        const worksheet = XLSX.utils.json_to_sheet(data, { header: ["Ominaisuus", "Arvo", "Lähde"] });
        const columnWidths = [
            { width: Math.max(...data.map(row => row.Ominaisuus ? row.Ominaisuus.length : 0)) }, 
            { width: 20 } 
        ];
    
        
        worksheet['!cols'] = columnWidths;
        // Create the workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rakennus Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const tunnus = rakennus.properties.yleistiedot?.Rakennustunnus || "data";
    const filename = `Rakennus ${tunnus}.xlsx`;

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
};

export default exportToExcel;
