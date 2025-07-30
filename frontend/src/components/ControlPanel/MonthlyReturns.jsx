import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Area, AreaChart
} from 'recharts';

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
    }, [firstOfMonthBalances]);
    // Monthly return Array: [{date: mm 'y, return: xx.xx%}]

    return (
    <div className="chart-container">
      <h2>Monthly Cumulative Returns</h2>
      <div className="mthly-chart">
        <ResponsiveContainer>
          <AreaChart data={mthlyReturns}>
            <defs>
              <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C853" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#00C853" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#ccc"
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              formatter={(value) => `${value.toFixed(2)}%`}
              labelStyle={{ color: '#fff' }}
              contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
            />
            <Area
              type="linear"
              dataKey="return"
              stroke="#00C853"
              fill="url(#colorReturn)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}