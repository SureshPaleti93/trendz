// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productData: [],
    count: 1,
    errorMsg: '',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  onDecreaseCountClick = () => {
    const {count} = this.state
    if (count > 0) {
      const updatedCount = count - 1
      this.setState({count: updatedCount})
    }
  }

  onIncrementClick = () => {
    const {count} = this.state
    const updatedCount = count + 1
    this.setState({count: updatedCount})
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const productDetailsApiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(productDetailsApiUrl, options)
    const data = await response.json()
    if (response.status === 200) {
      this.dataLoggedSuccess(data)
    } else {
      this.setState({
        errorMsg: data.error_msg,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  dataLoggedSuccess = data => {
    const updatedData = {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts: data.similar_products,
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }
    this.setState({
      apiStatus: apiStatusConstants.success,
      productData: updatedData,
    })
  }

  renderFailureView = () => {
    const {errorMsg} = this.state
    return (
      <div>
        <Header />
        <div className="not-found-container">
          <img
            className="not-found-image"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
            alt="error view"
          />
          <h1>Product Not Found</h1>
          <button type="button" className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  renderProgressView = () => (
    <div>
      <Header />
      <div data-testid="loader" className="loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </div>
  )

  renderSuccessView = () => {
    const {productData, count} = this.state
    const {similarProducts} = productData
    const updatedSimilarProducts = similarProducts.map(eachProduct => ({
      availability: eachProduct.availability,
      brand: eachProduct.brand,
      description: eachProduct.description,
      id: eachProduct.id,
      imageUrl: eachProduct.image_url,
      price: eachProduct.price,
      rating: eachProduct.rating,
      style: eachProduct.style,
      title: eachProduct.title,
      totalReviews: eachProduct.total_reviews,
    }))

    return (
      <div>
        <Header />
        <div className="product-display-container">
          <div className="image-container">
            <img
              className="product-image"
              src={productData.imageUrl}
              alt="product"
            />
          </div>
          <div className="content-container">
            <h1 className="product-title">{productData.title}</h1>
            <p className="product-price">Rs {productData.price}/- </p>
            <p className="reviews-rating">
              <span className="product-rating">
                {productData.rating}{' '}
                <img
                  className="star-img"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </span>
              {'  '}
              {productData.totalReviews} Reviews
            </p>
            <p className="product-description">{productData.description}</p>
            <p className="availability">
              Available:
              <span className="span-element">{productData.availability}</span>
            </p>
            <p className="availability">
              Brand: <span className="span-element">{productData.brand}</span>
            </p>
            <div className="counter-container">
              <button
                data-testid="minus"
                type="button"
                className="control-btn"
                onClick={this.onDecreaseCountClick}
              >
                {'  '} <BsDashSquare />
              </button>
              <p>{count}</p>

              <button
                data-testid="plus"
                type="button"
                className="control-btn"
                onClick={this.onIncrementClick}
              >
                {'  '}
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-btn-element">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1>Similar Product</h1>
        <ul className="similar-product-ul-elements">
          {updatedSimilarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              similarProduct={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderProgressView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}
export default ProductItemDetails
