import React, { useState, useEffect } from 'react';

const PassesTable = () => {
    const [passesData, setPassesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/passes.json');
                if (!response.ok) {
                    throw new Error('Сетевая ошибка');
                }
                const data = await response.json();
                setPassesData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
         
        fetchData();
    }, []);

    if (loading) {
        return <div>Загрузка данных о путях...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!passesData || !passesData.passes || passesData.passes.length === 0) {
        return <div>Данные о путях недоступны</div>;
    }

    return (
        <div className="passes-table">
            <h2>Информация о путях спутников</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID Пути</th>
                        <th>Начало пути (UTC)</th>
                        <th>Конец пути (UTC)</th>
                        <th>Продолжительность (мин)</th>
                        <th>Макс. Высота (°)</th>
                    </tr>
                </thead>
                <tbody>
                    {passesData.passes.map((passItem) => (
                        <tr key={passItem.pass_id}>
                            <td>{passItem.pass_id}</td>
                            <td>{new Date(passItem.start).toUTCString()}</td>
                            <td>{new Date(passItem.end).toUTCString()}</td>
                            <td>{(passItem.duration_sec / 60).toFixed(1)}</td>
                            <td>{passItem.max_elevation.toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PassesTable;
