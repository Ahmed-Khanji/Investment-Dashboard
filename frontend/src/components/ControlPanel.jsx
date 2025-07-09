import { useState, useEffect } from 'react';
import '../styles/ControlPanel.css';

export default function ControlPanel() {
    // states for the metrics
    const [mthlyReturns, setMthlyReturns] = useState([]);
    const [sharpRatio, setSharpRatio] = useState(0);
    const [sortinoRatio, setSortinoRatio] = useState(0);
    const [maxDrawDown, setMaxDrawDown] = useState(0);
    const [avgDrawDown, setAvgDrawDown] = useState(0);
    const [avgDownDuration, setAvgDownDuration] = useState(0);
    const [mthWinRate, setMthWinRate] = useState(0);
    // 2 other after

    // fetch statArray 
    const [statArray, setStatArray] = useState([]);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/all-balances/')
            .then(res => res.json())
            .then(data => {
                setStatArray(data);
            })
            .catch(err => console.error(err.message));
    }, []);

    // calculate monthly Return
    function computeMontlyReturn() {
        mthlyReturns = statArray.map((stat, i) => {
            
        });
    }

    return (
        <> 
            <div className="container">
                <h2>Portfolio Summary</h2>
                <div className="panel">
                    <div className='grid'>
                        <div><p>metric</p></div>
                        <div><p>metric</p></div>
                        <div><p>metric</p></div>
                        
                        <div><p>metric</p></div>
                        <div><p>metric</p></div>
                        <div><p>metric</p></div>

                        <div><p>metric</p></div>
                        <div><p>metric</p></div>
                        <div><p>metric</p></div>
                    </div>
                </div>
            </div>
        </>
    )
}