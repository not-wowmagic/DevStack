import React from 'react';

/**
 * SyntaxTable – Reusable table for syntax reference data.
 * Props:
 *   rows: Array<{ syntax: string, description: string }>
 */
function SyntaxTable({ rows }) {
    if (!rows || rows.length === 0) return null;

    return (
        <div className="syntax-table-wrapper" role="region" aria-label="Syntax reference table">
            <table className="syntax-table">
                <thead>
                    <tr>
                        <th>Syntax</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            <td>
                                <code className="syntax-code">{row.syntax}</code>
                            </td>
                            <td className="syntax-desc">{row.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SyntaxTable;
