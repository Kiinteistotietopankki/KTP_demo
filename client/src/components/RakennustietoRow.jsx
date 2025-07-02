import React from 'react'

export default function RakennustietoRow( {otsikko, data, source} ) {
  return (
    <>
      <dt className="col-sm-3">{otsikko}</dt>
      <dd className={data === null ? "text-danger" : ""}>
        {data === null ? "Ei tiedossa" : data} <br />
        <small className="text-muted">Lähde: {source}</small>
      </dd>
    </>
)}
