
new Chart(document.getElementById('monthlyPieChart'), {
    type: 'doughnut',
    data: {
        labels: [
            'Earned: R$ 4024.98',
            'Expense: R$ 1024.22',
            'Milleage: 4092.12 KM',
        ],
        datasets: [{
            label: '',
            data: [4024.98, 1024.22, 4092.12],
            backgroundColor: [
            '#31db31',
            '#d44232',
            '#00ace9'
            ],
            borderColor: 'rgba(255, 255, 255, 0)'
        }]
    },
});

  
new Chart(document.getElementById('weeklyPieChart'), {
    type: 'doughnut',
    data: {
        labels: [
            'Earned: R$ 998.72',
            'Expense: R$ 340.02',
            'Milleage: 942.50 KM',
        ],
        datasets: [{
            label: '',
            data: [998.98, 340.02, 942.50],
            backgroundColor: [
            '#31db31',
            '#d44232',
            '#00ace9'
            ],
            borderColor: 'rgba(255, 255, 255, 0)'
        }]
    },
});

new Chart(document.getElementById('weeklyBarChart'), {
    type: 'bar',
    data: {
        labels: [
            "2024-09-04", "2024-09-05","2024-09-06", "2024-09-07", "2024-09-08", "2024-09-09", "2024-09-10"
        ],
        datasets: [{
            label: 'Hours Worked',
            data: [6, 5, 4, 5, 7, 6, 5],
            backgroundColor: ['rgba(255, 205, 86, 0.5)'],
            borderColor: 'rgba(255, 255, 255, 0)'
        },
        {
            label: 'Trips',
            data: [10, 11, 8, 8, 15, 7, 8],
            backgroundColor: ['rgba(54, 162, 235, 0.5)'],
            borderColor: 'rgba(255, 255, 255, 0)'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
});

new Chart(document.getElementById('annuallyLineChart'), {
    type: 'line',
    data: {
        labels: ["jan", "fev", "abr", "mar", "mai", "jun", "ago"],
        datasets: [{
            label: 'Balance',
            data: [105, 121, 94, 81, 106, 112, 100],
            color: '#fff',
            borderColor: '#31db31',
            backgroundColor: '#31db31',
            tension: 0.4
            
        } , {
            label: 'Expense',
            data: [24, 32, 58, 12, 70, 31, 12],
            borderColor: '#d44232',
            backgroundColor: '#d44232',
            tension: 0.4
        } , {
            label: 'Mileage',
            data: [109, 141, 84, 61, 101, 152, 109],
            borderColor: '#00ace9',
            backgroundColor: '#00ace9',
            tension: 0.4
        }]
    },
});