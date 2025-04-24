import React from 'react';
import { Table } from 'react-bootstrap';

const Tabletemplate = ({ rakennus, tableTitle }) => {
    // Dynamically generate headers from properties keys
    const headers = Object.keys(rakennus.properties).map((key) => ({
        key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())  // Convert camelCase to human-readable text
    }));

    return (
        <div className="mb-3">
            {tableTitle && <h6>{tableTitle}</h6>}
            <Table striped bordered responsive hover style={{ fontSize: '0.8em' }}>
                <thead>
                    <tr>
                        <th>Ominaisuus</th>
                        <th>Arvo</th>
                        <th>Lähde</th>
                    </tr>
                </thead>
                <tbody>
                    {headers.map(({ key, label }) => (
                    <tr key={key}>
                    <td>{label}</td>
                    <td>
                        {rakennus.properties[key] !== undefined && rakennus.properties[key] !== null
                            ? rakennus.properties[key]
                            : 'Ei tiedossa'}
                    </td>
                    <td>
                        {/* Access the correct source */}
                        {rakennus.sources[key] !== undefined && rakennus.sources[key] !== null
                            ? rakennus.sources[key]
                            : '-'}
                    </td>
                </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Tabletemplate;
