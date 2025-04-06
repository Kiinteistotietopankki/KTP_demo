import React from 'react';
import { Table } from 'react-bootstrap';

const Tabletemplate = ({ headers, properties, tableTitle }) => {
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
                                {properties[key] !== undefined && properties[key] !== null
                                    ? properties[key]
                                    : 'Data not available'}
                            </td>
                            <td>
                                {properties[`source_${key}`] !== undefined && properties[`source_${key}`] !== null
                                    ? properties[`source_${key}`]
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