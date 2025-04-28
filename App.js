import React from 'react';
import StationMap from './components/Charts/StationMap';
import SpectrumGraphs from './components/Charts/SpectrumGraphs';
import PassesTable from './components/PassesTable';
import './styles.css';
import ephemerisData from './ephemeris.json';

function App() {
    return (
        <div className="app">
            <h1>Движение спутников</h1>

            <div className="main-container">
                <div className="side-panel">
                    <div className="panel-content">
                        <h2>Информация о станциях</h2>
                        <p>Траектории спутника {ephemerisData.metadata.satellite_name} (NORAD ID: {ephemerisData.metadata.norad_id})</p>
                        <p>Период: {new Date(ephemerisData.metadata.calculation_parameters.start).toLocaleString()} -
                            {new Date(ephemerisData.metadata.calculation_parameters.end).toLocaleString()}</p>
                    </div>
                </div>

                <div className="map-container">
                    <StationMap />
                </div>
            </div>

            <div className="graphs-container">
                <SpectrumGraphs />
            </div>

            <div className="passes-container">
                <PassesTable />
            </div>

            <div className="bottom-space"></div>
        </div>
    );
}

export default App;