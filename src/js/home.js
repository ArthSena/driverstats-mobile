var monthlyPieChart;
var weeklyPieChart;
var weeklyBarChart;
var annuallyLineChart;
var monthlyExpensePieChart;
var weeklyAverageEarningBarChart;
var weeklyBarChart2;
export default async (store) => {
    const BASE_URL = "https://driverstats.artsna.xyz";


    document.getElementById("card-trips").innerHTML = "Loading...";
    document.getElementById("card-billed").innerHTML = "Loading...";
    document.getElementById("card-expensed").innerHTML = "Loading...";
    document.getElementById("card-mileage").innerHTML = "Loading...";

    const registryResponse = await fetch(BASE_URL + '/v1/registry/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }});
    const registryData = await registryResponse.json();

    const expenseResponse = await fetch(BASE_URL + '/v1/expense/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }});
    const expenseData = await expenseResponse.json();

    const categoryResponse = await fetch(BASE_URL + '/v1/category/all', { headers: {'Authorization': 'Token ' + store.state.auth.token }});
    const categoryData = await categoryResponse.json();

    const data = toDataSet(registryData.list, expenseData.list, categoryData.list);

    document.getElementById("card-trips").innerHTML = data.oneMonthTrips;
    document.getElementById("card-billed").innerHTML = data.oneMonthBilled;
    document.getElementById("card-expensed").innerHTML = data.oneMonthExpensed;
    document.getElementById("card-mileage").innerHTML = data.oneMonthMileage;

    document.getElementById("card-trips-percentage").innerHTML = data.tripsPercentage + "%";
    document.getElementById("card-billed-percentage").innerHTML = data.billedPercentage + "%";
    document.getElementById("card-expensed-percentage").innerHTML =  data.expensedPercentage + "%";
    document.getElementById("card-mileage-percentage").innerHTML =  data.mileagePercentage + "%";

    document.getElementById("card-trips-percentage").classList.add(getCardPercentageClass(data.tripsPercentage));
    document.getElementById("card-billed-percentage").classList.add(getCardPercentageClass(data.billedPercentage));
    document.getElementById("card-expensed-percentage").classList.add(getCardPercentageClass(data.expensedPercentage));
    document.getElementById("card-mileage-percentage").classList.add(getCardPercentageClass(data.mileagePercentage));
    
    destroyCharts();
    
    monthlyExpensePieChart = new Chart(document.getElementById('monthlyExpensePieChart'), { type: 'doughnut',
        data: {
            labels: data.monthlyExpensePieChartData.labels,
            datasets: [{
                label: '', backgroundColor: data.monthlyExpensePieChartData.colors, borderColor: 'rgba(255, 255, 255, 0)',
                data: data.monthlyExpensePieChartData.data
            }]
        },
    });

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
            labels: ['Billed: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.oneWeekBilled),
                'Expensed: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.oneWeekExpensed),
                'Mileage: ' + data.oneWeekMileage + ' KM'
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
                label: 'Hours Worked', backgroundColor: ['#fe8a19'], borderColor: 'rgba(255, 255, 255, 0)',
                data: Object.values(data.dailyData).map(d => d.hoursWorked)
            }, {
                label: 'Trips', backgroundColor: ['#455a66'],borderColor: 'rgba(255, 255, 255, 0)',
                data: Object.values(data.dailyData).map(d => d.trips)
            }]
        }
    });
    weeklyBarChart2 = new Chart(document.getElementById('weeklyBarChart2'), { type: 'bar', options: { scales: { y: { beginAtZero: true } } },
    data: {
        labels: Object.keys(data.dailyData),
        datasets: [{
            label: 'Billed  (R$)', backgroundColor: ['#31db31'], borderColor: 'rgba(255, 255, 255, 0)',
            data: Object.values(data.dailyData).map(d => d.billed)
        }, {
            label: 'Mileage (KM)', backgroundColor: ['#00ace9'], borderColor: 'rgba(255, 255, 255, 0)',
            data: Object.values(data.dailyData).map(d => d.mileage)
        }]
    }
});

    weeklyAverageEarningBarChart = new Chart(document.getElementById('weeklyAverageEarningBarChart'), { type: 'bar', options: { scales: { y: { beginAtZero: true } } },
    data: {
        labels: Object.keys(data.dailyData),
        datasets: [{
            label: 'Average Earning Per Hour (R$)', backgroundColor: ['#428053'], borderColor: 'rgba(255, 255, 255, 0)',
            data: Object.values(data.dailyData).map(d => d.averageEarningHours)
        }, {
            label: 'Average Earning Per Trips (R$)', backgroundColor: ['#163071'],borderColor: 'rgba(255, 255, 255, 0)',
            data: Object.values(data.dailyData).map(d => d.averageEarningTrips)
        }],
    }
});

    annuallyLineChart = new Chart(document.getElementById('annuallyLineChart'), { type: 'line',
        data: {
            labels: Object.keys(data.monthlyData),
            datasets: [{
                label: 'Billed (R$)', color: '#fff', borderColor: '#31db31', backgroundColor: '#31db31', tension: 0.4,
                data: Object.values(data.monthlyData).map(d => d.billed)
            }, {
                label: 'Expensed (R$)', borderColor: '#d44232', backgroundColor: '#d44232', tension: 0.4,
                data: Object.values(data.monthlyData).map(d => d.expensed)
            }, {
                label: 'Mileage (KM)', borderColor: '#00ace9', backgroundColor: '#00ace9', tension: 0.4,
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
    if(monthlyExpensePieChart)
        monthlyExpensePieChart.destroy();
    if(weeklyAverageEarningBarChart)
        weeklyAverageEarningBarChart.destroy();
    if(weeklyBarChart2)
        weeklyBarChart2.destroy();
}

const getCardPercentageClass = (percentage) => {
    return "card-" + (percentage > 0 ? "positive" : percentage == 0 ? "neutral" : "negative");
}

const toDataSet = (registries, expenses, categories) => {

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

    registries.reverse().forEach(registry => {
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
        var hoursWorked = 0;
        var minutesWorked = 0;
        if(registry.closedAt != null) {
            var diff = (new Date(registry.closedAt).getTime() - createdAt.getTime()) / 1000;
            diff /= (60 * 60);
            hoursWorked = Math.abs(Math.round(diff));
            minutesWorked = Math.abs(Math.round(diff * 60)); 
            if(minutesWorked > 60) minutesWorked = Math.abs(Math.round(minutesWorked / hoursWorked));
        }

        if(dailyData[registryDate]) {
            if(dailyData[registryDate].hoursWorked)
                hoursWorked += dailyData[registryDate].hoursWorked;
            if(dailyData[registryDate].minutesWorked)
                minutesWorked += dailyData[registryDate].minutesWorked;
        }

        if(minutesWorked > 60) {
            hoursWorked++;
            minutesWorked -= 60;
            hoursWorked += minutesWorked / 100;
        }

        dailyData[registryDate] = {
            hoursWorked,
            minutesWorked,
            trips: registry.trips,
            averageEarningHours: (registry.billed / hoursWorked),
            averageEarningTrips: (registry.billed / registry.trips),
            billed: registry.billed,
            mileage: registry.finalMileage != 0 ? registry.finalMileage - registry.initialMileage : 0
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
                expensed: 0,
            };
        }
    });

    expenses.reverse().forEach(expense => {
        const date = new Date(expense.date);

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
        if (monthlyData[expenseMonth]) {
            monthlyData[expenseMonth].expensed += expense.amount;
        } else {
            monthlyData[expenseMonth] = {
                expensed: expense.amount,
                billed: 0,
                trips: 0,
                mileage: 0
            };
        }
    });

    const calcPercentage = (x, y) => {
        return (((x - y) / y) * 100);
    }

    var tripsPercentage = twoMonthsTrips > 0 ? calcPercentage(oneMonthTrips, twoMonthsTrips).toFixed(2) : 0;
    var billedPercentage = twoMonthsBilled > 0 ? calcPercentage(oneMonthBilled, twoMonthsBilled).toFixed(2) : 0;
    var expensedPercentage = twoMonthsExpensed > 0 ? calcPercentage(oneMonthExpensed, twoMonthsExpensed).toFixed(2) : 0;
    var mileagePercentage = twoMonthsMileage > 0 ? calcPercentage(oneMonthMileage, twoMonthsMileage).toFixed(2) : 0;
      

    var expenseList = [];
    var amount = 0;
    var monthlyExpensePieChartData = {
        labels: [],
        colors: [],
        data: []
    }

    expenseList = expenses.filter((expense) => expense.category == null);
    if(expenseList.length > 0) {
        amount = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
        monthlyExpensePieChartData.labels.push("Undefined: " + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount));
        monthlyExpensePieChartData.colors.push('#fff');
        monthlyExpensePieChartData.data.push(amount);
    }

    categories.forEach(category => {
        expenseList = expenses.filter((expense) => {
            if(expense.category == null) return false;
            return expense.category.id == category.id;
        });

        amount = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
        monthlyExpensePieChartData.labels.push(category.name + ": " + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount));
        monthlyExpensePieChartData.colors.push(category.color);
        monthlyExpensePieChartData.data.push(amount);
    });


    return {
        monthlyExpensePieChartData, 

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