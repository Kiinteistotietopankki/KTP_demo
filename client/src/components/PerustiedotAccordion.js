import React from 'react'
import RakennustietoRow from './RakennustietoRow'
import EditModal from './EditModal'

export default function PerustiedotAccordion({ kiinteisto, setMapCoodinates }) {

    const setMapCoords = (coords) => {
        setMapCoodinates([coords[1], coords[0]])
    }

    return (
        <div className="accordion" id="accordionPanelsStayOpenExample">
            {kiinteisto?.rakennukset_fulls.map(rakennus => (
                <div className="accordion-item" key={rakennus.id_rakennus}>
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#perustiedot${rakennus.id_rakennus}`} aria-expanded="false" aria-controls={`perustiedot${rakennus.id_rakennus}`}>
                            {rakennus.osoite} | {rakennus.rakennusluokitus} | {rakennus.rakennustunnus}
                        </button>
                    </h2>
                    <div id={`perustiedot${rakennus.id_rakennus}`} className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <div className="row">
                                <dl className="col-6">
                                    <dt className="col-sm-3">Osoite</dt>
                                    <dd>{rakennus.osoite} <br />
                                        <small className="text-muted">Lähde: </small>
                                    </dd>

                                    <dt className="col-sm-3">Postinumero</dt>
                                    <dd>{rakennus.postinumero} <br />
                                        <small className="text-muted">Lähde: </small>
                                    </dd>

                                    <dt className="col-sm-3">Toimipaikka</dt>
                                    <dd>{rakennus.toimipaikka} <br />
                                        <small className="text-muted">Lähde: </small>
                                    </dd>
                                </dl>

                                <dl className="col-6">
                                    <RakennustietoRow otsikko='Rakennustunnus' data={rakennus.rakennustunnus} source="" showEdit={false} />
                                    <RakennustietoRow otsikko='Rakennusvuosi' data={rakennus.rakennusvuosi} source="" showEdit={false} />
                                    <RakennustietoRow
                                        otsikko='Sijainti'
                                        data={`${rakennus.sijainti?.coordinates[1]}, ${rakennus.sijainti?.coordinates[0]}`}
                                        source=""
                                        showEdit={false}
                                    />
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => setMapCoords(rakennus.sijainti?.coordinates)}
                                    >
                                        <i className="bi bi-geo-alt-fill me-1"></i> Näytä kartalla
                                    </button>
                                </dl>

                                <hr className="my-4" />

                                <dl className="col-6">
                                    <>
                                        <RakennustietoRow
                                            otsikko='Rakennusluokitus'
                                            data={rakennus.rakennusluokitus}
                                            source=""
                                            modalId={`editModal-${rakennus.id_rakennus}-rakennusluokitus`}
                                        />
                                        <EditModal
                                            modalId={`editModal-${rakennus.id_rakennus}-rakennusluokitus`}
                                            name="Rakennusluokitus"
                                            value={rakennus.rakennusluokitus}
                                            onSave={(newValue) => console.log(`Saving rakennusluokitus for ${rakennus.id_rakennus}:`, newValue)}
                                        />
                                    </>

                                    <>
                                        <RakennustietoRow
                                            otsikko='Runkotapa'
                                            data={rakennus.runkotapa}
                                            source=""
                                            modalId={`editModal-${rakennus.id_rakennus}-runkotapa`}
                                        />
                                        <EditModal
                                            modalId={`editModal-${rakennus.id_rakennus}-runkotapa`}
                                            name="Runkotapa"
                                            value={rakennus.runkotapa}
                                            onSave={(newValue) => console.log(`Saving runkotapa for ${rakennus.id_rakennus}:`, newValue)}
                                        />
                                    </>

                                    <>
                                        <RakennustietoRow
                                            otsikko='Käyttötilanne'
                                            data={rakennus.kayttotilanne}
                                            source=""
                                            modalId={`editModal-${rakennus.id_rakennus}-kayttotilanne`}
                                        />
                                        <EditModal
                                            modalId={`editModal-${rakennus.id_rakennus}-kayttotilanne`}
                                            name="Käyttötilanne"
                                            value={rakennus.kayttotilanne}
                                            onSave={(newValue) => console.log(`Saving käyttötilanne for ${rakennus.id_rakennus}:`, newValue)}
                                        />
                                    </>

                                    <>
                                        <RakennustietoRow
                                            otsikko='Julkisivumateriaali'
                                            data={rakennus.julkisivumateriaali}
                                            source=""
                                            modalId={`editModal-${rakennus.id_rakennus}-julkisivumateriaali`}
                                        />
                                        <EditModal
                                            modalId={`editModal-${rakennus.id_rakennus}-julkisivumateriaali`}
                                            name="Julkisivumateriaali"
                                            value={rakennus.julkisivumateriaali}
                                            onSave={(newValue) => console.log(`Saving julkisivumateriaali for ${rakennus.id_rakennus}:`, newValue)}
                                        />
                                    </>

                                    <>
                                        <RakennustietoRow
                                            otsikko='Lämmitystapa'
                                            data={rakennus.lammitystapa}
                                            source=""
                                            modalId={`editModal-${rakennus.id_rakennus}-lammitystapa`}
                                        />
                                        <EditModal
                                            modalId={`editModal-${rakennus.id_rakennus}-lammitystapa`}
                                            name="Lämmitystapa"
                                            value={rakennus.lammitystapa}
                                            onSave={(newValue) => console.log(`Saving lämmitystapa for ${rakennus.id_rakennus}:`, newValue)}
                                        />
                                    </>

                                    <>
                                        <RakennustietoRow
                                            otsikko='Lämmitysenergianlähde'
                                            data={rakennus.lammitysenergialahde}
                                            source=""
                                            modalId={`editModal-${rakennus.id_rakennus}-lammitysenergialahde`}
                                        />
                                        <EditModal
                                            modalId={`editModal-${rakennus.id_rakennus}-lammitysenergialahde`}
                                            name="Lämmitysenergianlähde"
                                            value={rakennus.lammitysenergialahde}
                                            onSave={(newValue) => console.log(`Saving lämmitysenergialähde for ${rakennus.id_rakennus}:`, newValue)}
                                        />
                                    </>

                                    <>
                                        <RakennustietoRow
                                            otsikko='Rakennusaine'
                                            data={rakennus.rakennusaine}
                                            source=""
                                            modalId={`editModal-${rakennus.id_rakennus}-rakennusaine`}
                                        />
                                        <EditModal
                                            modalId={`editModal-${rakennus.id_rakennus}-rakennusaine`}
                                            name="Rakennusaine"
                                            value={rakennus.rakennusaine}
                                            onSave={(newValue) => console.log(`Saving rakennusaine for ${rakennus.id_rakennus}:`, newValue)}
                                        />
                                    </>
                                </dl>

                                <dl className="col-6">
                                    <RakennustietoRow otsikko='Kokonaisala' data={rakennus.kokonaisala} source="" />
                                    <RakennustietoRow otsikko='Kerrosala' data={rakennus.kerrosala} source="" />
                                    <RakennustietoRow otsikko='Huoneistoala' data={rakennus.huoneistoala} source="" />
                                    <RakennustietoRow otsikko='Tilavuus' data={rakennus.tilavuus} source="" />
                                    <RakennustietoRow otsikko='Kerroksia' data={rakennus.kerroksia} source="" />
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
