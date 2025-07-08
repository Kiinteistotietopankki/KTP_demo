import React from 'react';
import RakennustietoRow from './RakennustietoRow';

export default function PerustiedotAccordion({ kiinteisto, setMapCoodinates }) {

    const setMapCoords = (coords) => {
        setMapCoodinates([coords[1], coords[0]])
    }

    // Example save handler, adapt to your needs
    const handleSave = (id, field, newValue) => {
        console.log(`Saving ${field} for rakennus ${id}:`, newValue);
        // TODO: call API or update state here
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
                                    <RakennustietoRow otsikko='Rakennustunnus' data={rakennus.rakennustunnus} editable={false} source="" showEdit={false} />
                                    <RakennustietoRow otsikko='Rakennusvuosi' data={rakennus.rakennusvuosi} editable={false}   source="" showEdit={false} />
                                    <RakennustietoRow
                                        otsikko='Sijainti'
                                        data={`${rakennus.sijainti?.coordinates[1]}, ${rakennus.sijainti?.coordinates[0]}`}
                                        source=""
                                        editable={false} 
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
                                    <RakennustietoRow
                                        otsikko='Rakennusluokitus'
                                        data={rakennus.rakennusluokitus}
                                        source=""
                                        editable={true}
                                        onSave={(newValue) => handleSave(rakennus.id_rakennus, 'rakennusluokitus', newValue)}
                                    />
                                    <RakennustietoRow
                                        otsikko='Runkotapa'
                                        data={rakennus.runkotapa}
                                        source=""
                                        editable={true}
                                        onSave={(newValue) => handleSave(rakennus.id_rakennus, 'runkotapa', newValue)}
                                    />
                                    <RakennustietoRow
                                        otsikko='Käyttötilanne'
                                        data={rakennus.kayttotilanne}
                                        source=""
                                        editable={true}
                                        onSave={(newValue) => handleSave(rakennus.id_rakennus, 'kayttotilanne', newValue)}
                                    />
                                    <RakennustietoRow
                                        otsikko='Julkisivumateriaali'
                                        data={rakennus.julkisivumateriaali}
                                        source=""
                                        editable={true}
                                        onSave={(newValue) => handleSave(rakennus.id_rakennus, 'julkisivumateriaali', newValue)}
                                    />
                                    <RakennustietoRow
                                        otsikko='Lämmitystapa'
                                        data={rakennus.lammitystapa}
                                        source=""
                                        editable={true}
                                        onSave={(newValue) => handleSave(rakennus.id_rakennus, 'lammitystapa', newValue)}
                                    />
                                    <RakennustietoRow
                                        otsikko='Lämmitysenergianlähde'
                                        data={rakennus.lammitysenergialahde}
                                        source=""
                                        editable={true}
                                        onSave={(newValue) => handleSave(rakennus.id_rakennus, 'lammitysenergialahde', newValue)}
                                    />
                                    <RakennustietoRow
                                        otsikko='Rakennusaine'
                                        data={rakennus.rakennusaine}
                                        source=""
                                        editable={true}
                                        onSave={(newValue) => handleSave(rakennus.id_rakennus, 'rakennusaine', newValue)}
                                    />
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
