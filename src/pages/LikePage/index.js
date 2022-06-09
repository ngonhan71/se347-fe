import React from 'react';
import {Container, Table} from 'react-bootstrap'

import format from "../../helper/format";
import styles from './LikePage.module.css';

export default function LikePage() {

  const dataFav = [
    {
      bookId: "book01",
      image: "https://picsum.photos/175/120",
      name: "Đắc nhân tâm",
      price: 320000,
      quantity: 1,
      total_cost: 320000,
    },
    {
      bookId: "book02",
      image: "https://picsum.photos/175/120",
      name: "Đắc nhân tâm 2",
      price: 320000,
      quantity: 1,
      total_cost: 320000,
    },
    {
      bookId: "book03",
      image: "https://picsum.photos/175/120",
      name: "Đắc nhân tâm 3",
      price: 320000,
      quantity: 1,
      total_cost: 320000,
    },
    {
      bookId: "book04",
      image: "https://picsum.photos/175/120",
      name: "Đắc nhân tâm 4",
      price: 320000,
      quantity: 1,
      total_cost: 320000,
    },
  ]

  return (
    <div className="main">
      <Container>
        <div className={styles.fav_container}>
          <h2 className={styles.fav_header}>Sản phẩm yêu thích</h2>
          <div className={styles.fav_body}>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Hình ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataFav.map((item, index) => (
                  <tr key={item.bookId}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={item.image}/>
                    </td>
                    <td>{item.name}</td>
                    <td>{format.formatPrice(item.price)}</td>
                    <td>
                      <button className={styles.remove_btn}>Xóa</button>
                    </td>
                    <td>
                      <button className={styles.add_cart_btn}>Thêm</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  )
}
