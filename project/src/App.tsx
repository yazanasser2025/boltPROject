import React, { useState } from 'react';
import { Upload, Target, CheckCircle, AlertTriangle, Percent } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Radar, PolarArea, Pie } from 'react-chartjs-2';

// Register ALL required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-SA').format(num);
}

function App() {
  const [data, setData] = useState({
    labels: ['المكاتب التعريفية', 'التسويق الالكتروني', 'النخبة والتسويق المباشر', 'المؤسسات المانحة', 'إدارة التسويق'],
    datasets: [
      {
        label: 'المستهدف',
        data: [15000000, 12000000, 10000000, 2000000, 39000000],
        backgroundColor: 'rgba(255, 165, 0, 0.5)', // orange
        borderColor: 'rgba(255, 165, 0, 1)',
        borderWidth: 1
      },
      {
        label: 'المتحقق',
        data: [11677377, 8003356, 8660000, 1550000, 29890733],
        backgroundColor: 'rgba(0, 255, 255, 0.5)', // cyan
        borderColor: 'rgba(0, 255, 255, 1)',
        borderWidth: 1
      },
      {
        label: 'المتبقي',
        data: [3322623, 3996644, 1340000, 450000, 9109267],
        backgroundColor: 'rgba(255, 255, 0, 0.5)', // yellow
        borderColor: 'rgba(255, 255, 0, 1)',
        borderWidth: 1
      }
    ]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const labels = [];
        const target = [];
        const achieved = [];
        const remaining = [];

        for (let i = 2; i < rows.length; i++) {
          const columns = rows[i].split(';');
          if (columns.length >= 4) {
            labels.push(columns[0]);
            target.push(parseFloat(columns[1].replace(/[٬,]/g, '')));
            achieved.push(parseFloat(columns[2].replace(/[٬,]/g, '')));
            remaining.push(parseFloat(columns[3].replace(/[٬,]/g, '')));
          }
        }

        setData({
          labels,
          datasets: [
            {
              label: 'المستهدف',
              data: target,
              backgroundColor: 'rgba(255, 165, 0, 0.5)',
              borderColor: 'rgba(255, 165, 0, 1)',
              borderWidth: 1
            },
            {
              label: 'المتحقق',
              data: achieved,
              backgroundColor: 'rgba(0, 255, 255, 0.5)',
              borderColor: 'rgba(0, 255, 255, 1)',
              borderWidth: 1
            },
            {
              label: 'المتبقي',
              data: remaining,
              backgroundColor: 'rgba(255, 255, 0, 0.5)',
              borderColor: 'rgba(255, 255, 0, 1)',
              borderWidth: 1
            }
          ]
        });
      };
      reader.readAsText(file);
    }
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        color: '#fff',
        font: {
          size: 14
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatNumber(context.raw);
            return label;
          }
        }
      }
    }
  };

  const options = {
    ...baseOptions,
    scales: {
      y: {
        ticks: {
          color: '#fff',
          callback: function(value: any) {
            return formatNumber(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const radarOptions = {
    ...baseOptions,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: '#fff',
          font: {
            size: 12
          }
        },
        ticks: {
          color: '#fff',
          backdropColor: 'transparent',
          font: {
            size: 10
          }
        }
      }
    }
  };

  const achievementData = {
    labels: data.labels,
    datasets: [{
      label: 'نسبة الإنجاز',
      data: data.datasets[1].data.map((achieved, index) => 
        ((achieved / data.datasets[0].data[index]) * 100).toFixed(1)
      ),
      backgroundColor: 'rgba(0, 255, 128, 0.5)', // green
      borderColor: 'rgba(0, 255, 128, 1)',
      borderWidth: 1,
      fill: true
    }]
  };

  const radarData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: true
    }))
  };

  const polarAreaData = {
    labels: data.labels,
    datasets: [{
      label: 'المستهدف',
      data: data.datasets[0].data,
      backgroundColor: [
        'rgba(255, 165, 0, 0.5)',
        'rgba(0, 255, 255, 0.5)',
        'rgba(0, 255, 128, 0.5)',
        'rgba(255, 255, 0, 0.5)',
        'rgba(255, 99, 132, 0.5)'
      ],
      borderColor: [
        'rgba(255, 165, 0, 1)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 255, 128, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  const pieData = {
    labels: data.labels,
    datasets: [{
      label: 'المتحقق',
      data: data.datasets[1].data,
      backgroundColor: [
        'rgba(255, 165, 0, 0.5)',
        'rgba(0, 255, 255, 0.5)',
        'rgba(0, 255, 128, 0.5)',
        'rgba(255, 255, 0, 0.5)',
        'rgba(255, 99, 132, 0.5)'
      ],
      borderColor: [
        'rgba(255, 165, 0, 1)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 255, 128, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Calculate summary statistics for the first department
  const firstDeptIndex = 0;
  const target = data.datasets[0].data[firstDeptIndex];
  const achieved = data.datasets[1].data[firstDeptIndex];
  const remaining = data.datasets[2].data[firstDeptIndex];
  const achievementPercentage = (achieved / target * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">مستهدف حملة رمضان للأقسام التسويقية لعام 2025م</h1>
          <label className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            <Upload className="w-5 h-5" />
            <span>تحميل ملف CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Summary Cards for First Department */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500/30 to-orange-600/30 p-6 rounded-lg border border-orange-500/50">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold">المستهدف</h3>
            </div>
            <p className="text-2xl font-bold">{formatNumber(target)}</p>
            <p className="text-sm text-gray-300 mt-1">{data.labels[firstDeptIndex]}</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 p-6 rounded-lg border border-cyan-500/50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-semibold">المتحقق</h3>
            </div>
            <p className="text-2xl font-bold">{formatNumber(achieved)}</p>
            <p className="text-sm text-gray-300 mt-1">من إجمالي المستهدف</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/30 to-yellow-600/30 p-6 rounded-lg border border-yellow-500/50">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold">المتبقي</h3>
            </div>
            <p className="text-2xl font-bold">{formatNumber(remaining)}</p>
            <p className="text-sm text-gray-300 mt-1">للوصول للمستهدف</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/30 to-green-600/30 p-6 rounded-lg border border-green-500/50">
            <div className="flex items-center gap-3 mb-2">
              <Percent className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold">نسبة الإنجاز</h3>
            </div>
            <p className="text-2xl font-bold">{achievementPercentage}%</p>
            <p className="text-sm text-gray-300 mt-1">من المستهدف الكلي</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg h-[400px]">
            <h2 className="text-xl mb-4">مقارنة المستهدف والمتحقق والمتبقي</h2>
            <Bar data={data} options={options} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg h-[400px]">
            <h2 className="text-xl mb-4">نسب الإنجاز</h2>
            <Doughnut data={achievementData} options={baseOptions} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg h-[400px]">
            <h2 className="text-xl mb-4">تحليل المستهدف</h2>
            <PolarArea data={polarAreaData} options={baseOptions} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg h-[400px]">
            <h2 className="text-xl mb-4">مقارنة الأداء</h2>
            <Radar data={radarData} options={radarOptions} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg h-[400px]">
            <h2 className="text-xl mb-4">توزيع المتحقق</h2>
            <Pie data={pieData} options={baseOptions} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg h-[400px]">
            <h2 className="text-xl mb-4">تتبع الإنجاز</h2>
            <Line data={achievementData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;