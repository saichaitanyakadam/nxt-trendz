import {useContext} from 'react'
import Header from '../Header'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import './index.css'
import {AppContext} from '../../context/Appcontext'

const Cart = () => {
  const {cartItems, setCartItems} = useContext(AppContext)
  const handleSubtract = product => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === product.id) {
        return {...item, count: item.count - 1}
      }
      return item
    })
    const finalCartItems = updatedCartItems.filter(item => item.count > 0)
    setCartItems(finalCartItems)
  }
  const handleAdd = product => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === product.id) {
        return {...item, count: item.count + 1}
      }
      return item
    })
    setCartItems(updatedCartItems)
  }

  return (
    <>
      <Header />
      {cartItems.length ? (
        <div className="cart-items-container">
          {cartItems.map(product => (
            <div className="cart-item-container">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="cart-item-image"
              />
              <div className="cart-text-container">
                <h3>{product.title}</h3>
                <p>By {product.brand}</p>
              </div>
              <div className="cart-item-price-container">
                <div className="btn-container">
                  <BsDashSquare onClick={() => handleSubtract(product)} />
                  <p>{product.count}</p>
                  <BsPlusSquare
                    onClick={() => {
                      handleAdd(product)
                    }}
                  />
                </div>
                <h3>
                  <span>Rs: </span>
                  {product.price * product.count}/-
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cart-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-img.png"
            alt="cart"
            className="cart-img"
          />
        </div>
      )}
    </>
  )
}

export default Cart
