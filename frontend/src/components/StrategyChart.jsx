import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../styles/StrategyChart.css';

export default function StrategyChart() {
    const mockData = [
        {date: '06/29/2015', balance: 100}, // time in MM/DD/YYYY, balance in usd $
        {date: '07/12/2016', balance: 50},
        {date: '08/22/2016', balance: 150},
    ]
    // State for raw stat and chart ready arrays
    const [statArray, setStatArray] = useState(mockData);
    const [chartData, setChartData] = useState([]);

    // Fetches from backend and updates statArray
    async function fetchBalance() {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/all-balances/');
            const data = await res.json();
            setStatArray(prev => [...prev, ...data]);
            return [...statArray, ...data]; // return updated array for parsing
        } 
        catch (err) {
            console.error(err.message);
            return statArray; // fallback
        }
    }

    // Parses given array into chart-ready format
    function parseChartData(array) {
        const grouped = {};
        array.forEach(stat => {
            const dateObj = new Date(stat.date);
            const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObj);
            const year = `'${dateObj.getFullYear().toString().slice(-2)}`;
            const monthYear = `${month} ${year}`;

            if (!grouped[monthYear]) grouped[monthYear] = [];
            grouped[monthYear].push(parseFloat(stat.balance)); // ensure balance is number
        });

        const parsed = Object.entries(grouped).map(([month, balances]) => {
            const sum = balances.reduce((a, b) => a + b, 0);
            const avg = sum / balances.length;
            return {
                date: month,
                balance: Math.round(avg * 100) / 100
            };
        });
        setChartData(parsed);
    }
    
    useEffect(() => {
        (async () => {
            const fullArray = await fetchBalance(); // wait for updated array
            parseChartData(fullArray);
        })(); // declaring and calling the function at the same time
    }, []);

    return (
        <>
            <div className="column">
                <h2>Strategy Chart</h2>
                <div className="chart">
                     <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <Line 
                                type="monotone" dataKey="balance" 
                                stroke={chartData[chartData.length - 1]?.balance >= 0 ? 'green' : 'red'} 
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} tickFormatter={(tick) => `$${tick}`} />
                            <Tooltip
                                formatter={(value) => {
                                   const color = value > 0 ? 'green' : 'red';
                                   return <span style={{color}}>{`$${value}`}</span>
                                }}
                                labelFormatter={(label) => {
                                    // label is something like "Jun '16"
                                    const [monthStr, yearStr] = label.split(" '");
                                    const fullDate = new Date(`${monthStr} 1, 20${yearStr}`); // e.g., "Jun 1, 2016"
                                    const fullMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(fullDate);
                                    const year = fullDate.getFullYear();
                                    return `${fullMonth} ${year}`; // e.g., "June 2016"
                                }}
                            />
                        </LineChart>
                     </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

