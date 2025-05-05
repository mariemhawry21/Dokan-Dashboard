
<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { Line as LineChart } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const chartLabels = ref([]);
const revenueChartData = ref(null);
const ordersChartData = ref(null);
const avgOrderValueChartData = ref(null);
const { t, locale } = useI18n();

const updateChartLabels = () => {
    chartLabels.value = [
        t('Mon'),
        t('Tue'),
        t('Wed'),
        t('Thu'),
        t('Fri'),
        t('Sat'),
        t('Sun')
    ];
};

const updateChartData = (weeklyStatsResponse) => {
    revenueChartData.value = {
        labels: chartLabels.value,
        datasets: [{
            label: t('Revenue'),
            data: weeklyStatsResponse.data.map(day => day.revenue),
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66,165,245,0.2)',
            fill: true,
            pointHoverRadius: 12
        }]
    };

    ordersChartData.value = {
        labels: chartLabels.value,
        datasets: [{
            label: t('Orders'),
            data: weeklyStatsResponse.data.map(day => day.orders),
            borderColor: '#66BB6A',
            backgroundColor: 'rgba(102,187,106,0.2)',
            fill: true,
            pointHoverRadius: 12
        }]
    };

    avgOrderValueChartData.value = {
        labels: chartLabels.value,
        datasets: [{
            label: t('AvgOrderValue'),
            data: weeklyStatsResponse.data.map(day => day.avgOrderValue),
            borderColor: '#FFA726',
            backgroundColor: 'rgba(255,167,38,0.2)',
            fill: true,
            tension: 0.4,
            pointHoverRadius: 12
        }]
    };
};

const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top'
        }
    }
};

const kpis = ref({});
const orders = ref([]);
const newCustomers = ref([]);
const newProducts = ref([]);

const filterOrders = ref('All');
const isLoading = ref(true);
const isError = ref(false);


const filteredOrders = computed(() => {
    if (filterOrders.value === 'All') return orders.value;
    return orders.value.filter(order => order.status === filterOrders.value);
});

onMounted(async () => {
    try {
        updateChartLabels();

        const revenueResponse = await axios.get('http://localhost:5000/dashboard/stats/revenue');
        const ordersResponse = await axios.get('http://localhost:5000/dashboard/stats/orders');
        const avgOrderValueResponse = await axios.get('http://localhost:5000/dashboard/stats/avg-order-value');
        const weeklyStatsResponse = await axios.get('http://localhost:5000/dashboard/stats/weekly-stats');

        kpis.value = {
            totalRevenue: revenueResponse.data.totalRevenue,
            numberOfOrders: ordersResponse.data.orderCount,
            averageOrderValue: avgOrderValueResponse.data.avgOrderValue
        };

        updateChartData(weeklyStatsResponse);

        orders.value = weeklyStatsResponse.data.recentOrders;
        newCustomers.value = weeklyStatsResponse.data.newCustomers;
        newProducts.value = weeklyStatsResponse.data.newProducts;

        isLoading.value = false;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        isError.value = true;
        isLoading.value = false;
    }
});
watch(locale, async () => {
    await nextTick(); 
    updateChartLabels();
    const weeklyStatsResponse = await axios.get('http://localhost:5000/dashboard/stats/weekly-stats');
    updateChartData(weeklyStatsResponse);
});


</script>

