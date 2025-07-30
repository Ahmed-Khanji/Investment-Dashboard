import { useState, useEffect } from 'react';

export default function DrawDown({statArray}) {
    const [maxDrawDown, setMaxDrawDown] = useState(0);
    const [avgDrawDown, setAvgDrawDown] = useState(0);
    const [avgDownDuration, setAvgDownDuration] = useState(0);

    function computeMaxDrawdown() {
        let peak = -Infinity; let maxDrawdown = 0;

        statArray.forEach(({ balance }) => {
            if (balance > peak) peak = balance;
            const drawdown = (balance - peak) / peak; // gives negative
            if (drawdown < maxDrawdown) maxDrawdown = drawdown;
        });

        return (maxDrawdown * 100).toFixed(2) + "%"; // returns a negative %
    }


    function computeAvgDrawdown() {
        let peak = -Infinity; let sumDrawdown = 0; let count = 0;

        statArray.forEach(({ balance }) => {
            if (balance > peak) peak = balance;
            const drawdown = (balance - peak) / peak;
            if (drawdown < 0) {
                sumDrawdown += drawdown;
                count++;
            }
        });
        return count > 0 ? (sumDrawdown / count).toFixed(2) + "%" : 0;
    }

    
    // in days
    function computeAvgDur() {
        let peak = -Infinity; let peakDate = null; 
        let inDrawdown = false; const durations = [];

        statArray.forEach(({ balance, date }) => {
            // thats the end of drawduration, where we compute duration
            if (balance > peak) {
                if (inDrawdown && peakDate) {
                    const diffDays = (date - peakDate) / (1000 * 60 * 60 * 24);
                    if (diffDays > 0) durations.push(diffDays);
                    inDrawdown = false;
                }
                peak = balance;
                peakDate = date;
            }
            else if (balance < peak && !inDrawdown) {
                inDrawdown = true; // if balance < peak, were in drawdown 
            }
        });

        const sum = durations.reduce((a, b) => a + b, 0);
        return durations.length ? (sum / durations.length).toFixed(1) : 0;
    }


    useEffect(() => {
        const maxdd = computeMaxDrawdown();
        const avgdd = computeAvgDrawdown();
        const avgdur = computeAvgDur();
        setMaxDrawDown(maxdd);
        setAvgDrawDown(avgdd);
        setAvgDownDuration(avgdur);
    }, [statArray]);

    return (
        <div>
            <h3>Draw Down Metrics</h3>
            <p>Max Draw Down: {maxDrawDown}</p>
            <p>Average Draw Down: {avgDrawDown}</p>
            <p>Average Draw Down Duration: {avgDownDuration}</p>
        </div>
    )
}