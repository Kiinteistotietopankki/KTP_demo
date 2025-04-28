import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (rakennus) => {
  const data = [];

  const getValue = (field) => field?.value || "-";

  // Yleistiedot Section
  data.push({ Ominaisuus: "Rakennustunnus:", Arvo: getValue(rakennus.properties.yleistiedot.Rakennustunnus) });
  data.push({ Ominaisuus: "Kiinteistötunnus:", Arvo: getValue(rakennus.properties.yleistiedot.Kiinteistötunnus) });
  data.push({ Ominaisuus: "Kohteen nimi:", Arvo: getValue(rakennus.properties.yleistiedot["Kohteen nimi"]) });
  data.push({ Ominaisuus: "Kohteen osoite:", Arvo: getValue(rakennus.properties.yleistiedot["Kohteen osoite"]) });
  data.push({ Ominaisuus: "Postinumero:", Arvo: getValue(rakennus.properties.yleistiedot.Postinumero) });
  data.push({ Ominaisuus: "Toimipaikka:", Arvo: getValue(rakennus.properties.yleistiedot.Toimipaikka) });

  // Tekniset tiedot
  data.push({ Ominaisuus: "Rakennusvuosi:", Arvo: getValue(rakennus.properties.teknisettiedot.Rakennusvuosi) });
  data.push({ Ominaisuus: "Kokonaisala (m²):", Arvo: getValue(rakennus.properties.teknisettiedot["Kokonaisala (m²)"]) });
  data.push({ Ominaisuus: "Kerrosala (m²):", Arvo: getValue(rakennus.properties.teknisettiedot["Kerrosala (m²)"]) });
  data.push({ Ominaisuus: "Huoneistoala (m²):", Arvo: getValue(rakennus.properties.teknisettiedot["Huoneistoala (m²)"]) });
  data.push({ Ominaisuus: "Tilavuus (m³):", Arvo: getValue(rakennus.properties.teknisettiedot["Tilavuus (m³)"]) });
  data.push({ Ominaisuus: "Kerroksia:", Arvo: getValue(rakennus.properties.teknisettiedot.Kerroksia) });

  // Rakennustiedot
  data.push({ Ominaisuus: "Rakennusluokitus:", Arvo: getValue(rakennus.properties.rakennustiedot.Rakennusluokitus) });
  data.push({ Ominaisuus: "Runkotapa:", Arvo: getValue(rakennus.properties.rakennustiedot.Runkotapa) });
  data.push({ Ominaisuus: "Käytössäolotilanne:", Arvo: getValue(rakennus.properties.rakennustiedot["Käytössäolotilanne"]) });
  data.push({ Ominaisuus: "Julkisivun rakennusaine:", Arvo: getValue(rakennus.properties.rakennustiedot["JulkisivunRakennusaine"]) });
  data.push({ Ominaisuus: "Lämmitystapa:", Arvo: getValue(rakennus.properties.rakennustiedot.Lammitystapa) });
  data.push({ Ominaisuus: "Kantavanrakenteen rakennusaine:", Arvo: getValue(rakennus.properties.rakennustiedot["Kantavanrakenteen rakennusaine"]) });

  // Aluetiedot
  data.push({ Ominaisuus: "Pohjavesialueella:", Arvo: getValue(rakennus.properties.aluetiedot.Pohjavesialueella) });
  data.push({ Ominaisuus: "Tulvariski:", Arvo: getValue(rakennus.properties.aluetiedot.Tulvariski) });

  // Create the worksheet from the data array
  const worksheet = XLSX.utils.json_to_sheet(data);
  const columnWidths = [
    { width: Math.max(...data.map(row => row.Ominaisuus ? row.Ominaisuus.length : 0)) }, 
    { width: 40 }
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rakennus Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const tunnus = rakennus.properties.yleistiedot?.Rakennustunnus?.value || "data";
  const filename = `Rakennus ${tunnus}.xlsx`;

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, filename);
};

export default exportToExcel;
