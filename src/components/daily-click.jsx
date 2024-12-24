/* eslint-disable react/prop-types */
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  export default function DailyClicks({ stats }) {
    // Ambil klik harian berdasarkan data
    const dailyClicks = Object.entries(stats.daily_clicks).map(([date, data]) => ({
      date,
      clicks: data.clicks,
    }));
  
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dailyClicks} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const { date, clicks } = payload[0].payload;
                  return (
                    <div>
                      <strong>{date}</strong>
                      <p>{`Klik: ${clicks}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  