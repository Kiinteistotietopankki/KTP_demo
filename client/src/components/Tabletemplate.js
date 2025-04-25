import React from 'react';
import { Table } from 'react-bootstrap';

const Tabletemplate = ({ properties, tableTitle }) => {
    // Fallback in case properties is null or undefined
    const safeProperties = properties || {};

    // Dynamically generate headers from properties keys
    const headers = Object.keys(safeProperties).map((key) => ({
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
                    {headers.map(({ key, label }) => {
                        const property = safeProperties[key];

                        const value = property?.value ? property.value : '-';
                        const source = property?.value ? property.source : '-'

                        return (
                            <tr key={key}>
                                <td>{label}</td>
                                <td>{value}</td>
                                <td>{source}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default Tabletemplate;
