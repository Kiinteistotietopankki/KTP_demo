import React from 'react'
import RakennustietoRow from './RakennustietoRow'
import EditModal from './EditModal'

export default function PerustiedotAccordion( {kiinteisto, setMapCoodinates} ) {

    const setMapCoords = (coords) =>{
        setMapCoodinates([coords[1],coords[0]])
    }

  return (
    <div className="accordion" id="accordionPanelsStayOpenExample">

        {kiinteisto?.rakennukset.map(rakennus => (
            <div className="accordion-item">
                <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#perustiedot${rakennus.id_rakennus}`} aria-expanded="false" aria-controls={`perustiedot${rakennus.id_rakennus}`}>
                        {rakennus.osoite} | {rakennus.rakennusluokitukset[0].rakennusluokitus} | {rakennus.rakennustunnus}
                    </button>
                </h2>
                <div id={`perustiedot${rakennus.id_rakennus}`} className="accordion-collapse collapse">
                    <div className="accordion-body">
                        <div className="row">
                            <dl className="col-6">
                                <dt className="col-sm-3">Osoite</dt>
                                <dd>{rakennus.osoite} <br />
                                    <small className="text-muted">Lähde: {rakennus?.metadata[0]?.metadata?.osoite?.source}</small>
                                </dd>

                                <dt className="col-sm-3">Postinumero</dt>
                                <dd>{rakennus.postinumero} <br />
                                    <small className="text-muted">Lähde: {rakennus?.metadata[0]?.metadata?.postinumero?.source}</small>
                                </dd>
                                
                                <dt className="col-sm-3">Toimipaikka</dt>
                                <dd>{rakennus.toimipaikka} <br />
                                    <small className="text-muted">Lähde: {rakennus?.metadata[0]?.metadata?.toimipaikka?.source}</small>
                                </dd>

                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">
                                    Launch demo modal
                                </button>
                                
                                <EditModal></EditModal>




                            </dl>

                            <dl className="col-6">


                                <RakennustietoRow otsikko='Rakennustunnus' data={rakennus.rakennustunnus} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustunnus?.source} showEdit={false}/>


                                <RakennustietoRow otsikko='Rakennusvuosi' data={rakennus.rakennustiedot[0].rakennusvuosi} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source} showEdit={false}/>


                                <RakennustietoRow otsikko='Sijainti' data={`${rakennus.rakennustiedot[0]?.sijainti?.coordinates[1]}, ${rakennus.rakennustiedot[0]?.sijainti?.coordinates[0]}`} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.sijainti?.source} showEdit={false}/>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => setMapCoords(rakennus.rakennustiedot[0]?.sijainti?.coordinates)}
                                        >
                                        <i className="bi bi-geo-alt-fill me-1"></i> Näytä kartalla
                                    </button>

                            </dl>

                            <hr className="my-4" />

                            <dl className="col-6">
                                <RakennustietoRow otsikko='Rakennusluokitus' data={rakennus.rakennusluokitukset[0].rakennusluokitus} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Runkotapa' data={rakennus.rakennusluokitukset[0].runkotapa} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Käyttötilanne' data={rakennus.rakennusluokitukset[0].kayttotilanne} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Julkisivumateriaali' data={rakennus.rakennusluokitukset[0].julkisivumateriaali} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Lämmitystapa' data={rakennus.rakennusluokitukset[0].lammitystapa} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>
                                    
                                <RakennustietoRow otsikko='Lämmitysenergianlähde' data={rakennus.rakennusluokitukset[0].lammitysenergialahde} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Rakennusaine' data={rakennus.rakennusluokitukset[0].rakennusaine} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>
                            </dl>

                            <dl className="col-6">
                                <RakennustietoRow otsikko='Kokonaisala' data={rakennus.rakennustiedot[0].kokonaisala} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Kerrosala' data={rakennus.rakennustiedot[0].kerrosala} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Huoneistoala' data={rakennus.rakennustiedot[0].huoneistoala} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Tilavuus' data={rakennus.rakennustiedot[0].tilavuus} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>

                                <RakennustietoRow otsikko='Kerroksia' data={rakennus.rakennustiedot[0].kerroksia} 
                                    source={rakennus?.metadata[0]?.metadata?.rakennustiedotArray[0]?.rakennusvuosi?.source}/>
                                    
                            </dl>


                        </div>

                    </div>
                </div>
            </div>
        ))}

    </div>
  )
}
