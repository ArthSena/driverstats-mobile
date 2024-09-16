export default function homeChart (store) { 
    const registries = store.getters.registries;
    const expenses = store.getters.expenses;
        
    var oneMonthTrips = 0;
    var oneMonthBilled = 0;
    var oneMonthExpensed = 0;
    var oneMonthMilleage = 0;
    
    var oneWeekTrips = 0;
    var oneWeekBilled = 0;
    var oneWeekExpensed = 0;
    var oneWeekMilleage = 0;
    
    const oneMonthAgo = new Date();
    const oneWeekAgo = new Date();
    
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const dailyData = {};
    const monthlyData = {};

    registries.value.forEach(registry => {

        if (registry.createdAt > oneMonthAgo) {
            oneMonthTrips += registry.trips;
            oneMonthBilled += registry.billed;
            oneMonthMilleage += registry.finalMileage - registry.initialMileage;
        }

        if (registry.createdAt > oneWeekAgo) {
            oneWeekTrips += registry.trips;
            oneWeekBilled += registry.billed;
            oneWeekMilleage += registry.finalMileage - registry.initialMileage;
        }

        const registryDate = registry.createdAt.toLocaleString().split(',')[0];

        dailyData[registryDate] = {
            hoursWorked: (new Date(registry.closedAt) - new Date(registry.createdAt)) / (1000 * 60 * 60),
            trips: registry.trips,
        }

        const registryMonth = registry.createdAt.toDateString().split(' ')[1];
        if (monthlyData[registryMonth]) {
            monthlyData[registryMonth].billed += registry.billed;
            monthlyData[registryMonth].trips += registry.trips;
            monthlyData[registryMonth].mileage += registry.finalMileage - registry.initialMileage;
        } else {
            monthlyData[registryMonth] = {
                billed: registry.billed,
                trips: registry.trips,
                mileage: registry.finalMileage - registry.initialMileage,
            };
        }
    });

    
    expenses.value.forEach(expense => {
        if(expense.date >= oneMonthAgo) {
            oneMonthExpensed += expense.amount;
        }
        if(expense.date >= oneWeekAgo) {
            oneWeekExpensed += expense.amount;
        }

        const expenseMonth = expense.date.toDateString().split(' ')[1];
        console.log(expenseMonth);
        if (monthlyData[expenseMonth].expensed) {
            monthlyData[expenseMonth].expensed += expense.amount;
        } else {
            monthlyData[expenseMonth].expensed = expense.amount;
        }
    });
    
    new Chart(document.getElementById('monthlyPieChart'), {
        type: 'doughnut',
        data: {
            labels: [
                'Billed: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(oneMonthBilled),
                'Expensed: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(oneMonthExpensed),
                'Milleage: ' + oneMonthMilleage + ' KM',
            ],
            datasets: [{
                label: '',
                data: [oneMonthBilled, oneMonthExpensed, oneMonthMilleage],
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
                'Billed: R$ ' + oneWeekBilled,
                'Expensed: R$ ' + oneWeekExpensed,
                'Milleage: ' + oneWeekMilleage + ' KM',
            ],
            datasets: [{
                label: '',
                data: [oneWeekBilled, oneWeekExpensed, oneWeekMilleage],
                backgroundColor: [
                '#31db31',
                '#d44232',
                '#00ace9'
                ],
                borderColor: 'rgba(255, 255, 255, 0)'
            }]
        },
    });

    // Create the bar chart with the populated data
    new Chart(document.getElementById('weeklyBarChart'), {
    type: 'bar',
    data: {
        labels: Object.keys(dailyData).reverse(),
        datasets: [{
        label: 'Hours Worked',
        data: Object.values(dailyData).map(data => data.hoursWorked).reverse(),
        backgroundColor: ['rgba(255, 205, 86, 0.5)'],
        borderColor: 'rgba(255, 255, 255, 0)',
        },
        {
        label: 'Trips',
        data: Object.values(dailyData).map(data => data.trips).reverse(),
        backgroundColor: ['rgba(54, 162, 235, 0.5)'],
        borderColor: 'rgba(255, 255, 255, 0)',
        }],
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
            labels: Object.keys(monthlyData).reverse(),
            datasets: [{
                label: 'Billed',
                data: Object.values(monthlyData).map(data => data.billed).reverse(),
                color: '#fff',
                borderColor: '#31db31',
                backgroundColor: '#31db31',
                tension: 0.4
                
            } , {
                label: 'Expensed',
                data: Object.values(monthlyData).map(data => data.expensed).reverse(),
                borderColor: '#d44232',
                backgroundColor: '#d44232',
                tension: 0.4
            } , {
                label: 'Mileage',
                data: Object.values(monthlyData).map(data => data.mileage).reverse(),
                borderColor: '#00ace9',
                backgroundColor: '#00ace9',
                tension: 0.4
            }, {
                label: 'Trips',
                data: Object.values(monthlyData).map(data => data.trips).reverse(),
                borderColor: '#152d62',
                backgroundColor: '#152d62',
                tension: 0.4
            }]
        },
    });
}