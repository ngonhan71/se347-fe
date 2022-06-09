import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { Row, Col } from "react-bootstrap";
import orderApi from "../../api/orderApi";
import styles from "./DashboardPage.module.css";
import { useEffect, useState } from "react";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DashboardPage() {
  const [revenueLifeTimeDataChart, setRevenueLifeTimeDataChart] = useState({});
  const [countOrderLifeTimeDataChart, setCountOrderLifeTimeDataChart] =
    useState({});
  const [flowerBestSellerDataChart, setFlowerBestSellerDataChart] = useState(
    {}
  );

  useEffect(() => {
    const fetchRevenueLifeTime = async () => {
      try {
        const res = await orderApi.getRevenueLifeTime();
        const dataChart = res.data;
        setRevenueLifeTimeDataChart({
          labels: dataChart.map((item) => item._id),
          datasets: [
            {
              label: "Doanh thu",
              data: dataChart.map((item) => item.revenue),
              fill: true,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.3)",
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCountOrderLifeTime = async () => {
      try {
        const res = await orderApi.getCountOrderLifeTime();
        const dataChart = res.data;
        setCountOrderLifeTimeDataChart({
          labels: dataChart.map((item) => item._id),
          datasets: [
            {
              label: "Số lượng đơn hàng",
              data: dataChart.map((item) => item.total),
              fill: true,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.3)",
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFlowerBestSeller = async () => {
      try {
        const res = await orderApi.getBestSeller();
        const dataChart = res.data;
        console.log(dataChart);
        setFlowerBestSellerDataChart({
          labels: dataChart.map((item) => item.product[0].name),
          datasets: [
            {
              label: "Sản phẩm bán chạy",
              data: dataChart.map((item) => item.count),
              backgroundColor: ["#ff6384", "#e8c3b9", "#ffce56", "#8e5ea2"],
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchRevenueLifeTime();
    fetchCountOrderLifeTime();
    fetchFlowerBestSeller();
  }, []);

  return (
    <div className={styles.wrapperDashboard}>
      <h1>Chào mừng đến trang quản lý</h1>
      <Row>
        <Col xl={8}>
          {revenueLifeTimeDataChart && revenueLifeTimeDataChart.datasets && (
            <Line
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Doanh thu toàn thời gian",
                  },
                },
              }}
              data={revenueLifeTimeDataChart}
            />
          )}
        </Col>
        <Col xl={4}>
          {flowerBestSellerDataChart && flowerBestSellerDataChart.datasets && (
            <Pie
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    align: "start",
                  },
                  title: {
                    display: true,
                    text: "Sản phẩm bán chạy",
                  },
                },
              }}
              data={flowerBestSellerDataChart}
            />
          )}
        </Col>
        <Col xl={6}>
          {countOrderLifeTimeDataChart && countOrderLifeTimeDataChart.datasets && (
            <Line
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Đơn hàng toàn thời gian",
                  },
                },
              }}
              data={countOrderLifeTimeDataChart}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
