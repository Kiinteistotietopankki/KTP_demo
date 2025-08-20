import React from 'react';

export default function PreviewPane({ previewUrl, onDownload }) {
  return (
    <>
      {previewUrl ? (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'92vh', backgroundColor:'#f8f9fa' }}>
          <div style={{ width:'80vw', height:'90vh', backgroundColor:'#fff', boxShadow:'0 0 10px rgba(0,0,0,0.1)', borderRadius:8, overflow:'hidden' }}>
            <embed src={previewUrl} type="application/pdf" style={{ width:'100%', height:'100%' }} />
          </div>
        </div>
      ) : (
        <div className="p-4 text-muted">Ei esikatselua vielä ladattu.</div>
      )}
      <div className="mb-3">
        <button onClick={onDownload} className="btn btn-outline-primary btn-sm">📥 Lataa Raportti</button>
      </div>
    </>
  );
}
