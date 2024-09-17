var monthlyPieChart;
var weeklyPieChart;
var weeklyBarChart;
var annuallyLineChart;

export default async (store) => {
    document.getElementById("card-trips").innerHTML = "Loading...";
    document.getElementById("card-billed").innerHTML = "Loading...";
    document.getElementById("card-expensed").innerHTML = "Loading...";
    document.getElementById("card-mileage").innerHTML = "Loading...";

    const registryResponse = await fetch('http://localhost:8080/v1/registry/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }});
    const registryData = await registryResponse.json();

    const expenseResponse = await fetch('http://localhost:8080/v1/expense/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }});
    const expenseData = await expenseResponse.json();

    const data = toDataSet(registryData.list, expenseData.list);

    document.getElementById("card-trips").innerHTML = data.oneMonthTrips;
    document.getElementById("card-billed").innerHTML = data.oneMonthBilled;
    document.getElementById("card-expensed").innerHTML = data.oneMonthExpensed;
    document.getElementById("card-mileage").innerHTML = data.oneMonthMileage;

    document.getElementById("card-trips-percentage").innerHTML = "(" + data.tripsPercentage + "%)";
    document.getElementById("card-billed-percentage").innerHTML = "(" + data.billedPercentage + "%)";
    document.getElementById("card-expensed-percentage").innerHTML = "(" + data.expensedPercentage + "%)";
    document.getElementById("card-mileage-percentage").innerHTML = "(" + data.mileagePercentage + "%)";

    document.getElementById("card-trips-percentage").classList.add(getCardPercentageClass(data.tripsPercentage));
    document.getElementById("card-billed-percentage").classList.add(getCardPercentageClass(data.billedPercentage));
    document.getElementById("card-expensed-percentage").classList.add(getCardPercentageClass(data.expensedPercentage));
    document.getElementById("card-mileage-percentage").classList.add(getCardPercentageClass(data.mileagePercentage));
    
    destroyCharts();

    monthlyPieChart = new Chart(document.getElementById('monthlyPieChart'), { type: 'doughnut',
        data: {
            labels: ['Billed: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.oneMonthBilled),
                    'Expensed: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.oneMonthExpensed),
                    'Mileage: ' + data.oneMonthMileage + ' KM'
            ],
            datasets: [{
                label: '', backgroundColor: [ '#31db31', '#d44232', '#00ace9' ], borderColor: 'rgba(255, 255, 255, 0)',
                data: [data.oneMonthBilled, data.oneMonthExpensed, data.oneMonthMileage]
            }]
        },
    });

    weeklyPieChart = new Chart(document.getElementById('weeklyPieChart'), { type: 'doughnut',
        data: {
            labels: [ 'Billed: R$ ' + data.oneWeekBilled,
                      'Expensed: R$ ' + data.oneWeekExpensed,
                      'Milleage: ' + data.oneWeekMileage + ' KM',
            ],
            datasets: [{
                label: '', backgroundColor: [ '#31db31', '#d44232', '#00ace9' ], borderColor: 'rgba(255, 255, 255, 0)',
                data: [data.oneWeekBilled, data.oneWeekExpensed, data.oneWeekMileage]
            }]
        }
    });

    weeklyBarChart = new Chart(document.getElementById('weeklyBarChart'), { type: 'bar', options: { scales: { y: { beginAtZero: true } } },
        data: {
            labels: Object.keys(data.dailyData),
            datasets: [{
                label: 'Hours Worked', backgroundColor: ['rgba(255, 205, 86, 0.5)'], borderColor: 'rgba(255, 255, 255, 0)',
                data: Object.values(data.dailyData).map(d => d.hoursWorked)
            }, {
                label: 'Trips', backgroundColor: ['rgba(54, 162, 235, 0.5)'],borderColor: 'rgba(255, 255, 255, 0)',
                data: Object.values(data.dailyData).map(d => d.trips)
            }],
        }
    });

    annuallyLineChart = new Chart(document.getElementById('annuallyLineChart'), { type: 'line',
        data: {
            labels: Object.keys(data.monthlyData),
            datasets: [{
                label: 'Billed', color: '#fff', borderColor: '#31db31', backgroundColor: '#31db31', tension: 0.4,
                data: Object.values(data.monthlyData).map(d => d.billed)
            }, {
                label: 'Expensed', borderColor: '#d44232', backgroundColor: '#d44232', tension: 0.4,
                data: Object.values(data.monthlyData).map(d => d.expensed)
            }, {
                label: 'Mileage', borderColor: '#00ace9', backgroundColor: '#00ace9', tension: 0.4,
                data: Object.values(data.monthlyData).map(d => d.mileage)
            }, {
                label: 'Trips', borderColor: '#152d62', backgroundColor: '#152d62', tension: 0.4,
                data: Object.values(data.monthlyData).map(d => d.trips)
            }]
        },
    });
}

const destroyCharts = () => {
    if(monthlyPieChart)
        monthlyPieChart.destroy();
    if(weeklyPieChart)
        weeklyPieChart.destroy();
    if(weeklyBarChart)
        weeklyBarChart.destroy();
    if(annuallyLineChart)
        annuallyLineChart.destroy()
}

const getCardPercentageClass = (percentage) => {
    return "card-" + (percentage > 0 ? "positive" : percentage == 0 ? "neutral" : "negative");
}

const toDataSet = (registries, expenses) => {

    var oneWeekTrips = 0;
    var oneWeekBilled = 0;
    var oneWeekExpensed = 0;
    var oneWeekMileage = 0;

    var oneMonthTrips = 0;
    var oneMonthBilled = 0;
    var oneMonthExpensed = 0;
    var oneMonthMileage = 0;

    var twoMonthsTrips = 0;
    var twoMonthsBilled = 0;
    var twoMonthsExpensed = 0;
    var twoMonthsMileage = 0;
        
    var dailyData = {};
    var monthlyData = {};

    const twoMonthsAgo = new Date();
    const oneMonthAgo = new Date();
    const oneWeekAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    registries.forEach(registry => {
        const createdAt = new Date(registry.createdAt);

        if (createdAt >= twoMonthsAgo && createdAt <= oneMonthAgo) {
            twoMonthsTrips += registry.trips;
            twoMonthsBilled += registry.billed;
            twoMonthsMileage += registry.finalMileage != 0 ? registry.finalMileage - registry.initialMileage : 0;
        }

        if (createdAt >= oneMonthAgo) {
            oneMonthTrips += registry.trips;
            oneMonthBilled += registry.billed;
            oneMonthMileage += registry.finalMileage != 0 ? registry.finalMileage - registry.initialMileage : 0;
        }

        if (createdAt >= oneWeekAgo) {
            oneWeekTrips += registry.trips;
            oneWeekBilled += registry.billed;
            oneWeekMileage += registry.finalMileage != 0 ? registry.finalMileage - registry.initialMileage : 0;
        }

        const registryDate = createdAt.toLocaleString().split(',')[0];
        dailyData[registryDate] = {
            hoursWorked: (new Date(registry.closedAt) - createdAt) / (1000 * 60 * 60),
            trips: registry.trips,
        }

        const registryMonth = createdAt.toDateString().split(' ')[1];
        if (monthlyData[registryMonth]) {
            monthlyData[registryMonth].billed += registry.billed;
            monthlyData[registryMonth].trips += registry.trips;
            monthlyData[registryMonth].mileage += registry.finalMileage != 0 ? registry.finalMileage - registry.initialMileage : 0;
        } else {
            monthlyData[registryMonth] = {
                billed: registry.billed,
                trips: registry.trips,
                mileage: registry.finalMileage != 0 ? registry.finalMileage - registry.initialMileage : 0,
            };
        }
    });

    expenses.forEach(expense => {
        const date = new Date(registry.date);

        if(date >= twoMonthsAgo && date <= oneMonthAgo) {
            twoMonthsExpensed += expense.amount;
        }
        if(date >= oneMonthAgo) {
            oneMonthExpensed += expense.amount;
        }
        if(date >= oneWeekAgo) {
            oneWeekExpensed += expense.amount;
        }

        const expenseMonth = date.toDateString().split(' ')[1];
        if (monthlyData[expenseMonth].expensed) {
            monthlyData[expenseMonth].expensed += expense.amount;
        } else {
            monthlyData[expenseMonth].expensed = expense.amount;
        }
    });

    var tripsPercentage = twoMonthsTrips > 0 ? (oneMonthTrips / twoMonthsTrips) * 100 : 0;
    var billedPercentage = twoMonthsBilled > 0 ?(oneMonthBilled / twoMonthsBilled) * 100 : 0;
    var expensedPercentage = twoMonthsExpensed > 0 ? (oneMonthExpensed / twoMonthsExpensed) * 100 : 0;
    var mileagePercentage = twoMonthsMileage > 0 ? (oneMonthMileage / twoMonthsMileage) * 100 : 0;

    return {
        tripsPercentage,
        billedPercentage,
        expensedPercentage,
        mileagePercentage,

        oneWeekTrips,
        oneWeekBilled,
        oneWeekExpensed,
        oneWeekMileage,

        oneMonthTrips,
        oneMonthBilled,
        oneMonthExpensed,
        oneMonthMileage,

        twoMonthsTrips,
        twoMonthsBilled,
        twoMonthsExpensed,
        twoMonthsMileage,

        dailyData,
        monthlyData,
    }
}