/* eslint-disable react/prop-types */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Tentukan warna untuk tiap kategori

export default function Location({ stats }) {
  // Ambil klik berdasarkan bulan terakhir (misalnya, Desember 2024)
  const monthlyClicks = stats.monthly_clicks["2024-12"]; 

  // Hitung jumlah klik per kota
  const cityCount = Object.entries(monthlyClicks.cities).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={cityCount} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const { city, count } = payload[0].payload;
                return (
                  <div>
                    <strong>{city}</strong>
                    <p>{`Klik: ${count}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
