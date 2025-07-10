import { useState, useEffect } from 'react';
import '../../styles/ControlPanel.css';
import MonthlyReturns from './MonthlyReturns';
import Ratios from './Ratios';
import DrawDown from './DrawDown';

export default function ControlPanel() {
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
    const [firstOfMonthBalances, setFirstOfMonthBalances] = useState([]);
    useEffect(() => {
        const seenMonths = new Set();
        const firsts = [];

        statArray.forEach(stat => {
            const dateObj = new Date(stat.date);
            const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObj);
            const year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(dateObj);
            const key = `${month} '${year}`;

            if (!seenMonths.has(key)) {
                seenMonths.add(key);
                firsts.push({
                    date: key,
                    rawDate: dateObj,
                    balance: stat.balance,
                });
            }
        });

        setFirstOfMonthBalances(firsts);
    }, [statArray]);

    return (
        <>
            <div className="container">
                <h2>Portfolio Summary</h2>
                <div className="panel">
                    <div className='grid'>
                        <div className='top-left'>
                            <MonthlyReturns 
                                statArray={statArray}
                                firstOfMonthBalances={firstOfMonthBalances}
                            />
                        </div>     
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