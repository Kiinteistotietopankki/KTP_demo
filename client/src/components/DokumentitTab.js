import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import TulosteetTab from './TulosteetTab'

export default function DokumentitTab({kiinteisto}) {

    const [dokumentitActiveKey, setDokumentitActiveKey] = useState('Omat_dokumentit')

    return (
    <div className="container-fluid px-3 px-md-4 mb-4">
        <div className="mx-auto" style={{ maxWidth: '960px' }}>
            <div className="d-flex justify-content-center mt-1 mb-1">
            <Tabs
                activeKey={dokumentitActiveKey}
                onSelect={(k) => setDokumentitActiveKey(k)}
                id="taloyhtiokortti-tabs"
                className="mb-0 custom-tabs2"
                variant="pills"
            >
                <Tab eventKey="Omat_dokumentit" title={<span className="text-white">Omat dokumentit</span>} />
                <Tab eventKey="Hae_tulosteita" title={<span className="text-white">Hae tulosteita</span>} />
            </Tabs>
            </div>

            <div className="mt-1">
                {dokumentitActiveKey === 'Omat_dokumentit' && (<>
                    <div className='text-center mt-5 fs-5 text-ligth'>Dokumenttien tallennuksen kehitys on vielä kesken...</div>
                </>)}

                {dokumentitActiveKey === 'Hae_tulosteita' && (<>
                    <TulosteetTab kiinteistotunnus={kiinteisto.kiinteistotunnus}></TulosteetTab>
                </>)}
            </div>
        </div>
    </div>
  )
}
