import { useCallback, useEffect, useState } from "react";
import PaginationShopHoa from "../PaginationShopHoa";
import { FaCheckCircle } from "react-icons/fa";
import { Row, Col, Card, Table, Spinner, Modal } from "react-bootstrap";
import orderApi from "../../api/orderApi";
import format from "../../helper/format";
import styles from "./OrderList.module.css";

function OrderList() {
  const [orderData, setOrderData] = useState({});
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [orderDetail, setOrderDetail] = useState({});

  const [status, setStatus] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getAll({ page: page, limit: 10, sortByDate: "desc" });
        setLoading(false);
        setOrderData({ orders: res.data, totalPage: res.pagination.totalPage });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [page]);

  const handleChangePage = useCallback((page) => {
    setPage(page);
  }, []);

  const handleGetOrderDetail = async (e) => {
    try {
      const orderId = e.target.getAttribute("data-id");
      if (!(orderDetail._id === orderId)) {
        const res = await orderApi.getById(orderId);
        setOrderDetail(res.data);
      }
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateOrder = async (e) => {
    try {
      const orderId = e.target.getAttribute("data-id");
      if (!(orderDetail._id === orderId)) {
        const res = await orderApi.getById(orderId);
        setOrderDetail(res.data);
        setStatus({
          key: res.data.status.key,
          text: res.data.status.text
        });
      }
      setShowModalUpdate(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeStatus = (e) => {
    const index = e.target.selectedIndex;
    setStatus({
      key: parseInt(e.target.value),
      text: e.target[index].text
    });
  }

  const handleCallApiChangeStatus = async () => {
    console.log(status)
    console.log(orderDetail._id)
    try {
      await orderApi.updateStatusById(orderDetail._id, status)
      setOrderDetail(pre => {
        return {
          ...pre,
          status: status
        }
      }) 
      setOrderData(pre => {
        const newArray = [...pre.orders];
        console.log({
          ...pre,
          orders: newArray.map((item) => {
            return item._id === orderDetail._id
              ? { ...item, status: status }
              : item;
          })
        })
        return {
          ...pre,
          orders: newArray.map((item) => {
            return item._id === orderDetail._id
              ? { ...item, status: status }
              : item;
          })
        }
      })
      alert("Cập nhật thành công!")
    } catch (error) {
      alert("Cập nhật thất bại!")
      console.log(error)
    }
  }

  return (
    <Row>
      <Modal
        size="lg"
        show={showModalUpdate}
        onHide={() => setShowModalUpdate(false)}
        className={styles.orderDetail}
      >
        <Modal.Header closeButton>
          <Modal.Title>Hóa đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showModalUpdate && orderDetail && orderDetail.status.text && (
            <div>
              <p>Trạng thái: <b>{orderDetail.status.text}</b></p>
              <label>Thay đổi trạng thái:</label>
              <select 
                className="form-select" 
                value={status?.key ? status?.key : orderDetail.status.key} 
                onChange={handleChangeStatus}>
                <option value="0">Đang chờ xử lý</option>
                <option value="1">Đã đóng gói đơn hàng</option>
                <option value="2">Đang vận chuyển</option>
                <option value="3">Đã giao hàng</option>
              </select>
            </div>
          )}
          <button type="button" className="btn btn-success mt-2" onClick={handleCallApiChangeStatus}>
            Lưu
          </button>
        
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        className={styles.orderDetail}
      >
        <Modal.Header closeButton>
          <Modal.Title>Hóa đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showModal && orderDetail && (
            <div>
              <p>Tạm tính:{" "}<b>{format.formatPrice(orderDetail?.cost?.subTotal)}</b></p>
              <p>Giám giá:{" "}<b>{format.formatPrice(orderDetail?.cost?.discount)}</b></p>
              <p>Tổng cộng: <b>{format.formatPrice(orderDetail?.cost.total)}</b></p>
              <p>Trạng thái: <b>{orderDetail?.status.text}</b></p>
            </div>
          )}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Mã sản phẩm</th>
                <th colSpan={2}>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {showModal &&
              orderDetail &&
              orderDetail.products &&
              orderDetail.products.length > 0 ? (
                orderDetail.products.map((items, index) => {
                  return (
                    <tr key={items._id}>
                      <td>{index + 1}</td>
                      <td>{items?.product._id}</td>
                      <td>{items?.product.name}</td>
                      <td>
                        <img src={items?.product.imageUrl} alt="" />
                      </td>
                      <td>{items?.quantity}</td>
                      <td>{format.formatPrice(items?.totalItem)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>Không có</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className={styles.title}>Danh sách đơn hàng</Card.Header>
          <Card.Body className={styles.orderList}>
            <Table striped bordered hover style={{fontSize: 14}}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tình trạng</th>
                  <th>Người đặt</th>
                  <th>Người nhận</th>
                  <th>Địa chỉ</th>
                  <th>Ngày đặt hàng</th>
                  <th>Ngày giao hàng</th>
                  <th>Tổng tiền</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8}>
                      <Spinner animation="border" variant="success" />
                    </td>
                  </tr>
                ) : orderData.orders && orderData.orders.length > 0 ? (
                  orderData.orders.map((item, index) => {
                    return (
                      <tr key={item._id}>
                        <td>{(1 && page - 1) * 10 + (index + 1)}</td>
                        <td>{item.status.text} {item.status.key === 3 && 
                          <button className={`shophoa-btn ${styles.btnCheck}`}>
                            < FaCheckCircle />
                          </button>}
                      </td>
                        <td>{item.fullName} - {item.phoneNumber} -{item.email}</td>
                        <td>
                          {item.receiverInfo.fullName} -{" "}
                          {item.receiverInfo.phoneNumber} -
                          {item.receiverInfo.email}
                        </td>
                        <td>{item.address}</td>
                        <td>{format.formatDate(item.createdAt)}</td>
                        <td>{(item.receivingDate)}</td>
                        <td>{format.formatPrice(item.cost.total)}</td>

                        <td>
                          <button
                            className="btn btn-success"
                            data-id={item._id}
                            onClick={handleUpdateOrder}
                          >
                            Sửa
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            data-id={item._id}
                            onClick={handleGetOrderDetail}
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>Không có sản phẩm nào!</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className={styles.pagination}>
              <Row>
                <Col xl={12}>
                  {orderData.totalPage > 1 ? (
                    <PaginationShopHoa
                      totalPage={orderData.totalPage}
                      currentPage={page}
                      onChangePage={handleChangePage}
                    />
                  ) : null}
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default OrderList;
