import React from 'react'

export default function RakennustietoRow( {otsikko, data, source, showEdit=true} ) {
  return (
    <>
      <dt className="col-sm-3">{otsikko}

      </dt>
      <dd className={data === null ? "text-danger" : ""}>
        {data === null ? "Ei tiedossa" : data}
        {showEdit && (            
            <button
                // onClick={()=> alert(`Muokkaa ${otsikko}`)}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                aria-label={`Edit ${otsikko}`}
                title="Muokkaa"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
                >
                <i className="bi bi-pencil-square"></i>

            </button> 
        )}

        <br />
        <small className="text-muted">Lähde: {source}</small>
      </dd>
    </>
)}
