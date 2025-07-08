import React from 'react';
import RakennustietoRow from './RakennustietoRow';



export default function PerustiedotAccordion({ kiinteisto, setMapCoodinates }) {
  const setMapCoords = (coords) => {
    setMapCoodinates([coords[1], coords[0]]);
  };

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
                  <RakennustietoRow otsikko="Osoite" field="osoite" rakennus={rakennus} editable={false} showSource={false} />
                  <RakennustietoRow otsikko="Postinumero" field="postinumero" rakennus={rakennus} editable={false} showSource={false} />
                  <RakennustietoRow otsikko="Toimipaikka" field="toimipaikka" rakennus={rakennus} editable={false} showSource={false} />
                </dl>

                <dl className="col-6">
                  <RakennustietoRow otsikko="Rakennustunnus" field="rakennustunnus" rakennus={rakennus} editable={false} showSource={false}/>
                  <RakennustietoRow otsikko="Rakennusvuosi" field="rakennusvuosi" rakennus={rakennus} editable={false} showSource={false} />
                  <RakennustietoRow
                    otsikko="Sijainti"
                    field="sijainti"
                    rakennus={{
                      ...rakennus,
                      sijainti: `${rakennus.sijainti?.coordinates[1]}, ${rakennus.sijainti?.coordinates[0]}`,
                    }}
                    editable={false}
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
                  {[
                    'rakennusluokitus',
                    'runkotapa',
                    'kayttotilanne',
                    'julkisivumateriaali',
                    'lammitystapa',
                    'lammitysenergialahde',
                    'rakennusaine',
                  ].map(field => (
                    <RakennustietoRow
                      key={field}
                      otsikko={field[0].toUpperCase() + field.slice(1).replace(/_/g, ' ')}
                      field={field}
                      rakennus={rakennus}
                    />
                  ))}
                </dl>

                <dl className="col-6">
                  {[
                    'kokonaisala',
                    'kerrosala',
                    'huoneistoala',
                    'tilavuus',
                    'kerroksia',
                  ].map(field => (
                    <RakennustietoRow
                      key={field}
                      otsikko={field[0].toUpperCase() + field.slice(1).replace(/_/g, ' ')}
                      field={field}
                      rakennus={rakennus}
                    />
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}