<template>
    <v-container fluid>

        <v-row v-if="isLoading">
            <v-col cols="12" class="text-center d-flex align-center justify-center "
                style="height: 80vh; flex-direction: column; gap: 10px;">
                <v-progress-circular indeterminate color="blue" size="48"></v-progress-circular>
                <p>{{ t('Loading') }}...</p>
            </v-col>
        </v-row>


        <v-row v-if="isError">
            <v-col cols="12" class="text-center d-flex align-center justify-center "
                style="height: 80vh; flex-direction: column;">
                <div class="error-message">
                    <v-icon color="red" size="64">mdi-alert-circle-outline</v-icon>
                    <p class="text-h7" style="color: red;">Error fetching data. Please try again later.</p>
                </div>
            </v-col>
        </v-row>
    </v-container>
    <v-container fluid v-if="!isLoading && !isError">
        <v-row class="mb-6" justify="center">
            <v-col cols="12" sm="6" md="4">
                <v-card elevation="2" class="pa-4 text-center">
                    <h3 class="mb-2 text-blue">{{ t('TotalRevenue') }}</h3>
                    <div class="text-h4 font-weight-bold">${{ kpis.totalRevenue }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card elevation="2" class="pa-4 text-center">
                    <h3 class="mb-2 text-orange-lighten-1">{{ t('NumberofOrders') }}</h3>
                    <div class="text-h4 font-weight-bold">{{ kpis.numberOfOrders }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card elevation="2" class="pa-4 text-center">
                    <h3 class="mb-2 text-green">{{ t('AverageOrderValue') }}</h3>
                    <div class="text-h4 font-weight-bold">${{ kpis.averageOrderValue }}</div>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-6" justify-center>
            <v-col cols="12" sm="6" md="6" lg="4" class="m-auto center-on-sm">
                <v-card
                    class="pb-12 pt-4 px-4 pb-sm-12 pt-sm-2 pb-md-12 pt-md-2 pt-lg-2 pb-lg-12 chart-container m-auto"
                    elevation="2">
                    <h3 class="mb-4">{{ t('RevenueOverLastWeek') }}</h3>
                    <div class="line-chart">
                        <LineChart v-if="revenueChartData" :data="revenueChartData" :options="defaultChartOptions" />
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="4" class="m-auto center-on-sm">
                <v-card
                    class="pb-12 pt-4 px-4 pb-sm-12 pt-sm-2 pb-md-12 pt-md-2 pt-lg-2 pb-lg-12 chart-container m-auto"
                    elevation="2">
                    <h3 class="mb-4">{{ t('OrdersOverLastWeek') }}</h3>
                    <div class="line-chart">
                        <LineChart v-if="ordersChartData" :data="ordersChartData" :options="defaultChartOptions" />
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="4" class="m-auto center-on-sm">
                <v-card
                    class="pb-12 pt-4 px-4 pb-sm-12 pt-sm-2 pb-md-12 pt-md-2 pt-lg-2 pb-lg-12 chart-container m-auto"
                    elevation="2">
                    <h3 class="mb-4">{{ t('AvgOrderValueOverLastWeek') }}</h3>
                    <div class="line-chart">
                        <LineChart v-if="avgOrderValueChartData" :data="avgOrderValueChartData"
                            :options="defaultChartOptions" />
                    </div>

                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-6 align-center justify-center">
            <v-col cols="12">
                <v-card class="pa-4" elevation="2">
                    <h4 class="mb-4">{{ t('NewOrders') }}</h4>
                    <v-table>
                        <thead>
                            <tr>
                                <th>{{ t('OrderID') }}</th>
                                <th>{{ t('Customer') }}</th>
                                <th>{{ t('Products') }}</th>
                                <th>{{ t('Date') }}</th>
                                <th>{{ t('Status') }}</th>
                                <th>{{ t('Amount') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(o, index) in orders" :key="index">
                                <td>{{ o.orderId }}</td>
                                <td>{{ o.customerName }}</td>
                                <td>{{ o.products.join(', ') }}</td>
                                <td>{{ o.date }}</td>
                                <td>
                                    <v-chip :color="o.status === 'Pending' ? 'orange' : 'green'" class="text-white"
                                        size="small">
                                        {{ o.status }}
                                    </v-chip>
                                </td>
                                <td>{{ o.amount }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-6" justify="center" gap='1'>
            <v-col cols="12" sm="6" md="6">
                <v-card class="pa-4" elevation="2">
                    <h4 class="mb-4">{{ t('NewCustomers') }}</h4>
                    <v-table>
                        <thead>
                            <tr>
                                <th>{{ t('CustomerID') }}</th>
                                <th>{{ t('Name') }}</th>
                                <th>{{ t('Email') }}</th>
                                <th>{{ t('DateJoined') }}</th>
                                <th>{{ t('Status') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(customer, index) in newCustomers" :key="index">
                                <td>{{ customer.id }}</td>
                                <td>{{ customer.name }}</td>
                                <td>{{ customer.email }}</td>
                                <td>{{ customer.dateJoined }}</td>
                                <td>
                                    <v-chip :color="customer.status === 'Active' ? 'green' : 'red'" class="text-white"
                                        size="small">
                                        {{ customer.status }}
                                    </v-chip>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="6">
                <v-card class="pa-4" elevation="2">
                    <h4 class="mb-4">{{ t('NewProducts') }}</h4>
                    <v-table>
                        <thead>
                            <tr>
                                <th>{{ t('ProductId') }}</th>
                                <th>{{ t('Name') }}</th>
                                <th>{{ t('Category') }}</th>
                                <th>{{ t('Price') }}</th>
                                <th>{{ t('DateAdded') }}</th>
                                <th>{{ t('Status') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in newProducts" :key="index">
                                <td>{{ product.id }}</td>
                                <td>{{ product.name }}</td>
                                <td>{{ product.category }}</td>
                                <td>{{ product.price }}</td>
                                <td>{{ product.dateAdded }}</td>
                                <td>
                                    <v-chip :color="product.status === 'In Stock' ? 'green' : 'red'" class="text-white"
                                        size="small">
                                        {{ product.status }}
                                    </v-chip>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
.chart-container {
    width: 100%;
    height: 400px;
    max-width: 400px;
    position: relative;
}


.error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
}

.error-message v-icon {
    margin-bottom: 20px;
}

.error-message p {
    font-size: 18px;
    color: red;
    font-weight: 600;
}

.line-chart{
    height: 320px;
}
@media (max-width: 599px) {
    .center-on-sm {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

</style>