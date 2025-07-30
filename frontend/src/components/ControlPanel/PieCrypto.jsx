import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PieCrypto() {
  
    const mockCrypto = [
        { name: 'Bitcoin (BTC)', value: 4500 },
        { name: 'Ethereum (ETH)', value: 2800 },
        { name: 'Solana (SOL)', value: 1200 },
        { name: 'Cardano (ADA)', value: 900 },
        { name: 'Polkadot (DOT)', value: 600 }
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
    <div className="pie-crypto">
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={mockCrypto}
                    dataKey="value"
                    cx="50%" cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {mockCrypto.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    </div>
  )
}

export default PieCrypto