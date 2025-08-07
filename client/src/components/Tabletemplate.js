import React from 'react';
import { Table } from 'react-bootstrap';

const TableTemplate = ({ properties = {}, tableTitle }) => {
  const headers = Object.keys(properties).map((key) => ({
    key,
    label: key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
  }));

  return (
    <div className="mb-4">
      {tableTitle && (
        <h5 className="mb-3 text-primary fw-semibold">{tableTitle}</h5>
      )}

      <div
        className="table-responsive"
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          width: '100%',
        }}
      >
        <Table
          className="table-sm mb-0 shadow rounded-3 overflow-hidden"
          style={{
            fontSize: '0.9rem',
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
          }}
        >
          <thead
            style={{
              background: 'linear-gradient(to right, #e9f0ff, #f4f8ff)',
              color: '#2c3e50',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}
          >
            <tr>
              <th
                style={{
                  width: '35%',
                  whiteSpace: 'nowrap',
                  borderBottom: '2px solid #dee2e6',
                  padding: '0.75rem',
                }}
              >
                Ominaisuus
              </th>
              <th
                style={{
                  width: '65%',
                  wordBreak: 'break-word',
                  borderBottom: '2px solid #dee2e6',
                  padding: '0.75rem',
                }}
              >
                Arvo
              </th>
            </tr>
          </thead>
          <tbody>
            {headers.map(({ key, label }, index) => {
              const { value } = properties[key] || {};
              const displayValue = Array.isArray(value)
                ? value.join(', ')
                : value ?? '-';

              return (
                <tr
                  key={key}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                    transition: 'background-color 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eef5ff';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? '#f8f9fa' : '#ffffff';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                    <td
                    className="fw-semibold"
                    style={{
                        padding: '0.65rem',
                        whiteSpace: 'nowrap',   // ✅ Prevents line wrapping
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '1px'         // ✅ Forces ellipsis when too long
                    }}
                    >
                    {label}
                    </td>
                  <td className="text-break" style={{ padding: '0.65rem' }}>
                    {displayValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TableTemplate;
