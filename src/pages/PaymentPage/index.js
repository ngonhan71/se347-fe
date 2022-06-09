import { Container, Row, Col, Form } from "react-bootstrap";
import PayItem from "../../components/PayItem";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import format from "../../helper/format";
import AddressSelect from "../../components/AddressSelect";

import orderApi from "../../api/orderApi";
import userApi from "../../api/userApi";

import styles from "./PaymentPage.module.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { destroy } from "../../redux/actions/cart"

export default function PaymentPage() {
  const [shippingAddress, setShippingAddress] = useState("");
  const [address, setAddress] = useState([]);
  const cartData = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [showAddressSelect, setShowAddressSelect] = useState(false)
  const [showReceiverInfo, setShowReceiverInfo] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!currentUser.userId || !token) {
      navigate({ pathname: '/' })
    }
  }, [navigate, currentUser])

  useEffect(() => {
    // Call API lấy danh sách địa chỉ
    const fetchDataAddress = async () => {
      try {
        const res = await userApi.getAllAddressById(currentUser.userId);
        const data = res.data.address;
        if (data.length > 0) {
          const result = data.filter((item) => item.isDefault === true);
          if (result.length > 0) setDefaultAddress(result[0].address);
          else setDefaultAddress(data[0].address);
        }
        setAddress(res.data.address);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.userId) {
      fetchDataAddress();
    }
  }, [currentUser]);

  const formik = useFormik({
    initialValues: {
      fullName: currentUser && currentUser.fullName ? currentUser.fullName : "",
      email: currentUser && currentUser.email ? currentUser.email : "",
      phoneNumber:
        currentUser && currentUser.phoneNumber ? currentUser.phoneNumber : "",
      fullNameReceiver: "",
      emailReceiver: "",
      phoneNumberReceiver: "",
      receivingDate: "",
      address: defaultAddress,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object({
      fullName: Yup.string().required("Không được bỏ trống trường này!"),
      email: Yup.string()
        .email("Invalid email")
        .required("Không được bỏ trống trường này!"),
      phoneNumber: Yup.string().required("Không được bỏ trống trường này!"),

      fullNameReceiver: showReceiverInfo && Yup.string().required("Không được bỏ trống trường này!"),
      emailReceiver: showReceiverInfo && Yup.string()
        .email("Invalid email")
        .required("Không được bỏ trống trường này!"),
      phoneNumberReceiver: showReceiverInfo && Yup.string().required("Không được bỏ trống trường này!"),
      receivingDate: Yup.string().required("Không được bỏ trống trường này!"),
    }),
    onSubmit: async () => {
      console.log("kiem tra", formik.values);
      const { email, fullName, phoneNumber, address, receivingDate } = formik.values;
      let fullAddress = address
      if (!fullAddress || showAddressSelect) {
        const { province, district, ward, address } = shippingAddress;
        const { name: districtName } = district;
        const { name: provinceName } = province;
        const { name: wardName } = ward;
        fullAddress = `${address}, ${wardName}, ${districtName}, ${provinceName}`
      }
      let receiverInfo = {}
      if (showReceiverInfo) {
        receiverInfo = {
          fullName: formik.values.fullNameReceiver,
          email: formik.values.emailReceiver,
          phoneNumber: formik.values.phoneNumberReceiver,
        }
      } else {
        receiverInfo = {
          fullName,
          email,
          phoneNumber,
        }
      }
      console.log(receiverInfo, receivingDate)
      try {
        await orderApi.createOrder({
          userId: currentUser && currentUser.userId ? currentUser.userId : "",
          email, fullName, phoneNumber, address: fullAddress,
          receiverInfo, receivingDate,
          cost: {
            subTotal: cartData.subTotal,
            discount: cartData.discount,
            total: cartData.total,
          },
          cart: cartData.list,
        });
        alert("Đặt mua hàng thành công!")
        dispatch(destroy())
        navigate({ pathname: '/' })

      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleGetAddress = useCallback((data) => {
    setShippingAddress(data);
  }, []);

  return (
    <div className="main">
      <Container>
        <div className={styles.payment_header}>
          <ul>
            <li>Trang chủ</li>
            <li>Thanh toán</li>
          </ul>
        </div>
        <div className={styles.payment_body}>
          <Row>
            <Col xl={7}>
              <div className={styles.payment_info}>
                <h4>THÔNG TIN NGƯỜI MUA</h4>
                <div className={`form-group ${styles.formGroup}`}>
                  <label className={styles.formLabel}>Họ và tên</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`form-control ${styles.formControl} ${
                      formik.errors.fullName ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Họ và tên"
                    value={formik.values.fullName}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.fullName && (
                    <Form.Control.Feedback
                      type="invalid"
                      className={styles.feedback}
                    >
                      {formik.errors.fullName}
                    </Form.Control.Feedback>
                  )}
                </div>

                <div className={`form-group ${styles.formGroup}`}>
                  <label className={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${styles.formControl} ${
                      formik.errors.email ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Email"
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email && (
                    <Form.Control.Feedback
                      type="invalid"
                      className={styles.feedback}
                    >
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  )}
                </div>

                <div className={`form-group ${styles.formGroup}`}>
                  <label className={styles.formLabel}>Số điện thoại</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className={`form-control ${styles.formControl} ${
                      formik.errors.phoneNumber ? "is-invalid" : "is-valid"
                    }`}
                    placeholder="Số điện thoại"
                    value={formik.values.phoneNumber}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.phoneNumber && (
                    <Form.Control.Feedback
                      type="invalid"
                      className={styles.feedback}
                    >
                      {formik.errors.phoneNumber}
                    </Form.Control.Feedback>
                  )}
                </div>
                <h4>THÔNG TIN NGƯỜI NHẬN</h4>
                <div>
                <input 
                    type="checkbox" 
                    value={!showReceiverInfo}
                    onChange={() => setShowReceiverInfo(!showReceiverInfo)} />
                    <span style={{marginLeft: "10px"}}>Tôi là người nhận hàng</span>
                </div>
                
                {showReceiverInfo && (
                  <div>
                    <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Họ và tên</label>
                    <input
                      type="text"
                      id="fullNameReceiver"
                      name="fullNameReceiver"
                      className={`form-control ${styles.formControl} ${
                        formik.errors.fullNameReceiver ? "is-invalid" : "is-valid"
                      }`}
                      placeholder="Họ và tên"
                      value={formik.values.fullNameReceiver}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.fullNameReceiver && (
                      <Form.Control.Feedback
                        type="invalid"
                        className={styles.feedback}
                      >
                        {formik.errors.fullNameReceiver}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      id="emailReceiver"
                      name="emailReceiver"
                      className={`form-control ${styles.formControl} ${
                        formik.errors.emailReceiver ? "is-invalid" : "is-valid"
                      }`}
                      placeholder="Email"
                      value={formik.values.emailReceiver}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.emailReceiver && (
                      <Form.Control.Feedback
                        type="invalid"
                        className={styles.feedback}
                      >
                        {formik.errors.emailReceiver}
                      </Form.Control.Feedback>
                    )}
                  </div>

                  <div className={`form-group ${styles.formGroup}`}>
                    <label className={styles.formLabel}>Số điện thoại</label>
                    <input
                      type="text"
                      id="phoneNumberReceiver"
                      name="phoneNumberReceiver"
                      className={`form-control ${styles.formControl} ${
                        formik.errors.phoneNumberReceiver ? "is-invalid" : "is-valid"
                      }`}
                      placeholder="Số điện thoại"
                      value={formik.values.phoneNumberReceiver}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.phoneNumberReceiver && (
                      <Form.Control.Feedback
                        type="invalid"
                        className={styles.feedback}
                      >
                        {formik.errors.phoneNumberReceiver}
                      </Form.Control.Feedback>
                    )}
                  </div>
                  </div>
                )}
                <div>
                  {address && address.length > 0 ? (
                    address.map((item) => (
                      <div key={item._id}>
                        <input
                          type="radio"
                          name="address"
                          value={item.address}
                          checked={item.address === formik.values.address}
                          onChange={formik.handleChange}
                        />
                        <label>{item.address}</label>
                      </div>
                    ))
                  ) : (
                    <AddressSelect onChangeAddress={handleGetAddress} />
                  )}

                  {address && address.length > 0 && (
                    <p onClick={() => setShowAddressSelect(!showAddressSelect)}>
                      Địa chỉ khác
                    </p>
                  )}
                </div>
                {showAddressSelect && <AddressSelect onChangeAddress={handleGetAddress} />}
                <div className={`form-group ${styles.formGroup}`}>
                  <label className={styles.formLabel}>Ngày giao hoa</label>
                  <input
                    type="date"
                    id="receivingDate"
                    name="receivingDate"
                    className={`form-control ${styles.formControl} ${formik.errors.receivingDate ? 'is-invalid' : 'is-valid'}`}
                    value={formik.values.receivingDate}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.receivingDate && (
                    <Form.Control.Feedback type="invalid" className={styles.feedback}>
                      {formik.errors.receivingDate}
                    </Form.Control.Feedback>
                  )}
                </div>

              </div>

            </Col>
            <Col xl={5}>
              <div className={styles.payment_form}>
                <h4>ĐƠN HÀNG CỦA BẠN</h4>
                <div>
                  <p>
                    SẢN PHẨM<span className={styles.form_right1}>TỔNG</span>
                  </p>
                  {cartData.list.map((item) => (
                    <PayItem
                      item={item}
                      key={item._id}
                      quantity={item.quantity}
                      totalPriceItem={item.totalPriceItem}
                    />
                  ))}
                  <p>
                    Tổng phụ
                    <span className={styles.form_right}>
                      {format.formatPrice(cartData.subTotal)}
                    </span>
                  </p>
                  <p>
                    Giảm giá
                    <span className={styles.form_right}>
                      {format.formatPrice(cartData.discount)}
                    </span>
                  </p>
                  <p>
                    Tổng
                    <span className={styles.form_right}>
                      {format.formatPrice(cartData.total)}
                    </span>
                  </p>
                </div>
                <button type="submit" onClick={formik.handleSubmit}>
                  ĐẶT HÀNG
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
