import { useState } from 'react';
import { Modal, Tab, Tabs } from 'react-bootstrap';
import ReportTemplate from './ReportTemplate';

const ReportTemplateModal = ({
  show,
  onHide,
  rakennus,
  kiinteistotunnus,
  initialTab,
  rakennusData
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'report');

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      scrollable
      dialogClassName="report-template-modal"
      fullscreen="md-down" // <-- full screen on mobile
    >
      <Modal.Header closeButton>
        <Tabs
          id="report-tabs"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-0"
        >
          <Tab eventKey="report" title="Raportti" />
          <Tab eventKey="pts" title="PTS" />
          <Tab eventKey="preview" title="Esikatselu" />
        </Tabs>
      </Modal.Header>

      <Modal.Body>
        <ReportTemplate
          rakennus={rakennus}
          kiinteistotunnus={kiinteistotunnus}
          rakennusData={rakennusData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ReportTemplateModal;
