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
    const mockData = [
        {date: '06/29/2015', balance: 100}, // time in MM/DD/YYYY, balance in usd $
        {date: '07/12/2016', balance: 50},
        {date: '08/22/2016', balance: 150},
    ]
    const [statArray, setStatArray] = useState(mockData);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/all-balances/')
            .then(res => res.json())
            .then(data => {
                setStatArray(prev => [...prev, ...data]);
            })
            .catch(err => console.error(err.message));
    }, []);

    // parse statArray into analysable array [{date (month 'year), balance (first seen day of month)},...]
    function parsedData() {
        const seenMonths = new Set();
        const firstOfMonthBalances = [];
        statArray.forEach(stat => {
            const dateObj = new Date(stat.date);
            const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObj);
            const year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(dateObj);
            const key = `${month} '${year}`;
            // adding first day appearance of that month
            if (!seenMonths.has(key)) {
                seenMonths.add(key);
                const newStat = {
                    date: key,
                    rawDate: dateObj,
                    balance: stat.balance
                }
                firstOfMonthBalances.push(newStat);
            }
        });
        return firstOfMonthBalances;
    }

    // calculate and return array of mthlyReturns
    function computeMthlyReturns() {
        const tempArr = parsedData();
        const tempArr2 = tempArr.map((stat, i) => {
            if (i === 0) return {date: stat.date, return: 0}
            const first = tempArr[0].balance;
            const curr = stat.balance;
            const cumulative = ((curr - first) / first) * 100;
            return {
                date: stat.date,
                return: parseFloat(cumulative.toFixed(2)) // percentage
            }
        });
       setMthlyReturns(tempArr2);
    }
    useEffect(() => {
        computeMthlyReturns();
    }, [statArray]);

    return (
        <> 
            <div className="container">
                <h2>Portfolio Summary</h2>
                <div className="panel">
                    <div className='grid'>
                        <div className='top-left'>
                            {mthlyReturns.map((stat, index) => (
                                <p key={index}>
                                    {stat.date}: {stat.return}%
                                </p>
                            ))}
                        </div>       
                        <div></div>
                        <div className='top-right'>
                            <p>Top Right</p>
                        </div>

                        <div></div>
                        <div className='center-metric'>
                            <p>Center Metric</p>
                        </div>
                        <div></div>

                        <div className='bottom-left'>
                            <p>Bottom Left</p>
                        </div>
                        <div></div>
                        <div className='bottom-right'>
                            <p>Bottom Right</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}