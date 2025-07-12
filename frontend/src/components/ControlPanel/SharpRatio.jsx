import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function SharpRatio({statArray}) {
    const [sharpRatio, setSharpRatio] = useState([]);

    // how much units of return ($) per unit of risk (>1 or else weak strategy)
    function computeSharpRatio() {
        // loop over all statArray
        const result = [];
        for (let i = 1; i < statArray.length; i++) {
            // get window of the statArray
            const window = statArray.slice(Math.max(0, i - 30), i + 1);
            // loop over it and get the return
            const returns = []; // returns array for one day
            for (let j = 1; j < window.length; j++) {
                const prev = window[j - 1].balance;
                const curr = window[j].balance;
                const ret = (curr - prev) / prev;
                returns.push(ret);
            }
            // calculate sharp ratio and added to the array
            const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
            const std = Math.sqrt(returns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / returns.length);
            const sharpe = std !== 0 ? (mean - 0.03) / std : 0; // risk free is 3%
            // add it to sharpRatio array in formatted way
            const fullDate = new Date(statArray[i].date).toISOString().split("T")[0]; // YYYY-MM-DD
            result.push({
                date: fullDate,
                sharp: sharpe
            });
        }
        return result; 
    }

    useEffect(() => {
        const result = computeSharpRatio();
        console.log("Sharpe Data:", result); // test
        setSharpRatio(result);
    }, [statArray]);

    const strokeColor = sharpRatio.length > 0 && sharpRatio[sharpRatio.length - 1].sharp >= 1
      ? "#00ff7f" // green
      : "#ff4d4d"; // red

    return (
        <>
            <div className='chart-container'>
                <h2>Daily Sharpe Ratios</h2>
                <div className="sharp-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sharpRatio}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="sharp" stroke={strokeColor} />
                            <XAxis dataKey='date' />
                            <YAxis domain={['auto', 'auto']} />
                        </LineChart>
                    </ResponsiveContainer>
                </div> 
            </div>
             
        </>
    )
}