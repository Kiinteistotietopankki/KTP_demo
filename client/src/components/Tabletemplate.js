import React from 'react';
import { Table } from 'react-bootstrap';

const TableTemplate = ({ properties = {}, tableTitle }) => {
    const headers = Object.keys(properties).map((key) => ({
        key,
        label: key
            .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    }));

    return (
        <div className="mb-4">
            {tableTitle && (
                <h5 className="mb-3 text-primary fw-semibold">{tableTitle}</h5>
            )}
            <Table striped bordered hover responsive className="table-sm shadow-sm">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: '30%' }}>Ominaisuus</th>
                        <th style={{ width: '50%' }}>Arvo</th>
                        <th style={{ width: '20%' }}>Lähde</th>
                    </tr>
                </thead>
                <tbody>
                    {headers.map(({ key, label }) => {
                        const { value, source } = properties[key] || {};
                        const displayValue = Array.isArray(value)
                            ? value.join(', ')
                            : value ?? '-';
                        const displaySource = value ? source : '-';

                        return (
                            <tr key={key}>
                                <td className="fw-medium">{label}</td>
                                <td>{displayValue}</td>
                                <td className="text-muted small">{displaySource}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default TableTemplate;
