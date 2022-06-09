import { Card } from "react-bootstrap";
import styles from "./FlowerItem.module.css";
import format from "../../helper/format";
import { Link } from "react-router-dom";

function FlowerItem({data}) {

  const { price , discount } = data
  let newPrice = price
  if (discount > 0) {
    newPrice = price - price * discount / 100
  }

  return (
    <div className={styles.flowerItem}>
      <Card className={styles.card}>
        <Link to={`/chi-tiet-san-pham/${data.slug}`} className={styles.flowerInfo}>
          <Card.Img variant="top" src={data.imageUrl} alt="" />
          <Card.Body>
            <Card.Title className={styles.name}>{data.name} - {data.occasion?.name || data.occasion[0]?.name}</Card.Title>
          </Card.Body>
        </Link>
        <Card.Footer className={styles.cardFooter}>
          <span className={styles.price}>{format.formatPrice(newPrice)}</span>
          {discount > 0 && <span className={styles.oldPrice}>{format.formatPrice(data.price)}</span>}
        </Card.Footer>
      </Card>
    </div>
  );
}

export default FlowerItem;
