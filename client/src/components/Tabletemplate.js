import React from 'react';

const TableTemplate = ({ properties = {}, tableTitle }) => {
  const entries = Object.entries(properties);

  const fontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif`;

    return (
      <div className="mb-1" style={{ fontFamily }}>
        {/* Responsive font size styles */}
        <style>
          {`
            .responsive-table {
              font-size: 0.9rem;
            }
            @media (max-width: 576px) {
              .responsive-table {
                font-size: 0.75rem; /* smaller text on xs devices */
              }
              .responsive-table th {
                white-space: normal; /* allow label wrap on mobile */
              }
            }
          `}
        </style>

        {tableTitle && (
          <h5
            className="mb-3 text-primary fw-semibold"
            style={{ fontWeight: 600 }}
          >
            {tableTitle}
          </h5>
        )}

        {entries.length === 0 ? (
          <p className="text-muted fst-italic">Ei tietoja saatavilla</p>
        ) : (
          <div className="table-responsive">
            <table
              className="table table-bordered align-middle responsive-table"
              style={{ fontFamily }}
            >
              <tbody>
                {entries.map(([key, { value } = {}]) => {
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase());
                  const displayValue = Array.isArray(value)
                    ? value.join(', ')
                    : value ?? '-';

                  return (
                    <tr key={key}>
                      <th
                        scope="row"
                        style={{
                          backgroundColor: '#f8f9fa',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          width: '30%',
                        }}
                        title={label}
                      >
                        {label}
                      </th>
                      <td style={{ color: '#212529' }} title={displayValue}>
                        {displayValue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

export default TableTemplate;
