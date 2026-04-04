import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectTransactions } from '../../redux/Slices/transactionsSlice';
import { 
  PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as AreaTooltip, Legend 
} from 'recharts';

const COLORS = ['#22d3ee', '#38bdf8', '#34d399', '#f97316', '#f43f5e', '#facc15'];

const DARK_TOOLTIP_STYLE = {
  backgroundColor: '#0b1426',
  borderColor: '#20324b',
  color: '#e8f2ff',
  borderRadius: '12px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  border: '1px solid #20324b',
  padding: '10px 14px',
  fontSize: '12px',
};

const LIGHT_TOOLTIP_STYLE = {
  backgroundColor: '#f8fcff',
  borderColor: '#dbeafe',
  color: '#0f172a',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  border: '1px solid #dbeafe',
  padding: '10px 14px',
  fontSize: '12px',
};

export const SpendingChart = ({ type = 'line' }) => {
  const transactions = useSelector(selectTransactions);
  const theme = useSelector((state) => state.ui?.theme || 'light');
  const isDark = theme === 'dark';

  const expenses = transactions.filter(t => t.type === 'expense');

  const byCategory = useMemo(() => {
    const data = {};
    expenses.forEach(e => {
      const category = e.category || "Uncategorized";
      data[category] = (data[category] || 0) + (e.convertedBase || e.amount || 0);
    });
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [expenses]);

  const trendData = useMemo(() => {
    const byDate = {};
    transactions.forEach(t => {
      if (!t.date) return;
      const dateObj = new Date(t.date);
      const dateKey = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      if (!byDate[dateKey]) {
        byDate[dateKey] = { date: dateKey, income: 0, expense: 0, rawDate: dateObj };
      }
      const amount = t.convertedBase || t.amount || 0;
      if (t.type === 'income') byDate[dateKey].income += amount;
      else if (t.type === 'expense') byDate[dateKey].expense += amount;
    });
    return Object.values(byDate).sort((a,b) => a.rawDate - b.rawDate);
  }, [transactions]);

  const gridColor = isDark ? 'rgba(148, 163, 184, 0.22)' : '#dbeafe';
  const axisColor = isDark ? '#b8c7e6' : '#64748b';

  if (type === 'line' || type === 'area') {
    return (
      <div className="h-full w-full">
        {trendData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncomeDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={isDark ? 0.2 : 0.28}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenseDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={isDark ? 0.18 : 0.24}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke={axisColor} 
                tickLine={false} 
                axisLine={false} 
                fontSize={10}
                dy={10}
                tick={{ fill: axisColor }}
              />
              <YAxis 
                stroke={axisColor} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(v) => `\u20B9${v}`} 
                fontSize={10}
                tick={{ fill: axisColor }}
              />
              <AreaTooltip contentStyle={isDark ? DARK_TOOLTIP_STYLE : LIGHT_TOOLTIP_STYLE} />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#22d3ee" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorIncomeDark)" 
                name="Income" 
                dot={false}
                activeDot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#f43f5e" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorExpenseDark)" 
                name="Expense" 
                dot={false}
                activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className={`flex items-center justify-center h-full italic text-sm ${isDark ? 'text-[#a4aac7]' : 'text-slate-500'}`}>No data available yet...</div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {byCategory.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={byCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              stroke="none"
            >
              {byCategory.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} cornerRadius={5} />
              ))}
            </Pie>
            <PieTooltip contentStyle={isDark ? DARK_TOOLTIP_STYLE : LIGHT_TOOLTIP_STYLE} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center" 
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: isDark ? '#d4e2ff' : '#64748b', fontSize: '11px', fontWeight: 700 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className={`flex items-center justify-center h-full italic text-sm ${isDark ? 'text-[#a4aac7]' : 'text-slate-500'}`}>No data available yet...</div>
      )}
    </div>
  );
};

export default SpendingChart;

