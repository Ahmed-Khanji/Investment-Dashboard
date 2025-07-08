import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../styles/StrategyChart.css';

export default function StrategyChart() {
    const mockData = [
        {time: '06/29/2015', balance: 100}, // time in MM/DD/YYYY, balance in usd $
        {time: '07/12/2016', balance: 50},
        {time: '08/22/2016', balance: 150},
    ]
    // State for array and single stat
    const [chartData, setChartData] = useState(mockData);
    // const [stat, setStat] = useState('');

    // fetching daily balance
    function fetchBalance() {
        fetch('http://127.0.0.1:8000/api/balance/')
            .then(res => res.json())
            .then(data => {
                console.log("Parsed JSON", data); // testing
                const newBalance = {
                    time: new Date().toLocaleDateString(),
                    balance: data.balance
                };
                setChartData([...chartData, newBalance]);
            })
            .catch(err => console.error(err.message));
    }
    useEffect(() => {
        fetchBalance();
        const now = new Date();
        const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const delay = nextMidnight - now;

        const timeout = setTimeout(() => {
            fetchBalance();
            setInterval(fetchBalance, 24*60*60*1000) // 24 hours
        }, delay);

        return () => clearTimeout(timeout); // cleanup when unmount
    }, []);

    return (
        <>
            <ul>
                {chartData.map(stat => (
                    <p>{stat.time}: {stat.balance}</p>
                ))}
            </ul>
        </>
    )
}