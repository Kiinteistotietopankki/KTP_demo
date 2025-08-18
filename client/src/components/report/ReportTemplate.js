import { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import 'handsontable/dist/handsontable.full.min.css';

import reportTemplates from '../config/reportTemplates.js';
import makeDocDefinition from '../pdf/makeDocDefinition.js';
import useBase64Image from '../hooks/useBase64Image.js';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PTSLongTermTable from '../PTS/PTSLongTermTable.js';
import ImageBlocks from './ImageBlocks.jsx';
import CoverPageForm from './CoverPageForm.jsx';
import PropertyInfoAccordion from './PropertyInfoAccordion.jsx';
import SectionsAccordion from './SectionsAccordion.jsx';
import PreviewPane from './PreviewPanel';

import logo from '../../assets/images/waativalogo.png';
import { Riskidataa } from '../../assets/Riskidata';

import '../../fonts/josefin-fonts.js';
import '../../fonts/Lato-fonts.js';
import BackgroundPTS from '../PTS/BackgroundPTS.jsx';

const ReportTemplate = ({
  rakennus,
  kiinteistotunnus,
  rakennusData: initialRakennusData,
  activeTab,
  setActiveTab
}) => {
  const [savedData, setSavedData] = useLocalStorage('reportFormData', {});
  const [rakennusData, setRakennusData] = useState(initialRakennusData || null);
  const [selectedTemplate, setSelectedTemplate] = useState(savedData.selectedTemplate || 'wpts');
  const [sections, setSections] = useState(savedData.sections || reportTemplates[selectedTemplate].defaultSections);

  const [title, setTitle] = useState(savedData.title || reportTemplates[selectedTemplate].name || '');
  const [dateIso, setDateIso] = useState(savedData.customText || '');
  const [propertyName, setPropertyName] = useState(savedData.PropertyName || '');
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null);
  const [riskidata, setRiskidata] = useState(savedData.riskidata || Riskidataa);

  const [previewUrl, setPreviewUrl] = useState(null);
  const logoBase64 = useBase64Image(logo);

  //pts images
  const [ptsImages, setPtsImages] = useState([]);




  useEffect(() => {
    if (initialRakennusData) setRakennusData(initialRakennusData);
  }, [initialRakennusData]);

  useEffect(() => {
    setSavedData({
      ...savedData,
      title,
      customText: dateIso,
      PropertyName: propertyName,
      coverImage,
      riskidata,
      sections,
      selectedTemplate,
    });
  }, [title, dateIso, propertyName, coverImage, riskidata, sections, selectedTemplate, ptsImages]);

  // preview generation
  useEffect(() => {
    if (activeTab !== 'preview') return;
    const docDefinition = makeDocDefinition({
      title,
      propertyName,
      dateIso,
      coverImage,
      logoBase64,
      sections,
      riskidata,
      rakennusData,
      ptsImages
    });
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBlob((blob) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const blobUrl = URL.createObjectURL(blob);
      setPreviewUrl(blobUrl);
    });
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [activeTab, title, propertyName, dateIso, coverImage, logoBase64, sections, riskidata, rakennusData, ptsImages]); // eslint-disable-line

  const handleExportPdf = () => {
    const docDefinition = makeDocDefinition({
      title,
      propertyName,
      dateIso,
      coverImage,
      logoBase64,
      sections,
      riskidata,
      rakennusData,
      ptsImages
    });
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBlob((blob) => {
      const templateName = reportTemplates[selectedTemplate]?.name || 'Raportti';
      const fileName = `${templateName}_${propertyName || 'Kohde'}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const resetForm = () => {
    setTitle(reportTemplates.wpts.name);
    setDateIso('');
    setPropertyName('');
    setCoverImage(null);
    setRiskidata(Riskidataa);
    setSections([
      { key: 'johdanto', label: 'Johdanto', content: '', include: false, images: [] },
      { key: 'jarjestelma', label: 'Järjestelmäkuvaukset ja Riskiluokitus', content: '', include: false, images: [] },
      { key: 'rakennetekniikka', label: 'Rakennetekniikkan Kuvat', content: '', include: false, images: [] },
      { key: 'lvi', label: 'LVI-Tekniikan Kuvat', content: '', include: false, images: [] },
      { key: 'sahko', label: 'Sähköjärjestelmien Kuvat', content: '', include: false, images: [] },
      { key: 'lähtötiedot', label: 'Lähtötiedot', content: '', include: false, images: [] },
      { key: 'havainnot', label: ' Merkittävimmät havainnot ', content: '', include: false, images: [] },
      { key: 'allekirjoitus', label: ' Allekirjoitukset', content: '', include: false, images: [] },
    ]);
    localStorage.removeItem('reportFormData');
  };

  return (
    <>
      {activeTab === 'report' && (
        <div className="p-1 space-y-6">
          <CoverPageForm
            title={title}
            setTitle={setTitle}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            propertyName={propertyName}
            setPropertyName={setPropertyName}
            dateIso={dateIso}
            setDateIso={setDateIso}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={(key) => {
              setSelectedTemplate(key);
              setSections(reportTemplates[key].defaultSections);
              setTitle(reportTemplates[key].name);
            }}
            templates={reportTemplates}
          />

          <PropertyInfoAccordion card={rakennusData} />

          <ImageBlocks sections={sections} setSections={setSections} />

          <SectionsAccordion
            sections={sections}
            setSections={setSections}
            riskidata={riskidata}
            setRiskidata={setRiskidata}
            ptsImagesPrew={ptsImages}
          />

          <div className="flex flex-row justify-end mt-6 gap-4">
            <button className="btn btn-outline-success" onClick={() => {
              const header = prompt('Anna uuden osion otsikko:');
              if (!header) return;
              const newSection = { key: `custom-${Date.now()}`, label: header, content: '', include: true, images: [] };
              setSections((prev) => {
                const i = prev.findIndex(s =>
                  ['rakennetekniikka','Kohteenkuvatkuvat','lvi','sahko','lähtötiedot','havainnot'].includes(s.key)
                );
                if (i === -1) return [...prev, newSection];
                const updated = [...prev];
                updated.splice(i, 0, newSection);
                return updated;
              });
            }}>
              ➕ Lisää uusi osio
            </button>

            <button className="btn btn-outline-success" onClick={handleExportPdf}>📥 Lataa Raportti</button>

            <button className="btn btn-outline-danger" onClick={() => {
              if (window.confirm('Haluatko varmasti tyhjentää raportin? Tämä poistaa kaikki tiedot.')) resetForm();
            }}>
              ♻️ Tyhjennä kentät
            </button>
          </div>
        </div>
      )}

      {activeTab === 'pts' && (
        <div className="p-1">
          <h3 className="text-xl font-semibold mb-4">📊 PTS (Pitkän tähtäimen suunnitelma)</h3>
          {setPtsImages && (
            <PTSLongTermTable
              kiinteistotunnus={kiinteistotunnus}
              setPtsImages={setPtsImages}
            />
          )}

        </div>
      )}

      <BackgroundPTS
        kiinteistotunnus={kiinteistotunnus}
        setPtsImages={setPtsImages}
      />

      {activeTab === 'preview' && (
        <PreviewPane previewUrl={previewUrl} onDownload={handleExportPdf} />
      )}
    </>
  );
};

export default ReportTemplate;
