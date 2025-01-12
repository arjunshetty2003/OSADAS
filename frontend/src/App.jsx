import React, { useEffect, useState } from 'react';

const App = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Fetch logs from the backend
        fetch('http://127.0.0.1:5001/api/logs')
            .then((response) => response.json())
            .then((data) => setLogs(data))
            .catch((error) => console.error('Error fetching logs:', error));
    }, []);

    return (
        <div>
            <h1>OSADAS Logs</h1>
            <table>
                <thead>
                    <tr>
                        <th>Event Type</th>
                        <th>Severity</th>
                        <th>Details</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td>{log.eventType}</td>
                            <td>{log.severity}</td>
                            <td>{log.details}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;