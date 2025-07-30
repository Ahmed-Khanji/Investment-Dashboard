import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function SortinoRatio({statArray}) {
    const [sortinoRatio, setSortinoRatio] = useState([]);

    function computeSortinoRatio() {
        const result = [];
        const MAR = 0; // Minimum Acceptable Return

        for (let i = 1; i < statArray.length; i++) {
            // Step 1: Create rolling window of up to 30 days
            const window = statArray.slice(Math.max(0, i - 30), i + 1);

            // Step 2: Extract daily returns
            const returns = [];
            for (let j = 1; j < window.length; j++) {
                const prev = window[j - 1].balance;
                const curr = window[j].balance;
                const ret = (curr - prev) / prev;
                returns.push(ret);
            }

            // Step 3: Calculate average return
            const avg = returns.reduce((a, b) => a + b, 0) / returns.length;

            // Step 4: Downside deviation (only returns < MAR)
            const downside = returns.filter(r => r < MAR).map(r => (r - MAR) ** 2);
            const downsideDeviation = downside.length > 0
                ? Math.sqrt(downside.reduce((a, b) => a + b, 0) / downside.length)
                : 0;

            // Step 5: Compute Sortino ratio
            const sortino = downsideDeviation !== 0 ? (avg - MAR) / downsideDeviation : 0;

            // Step 6: Format date and push result
            const fullDate = new Date(statArray[i].date).toISOString().split("T")[0];
            result.push({
                date: fullDate,
                sortino: sortino
            });
        }
        return result;
    }

    useEffect(() => {
        const result = computeSortinoRatio();
        setSortinoRatio(result);
    }, [statArray]);

    return (
        <div className='chart-container'>
            <h2>Daily Sortio Ratios</h2>
            <div className="sortino-chart">
                <ResponsiveContainer>
                    <LineChart data={sortinoRatio}>
                        <Line type="monotone" dataKey="sortino" stroke="#007AFF" dot={false} />
                        <XAxis dataKey='date' />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip
                            formatter={(value) => `${value.toFixed(2)}`}
                            labelStyle={{ color: '#fff' }}
                            contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}