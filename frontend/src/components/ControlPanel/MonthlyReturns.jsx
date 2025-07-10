import { useState, useEffect } from 'react';

export default function MonthlyReturns({ statArray, firstOfMonthBalances}) {
    const [mthlyReturns, setMthlyReturns] = useState([]);

    // calculate and return array of mthlyReturns
    function computeMthlyReturns() {
        const tempArr = firstOfMonthBalances.map((stat, i) => {
            if (i === 0) return {date: stat.date, return: 0}
            const first = firstOfMonthBalances[0].balance;
            const curr = stat.balance;
            const cumulative = ((curr - first) / first) * 100;
            return {
                date: stat.date,
                return: parseFloat(cumulative.toFixed(2)) // percentage
            }
        });
       setMthlyReturns(tempArr);
    }
    useEffect(() => {
        computeMthlyReturns();
    }, [statArray]);
    
    return (
        <>
            <div>
                <h4>Monthly Returns</h4>
                {mthlyReturns.map((stat, index) => (
                    <p key={index}>{stat.date}: {stat.return}%</p>
                ))}
            </div>
        </>
    )
}