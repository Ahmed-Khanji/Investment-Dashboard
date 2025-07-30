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
        let peak = -Infinity;
        let peakDate = null;
        let inDrawdown = false;
        const durations = [];

        statArray.forEach(({balance, date}, i) => {
            const currDate = new Date(date);
            if (balance > peak) { // drawdown finished
                if (peakDate && inDrawdown) {
                    const diffDays = (currDate - peakDate) / (1000 * 60 * 60 * 24);
                    durations.push(diffDays);
                }
                peak = balance;
                peakDate = currDate;
                inDrawdown = false;
            }
            else if (balance < peak) {
                if (!inDrawdown) {
                    inDrawdown = true;
                    peakDate = currDate;
                }
                return;
            }
        });

        if (inDrawdown && peakDate) {
            const lastDate = new Date(statArray[statArray.length - 1].date);
            const diffDays = (lastDate - peakDate) / (1000 * 60 * 60 * 24);
            if (diffDays > 0) {
                durations.push(diffDays);
            }
        }

        const sum = durations.reduce((a, b) => a + b, 0);
        return durations.length ? Math.round(sum / durations.length) + " days" : "0";
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