import React, { useState } from 'react';

const PTSReportForm = () => {
  const [reportTitle, setReportTitle] = useState('Pitkän tähtäimen suunnitelma (PTS)');
  const [kohde, setKohde] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('fi-FI'));
  const [johdanto, setJohdanto] = useState('');
  const [kustannukset, setKustannukset] = useState('');
  const [tutkimustarpeet, setTutkimustarpeet] = useState('');
  const [rakennetekniikka, setRakennetekniikka] = useState('');
  const [lvi, setLVI] = useState('');
  const [sahko, setSahko] = useState('');
  const [toimenpiteet, setToimenpiteet] = useState('');
  const [allekirjoitus, setAllekirjoitus] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">

      {/* Kansisivu */}
      <div className="border p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">📄 Kansisivu</h2>
        <input
          type="text"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          placeholder="Raportin otsikko"
          className="form-control mb-3"
        />
        <input
          type="text"
          value={kohde}
          onChange={(e) => setKohde(e.target.value)}
          placeholder="Kohteen nimi ja osoite"
          className="form-control mb-3"
        />
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Päivämäärä"
          className="form-control"
        />
      </div>

      {/* Johdanto */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Johdanto</h3>
        <textarea
          value={johdanto}
          onChange={(e) => setJohdanto(e.target.value)}
          rows={4}
          className="form-control"
        />
      </div>

      {/* Kustannusten jakautuminen */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Kustannusten jakautuminen</h3>
        <textarea
          value={kustannukset}
          onChange={(e) => setKustannukset(e.target.value)}
          rows={4}
          className="form-control"
        />
      </div>

      {/* Tutkimustarpeet */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Tutkimustarpeet</h3>
        <textarea
          value={tutkimustarpeet}
          onChange={(e) => setTutkimustarpeet(e.target.value)}
          rows={4}
          className="form-control"
        />
      </div>

      {/* Rakennetekniikka */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Rakennetekniikka</h3>
        <textarea
          value={rakennetekniikka}
          onChange={(e) => setRakennetekniikka(e.target.value)}
          rows={4}
          className="form-control"
        />
      </div>

      {/* LVI-tekniikka */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">LVI-tekniikka</h3>
        <textarea
          value={lvi}
          onChange={(e) => setLVI(e.target.value)}
          rows={4}
          className="form-control"
        />
      </div>

      {/* Sähkötekniikka */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Sähkötekniikka</h3>
        <textarea
          value={sahko}
          onChange={(e) => setSahko(e.target.value)}
          rows={4}
          className="form-control"
        />
      </div>

      {/* Suositellut toimenpiteet ja aikataulut */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Suositellut toimenpiteet ja aikataulut</h3>
        <textarea
          value={toimenpiteet}
          onChange={(e) => setToimenpiteet(e.target.value)}
          rows={4}
          className="form-control"
        />
      </div>

      {/* Allekirjoitukset */}
      <div className="border p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Allekirjoitukset</h3>
        <textarea
          value={allekirjoitus}
          onChange={(e) => setAllekirjoitus(e.target.value)}
          rows={3}
          className="form-control"
        />
      </div>

      {/* Tallenna tai vie PDF:nä -painikkeet */}
      <div className="flex justify-end space-x-2">
        <button className="btn btn-primary">Tallenna</button>
        <button className="btn btn-secondary">Vie PDF</button>
      </div>

    </div>
  );
};

export default PTSReportForm;
