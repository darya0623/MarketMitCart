import React, { Fragment, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Cart from "../components/Cart"
import axios from 'axios'
import { useCart } from 'react-use-cart'

const Product = () => {

    const [GetProduct, setGetProduct] = useState({})
    const [DataProducts, setDataProducts] = useState([])
    const { id } = useParams();
    const { addItem } = useCart();

    const RequestGet = async (path) => {
        path = `http://localhost:9000` + path;
        await axios.get(path).then(response => {
            const data = response.data;

            setGetProduct(() => data ? data : {})
        }).catch(error => {
            console.error(error);
        });

        await axios
            .get(`http://localhost:9000/product`)
            .then(response => {
                const data = response.data;

                setDataProducts(
                    () => data && data.length ? data : []
                )
            })
    }

    const handleBuy = () => {
        window.alert(`Product ${GetProduct.title} was added to a cart`);

        addItem(GetProduct); 

        setTimeout(() => {
            window.location.replace("/Market/bag/")
        }, 1000)
    }

    useEffect(() => {
        try {
            RequestGet(`/product/${id}`)
        } catch (error) {
            alert(error?.message)
        }
    }, [GetProduct.id, id, DataProducts.length])

    const seealsoItem = DataProducts
    .filter(product => Number(product.id) !== Number(id))
    .sort((a, b) => b.id - a.id )
    .slice(0, 3)
    .map(product => {
        return <Fragment key={product.id}>
            <Cart
                price={product.price}
                id={product.id}
                image={product.image}
                title={product.title}
            />
        </Fragment>
    })

    return (
        <Fragment>
            <section>
                <div className="Container">
                    <div className="main__row main__product-row">
                        <div className="main__imageholder">
                            <img src={GetProduct.image} alt="error" />
                        </div>

                        <div className="main__content">
                            <h2 className="title-2 main__title">
                                {GetProduct.title}
                            </h2>

                            <p className="price main__price">
                                {GetProduct.price}
                                <small className="currency-price"> руб.</small>
                            </p>

                            <div className="main__button">
                                <button onClick={handleBuy} className='main__button-black'>
                                    Купить в один клик
                                </button>
                            </div>

                            <div className="main__description">
                                <p>
                                    Новый MacBook Air — ещё более тонкий и лёгкий, оснащён дисплеем Retina, клавиатурой нового поколения, трекпадом Force Touch и технологией Touch ID, которая защищает ваши данные и открывает доступ к ним только вам.
                                </p>

                                <p>
                                    Это самый экологичный Mac. Для его корпуса используется только переработанный алюминий.1 И это невероятно удобный MacBook Air, который справится с любыми задачами.
                                </p>

                                <p>
                                    Подробнее об особенностях и преимуществах MacBook Air.
                                </p>
                            </div>

                            <div className="back">
                                <Link to={"/Market/"} className='back__link'>Назад</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="also">
                <div className="Container">
                    <h2 className="title-2">Смотрите также</h2>

                    <div className="also__row">
                        {seealsoItem}
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default Product