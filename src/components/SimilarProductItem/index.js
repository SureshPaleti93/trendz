// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props
  return (
    <li className="similar-product-bg-container">
      <div>
        <img
          src={similarProduct.imageUrl}
          alt="similar product"
          className="similar-product-image"
        />
        <p className="similar-product-title">{similarProduct.title}</p>
        <p className="similar-product-brand">By {similarProduct.brand}</p>
        <p className="price-rating-element">
          <span className="price-tag">Rs {similarProduct.price}/-</span>
          <span className="star-element">
            {similarProduct.rating}
            <img
              className="rating-star"
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
            />
          </span>
        </p>
      </div>
    </li>
  )
}
export default SimilarProductItem
