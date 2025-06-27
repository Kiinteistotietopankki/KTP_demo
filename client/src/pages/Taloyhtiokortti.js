import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useParams } from 'react-router-dom';
import MapVisual from '../components/MapVisual';
import { Tab, Tabs } from 'react-bootstrap';
import StickyAfterScroll from '../components/Stickyafterscroll';
import { getKiinteistoWhole } from '../api/api';
import PropertyDetailsForm from '../components/ReportTemplate'; 
import Modal from 'react-bootstrap/Modal';

function Taloyhtiokortti() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [selectedRakennusForReport, setSelectedRakennusForReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    useEffect(() => {

        getKiinteistoWhole(id)
            .then(res => {
                setCard(res.data);
                console.log(res.data)
                console.log("SIJAINTI" , card?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates)
                // console.log("SIJAINTI" , card.rakennukset[0].rakennustiedot.sijainti.coordinates)
            })
            .catch(err => console.error('Api error', err))

        }, [id]);
    
    if (!card) return <div>Loading...</div>;

  return (
    <>
        <h1 className="otsikko text-primary mb-1 mx-auto">
            Kiinteistötietopankki <Badge bg="secondary">DEMO</Badge>
        </h1>
        <div className="container mt-3 border border-primary">

            <div className='row border border-secondary'>
                <div className="col-md-6 border border-primary">            
                    <h2>{card?.rakennukset[0]?.osoite} {card?.rakennukset[0]?.toimipaikka}</h2>
                    <h4>{card.kiinteistotunnus}</h4> 
                    {/* {card?.rakennukset.map(rakennus => (
                    <p key={rakennus.id_rakennus}>
                        {rakennus.rakennustunnus}
                    </p>) )} */}
                    
                
                </div>
                <div className="col-md-6 border border-primary"><MapVisual pos={[65.00816937, 25.46030678]} coords={[card?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates[1],card?.rakennukset[0]?.rakennustiedot[0]?.sijainti?.coordinates[0]]}/></div>
            </div>

            <div className='row border border-danger mt-3'>
                <Tabs
                    defaultActiveKey="perustiedot"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
 
                    <Tab eventKey="perustiedot" title="Perustiedot">
                        <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Tunnus</th>
                                        {/* <th scope="col">Rakennusvuosi</th>
                                        <th scope="col">Kerroksia</th> */}
                                        <th scope="col">Kokonaisala m²</th>
                                        <th scope="col">Kerrosala m²</th>
                                        <th scope="col">Huoneistoala m²</th>
                                        <th scope="col">Tilavuus m³</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        let totalKerroksia = 0;
                                        let totalKokonaisala = 0;
                                        let totalKerrosala = 0;
                                        let totalHuoneistoala = 0;
                                        let totalTilavuus = 0;

                                        const rows = card?.rakennukset.map(rakennus => {
                                            const tiedot = rakennus.rakennustiedot?.[0] || {};
                                            const kerroksia = Number(tiedot.kerroksia) || 0;
                                            const kokonaisala = Number(tiedot.kokonaisala) || 0;
                                            const kerrosala = Number(tiedot.kerrosala) || 0;
                                            const huoneistoala = Number(tiedot.huoneistoala) || 0;
                                            const tilavuus = Number(tiedot.tilavuus) || 0;

                                            totalKerroksia += kerroksia;
                                            totalKokonaisala += kokonaisala;
                                            totalKerrosala += kerrosala;
                                            totalHuoneistoala += huoneistoala;
                                            totalTilavuus += tilavuus;

                                            return (
                                                <tr key={rakennus.id_rakennus}>
                                                    <th scope="row">{rakennus.rakennustunnus}</th>
                                                    {/* <td>{tiedot.rakennusvuosi || 'Ei tiedossa'}</td>
                                                    <td>{kerroksia}</td> */}
                                                    <td>{kokonaisala}</td>
                                                    <td>{kerrosala}</td>
                                                    <td>{huoneistoala}</td>
                                                    <td>{tilavuus}</td>
                                                    <td>
                                                    <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setSelectedRakennusForReport(rakennus);
                                                        setShowReportModal(true);
                                                    }}
                                                    >
                                                    Luo raportti
                                                    </button>
                                                     </td>
                                                </tr>
                                            );
                                        });

                                        return (
                                            <>
                                                {rows}
                                                <tr>
                                                    <th scope="row">Yhteensä</th>
                                                    {/* <td>-</td>
                                                    <td>-</td> */}
                                                    <td>{totalKokonaisala}</td>
                                                    <td>{totalKerrosala}</td>
                                                    <td>{totalHuoneistoala}</td>
                                                    <td>{totalTilavuus}</td>
                                                </tr>
                                            </>
                                        );
                                    })()}
                                </tbody>
                            </table>
                            <Modal
                                    show={showReportModal}
                                    onHide={() => setShowReportModal(false)}
                                    size="xl"
                                    backdrop="static"
                                    >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Luo raportti</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {selectedRakennusForReport && (
                                        <PropertyDetailsForm rakennus={selectedRakennusForReport} />
                                        )}
                                    </Modal.Body>
                                    </Modal>

                    </Tab>
                    <Tab eventKey="dokumentit" title="Dokumentit ja raportit">
                        Tab content for Dokumentit ja raportit
                    </Tab>
                    <Tab eventKey="kiinteistotiedot" title="Kiinteistotiedot">
                        Tab content for Kiinteistotiedot
                    </Tab>
                    <Tab eventKey="rhtiedot" title="RH-tiedot">
                        Tab content for RH-tiedot
                    </Tab>
                    <Tab eventKey="pts" title="PTS">
                        Tab content for PTS
                    </Tab>
                </Tabs>

            </div>
        </div>
    </>
  );
}

export default Taloyhtiokortti;

