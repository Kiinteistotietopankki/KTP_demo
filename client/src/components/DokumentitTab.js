import React, { useState } from 'react'
import { Tab, Tabs, Button, Modal } from 'react-bootstrap'
import TulosteetTab from './TulosteetTab'
import PropertyDetailsForm from './report/ReportTemplate'
import ReportTemplateModal from './report/ReportTemplateModal'

export default function DokumentitTab({ kiinteisto }) {
  const [dokumentitActiveKey, setDokumentitActiveKey] = useState('Omat_dokumentit')
  const [showReportModal, setShowReportModal] = useState(false)

  const handleOpenModal = () => {
    setShowReportModal(true)
    setDokumentitActiveKey('Omat_dokumentit') // revert tab back after clicking "Luo Raportti"
  }

  const handleCloseModal = () => setShowReportModal(false)

  return (
    <div className="container-fluid px-3 px-md-4 mb-4">
      <div className="mx-auto" style={{ maxWidth: '960px' }}>
        <div className="d-flex justify-content-center mt-1 mb-1">
          <Tabs
            activeKey={dokumentitActiveKey}
            onSelect={(k) => {
              if (k === 'Luo_Raportti') {
                handleOpenModal()
              } else {
                setDokumentitActiveKey(k)
              }
            }}
            id="taloyhtiokortti-tabs"
            className="mb-0 custom-tabs2"
            variant="pills"
          >
            <Tab eventKey="Omat_dokumentit" title={<span className="text-white">Omat dokumentit</span>} />
            <Tab eventKey="Hae_tulosteita" title={<span className="text-white">Hae tulosteita</span>} />
            <Tab eventKey="Luo_Raportti" title={<span className="text-white">Luo Raportti</span>} />
          </Tabs>
        </div>

        <div className="mt-1">
          {dokumentitActiveKey === 'Omat_dokumentit' && (
            <div className="text-center mt-5">
              <div className="fs-5 text-muted mb-3">
                Dokumenttien tallennuksen kehitys on vielä kesken...
              </div>
              
            </div>
          )}

          {dokumentitActiveKey === 'Hae_tulosteita' && (
            <TulosteetTab kiinteistotunnus={kiinteisto.kiinteistotunnus} />
          )}
        </div>
      </div>

        <ReportTemplateModal
          show={showReportModal}
          onHide={handleCloseModal}
          rakennus={kiinteisto}
          kiinteistotunnus={kiinteisto.kiinteistotunnus}
          rakennusData={kiinteisto}
          initialTab="report"
        />
    </div>
  )
}
