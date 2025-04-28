import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const SpectrumGraphs = () => {
    const [data, setData] = useState([]);
    const [latestSlice, setLatestSlice] = useState([]);

    useEffect(() => {
        const initData = Array.from({ length: 50 }, () =>
            Array.from({ length: 100 }, () => Math.random() * 50)
        );
        setData(initData);
        setLatestSlice(initData[initData.length - 1]);

        const interval = setInterval(() => {
            const newSlice = Array.from({ length: 100 }, () =>
                Math.random() * -50 + (Math.random() > 0.95 ? 20 : 0)
            );
            setData((prevData) => {
                const updated = [...prevData.slice(1), newSlice];
                return updated;
            });
            setLatestSlice(newSlice);
        }, 600);

        return () => clearInterval(interval);
    }, []);

    const x = Array.from({ length: 100 }, (_, i) => 100 + i * 0.1); // Frequency (MHz)
    const y = Array.from({ length: 50 }, (_, i) => i * 0.1); // Time (sec)

    return (
        <div className="spectrum-container">
            <Plot
                data={[
                    {
                        x: x,
                        y: latestSlice,
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: '#1E90FF' },
                        name: 'Spectrum',
                        xaxis: 'x1',
                        yaxis: 'y1',
                        hovertemplate: '<b>Frequency:</b> %{x:.2f} MHz<br><b>Relative Gain:</b> %{y:.2f} dB<extra></extra>',
                    },
                    {
                        z: data,
                        x: x,
                        y: y,
                        type: 'heatmap',
                        colorscale: 'Jet',
                        zmin: -80,
                        zmax: 20,
                        name: 'Waterfall',
                        xaxis: 'x2',
                        yaxis: 'y2',
                        hovertemplate: '<b>Frequency:</b> %{x:.2f} MHz<br><b>Time:</b> %{y:.2f} sec<br><b>Amplitude:</b> %{z:.2f} dB<extra></extra>',
                    }
                ]}
                layout={{
                    grid: {
                        rows: 2,
                        columns: 1,
                        subplots: [['xy'], ['x2y2']],
                        roworder: 'top to bottom',
                        pattern: 'independent',
                        rowheights: [0.6, 0.4]
                    },
                    autosize: true,
                    height: 250, // Увеличил высоту для лучшего отображения подписей
                    margin: {
                        l: 60,  // Увеличил левый отступ для подписей осей
                        r: 30,
                        t: 30,
                        b: 60,  // Увеличил нижний отступ для подписей осей
                        pad: 0
                    },
                    // Основной график (верхний)
                    xaxis: {
                        title: {
                            text: 'Frequency (MHz)',
                            standoff: 15,  // Отступ подписи оси
                            font: {
                                size: 12
                            }
                        },
                        color: '#D0D0D0',
                        tickcolor: '#D0D0D0',
                        tickfont: { color: '#D0D0D0', size: 10 },
                        showline: false,
                        zeroline: false,
                        domain: [0.1, 0.9],  // Выравниваем по тому же домену, что и водопад
                        anchor: 'y1'
                    },
                    yaxis: {
                        title: {
                            text: 'Relative Gain (dB)',
                            standoff: 15,  // Отступ подписи оси
                            font: {
                                size: 12
                            }
                        },
                        color: '#D0D0D0',
                        tickcolor: '#D0D0D0',
                        tickfont: { color: '#D0D0D0', size: 10 },
                        showline: false,
                        zeroline: false,
                        anchor: 'x1',
                        range: [0, 50]
                    },
                    // Водопад (нижний график)
                    xaxis2: {
                        title: {
                            text: 'Frequency (MHz)',
                            standoff: 15,  // Отступ подписи оси
                            font: {
                                size: 12
                            }
                        },
                        color: '#D0D0D0',
                        tickcolor: '#D0D0D0',
                        tickfont: { color: '#D0D0D0', size: 10 },
                        showline: false,
                        zeroline: false,
                        domain: [0.1, 0.9],  // Узкий водопад (10% отступ слева и справа)
                        anchor: 'y2'
                    },
                    yaxis2: {
                        title: {
                            text: 'Time (sec)',
                            standoff: 10,  // Отступ подписи оси
                            font: {
                                size: 12
                            }
                        },
                        color: '#D0D0D0',
                        tickcolor: '#D0D0D0',
                        tickfont: { color: '#D0D0D0', size: 10 },
                        showline: false,
                        zeroline: false,
                        anchor: 'x2'
                    },
                    showlegend: false,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    hovermode: 'closest',
                    hoverlabel: {
                        font: {
                            color: '#D0D0D0',
                            family: '"JetBrains Mono", monospace',
                            size: 12
                        },
                        bgcolor: '#2A2F31',
                        bordercolor: '#1E90FF',
                        align: 'left'
                    },
                    annotations: [
                        // Подпись для верхнего графика
                        {
                            x: 1.02,  // Правее основного графика
                            y: 0.5,
                            xref: 'paper',
                            yref: 'paper',
                            text: 'dB',
                            showarrow: false,
                            font: {
                                size: 12,
                                color: '#D0D0D0'
                            },
                            xanchor: 'left',
                            textangle: -90
                        },
                        // Подпись для нижнего графика
                        {
                            x: 1.02,  // Правее водопада
                            y: 0.2,
                            xref: 'paper',
                            yref: 'paper',
                            text: 'sec',
                            showarrow: false,
                            font: {
                                size: 12,
                                color: '#D0D0D0'
                            },
                            xanchor: 'left',
                            textangle: -90
                        }
                    ]
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                config={{
                    displayModeBar: false
                }}
            />
        </div>
    );
};

export default SpectrumGraphs;