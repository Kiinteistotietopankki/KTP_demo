import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const exportToPdf = (rakennus) => {
    const doc = new jsPDF();

    const { Rakennustunnus } = rakennus.properties.yleistiedot;
    doc.setFontSize(14);
    doc.text(`Rakennus: ${Rakennustunnus}`, 10, 10);

    const data = [
        { title: 'Yleistiedot', data: rakennus.properties.yleistiedot },
        { title: 'Tekniset tiedot', data: rakennus.properties.teknisettiedot },
        { title: 'Rakennustiedot', data: rakennus.properties.rakennustiedot },
        { title: 'Aluetiedot', data: rakennus.properties.aluetiedot },
    ];

    let currentY = 20;

    data.forEach(section => {
        doc.setFontSize(12);
        doc.text(section.title, 10, currentY);
        currentY += 6;

        const rows = Object.entries(section.data || {}).map(([key, value]) => [key, String(value)]);
        autoTable(doc, {
            startY: currentY,
            head: [['Ominaisuus', 'Arvo']],
            body: rows,
            theme: 'striped',
            styles: { fontSize: 10 },
        });

        currentY = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`Rakennus_${Rakennustunnus}.pdf`);
};

export default exportToPdf;
