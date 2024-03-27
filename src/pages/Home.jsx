import React, { Fragment, useState, useEffect, useReducer } from 'react'
import Cart from "../components/Cart";
import axios from 'axios';

const reducer = (state, action) => {
    switch(action?.type){
        case "START":
            return {
                ...state,
                message: "START Loading"
            }
        case "LOADING":
            return{
                ...state,
                message: "Loading data..."
            }
        case "LOADED":
            return{
                ...state,
                message: "Loaded data"
            }
        case "ERROR":
            return{
                ...state,
                message: "Error while loading data"
            }
        default:
            throw new Error("Unknown type")
    }
}

const Pagination = ({ productsPerPage, totalProducts, paginate }) => {
    let array = [];

    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        array.push(i)
    }

    const buttonItem = array.map(btn => (
        <button className="pagination" onClick={() => paginate(btn)}>
            {btn}
        </button>
    ))

    return (
        <Fragment>
            {buttonItem}
        </Fragment>
    )
}

const Home = () => {
    const [Products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProductsPerPage] = useState(3);
    const [state, dispatch] = useReducer(reducer, {message: "Start"})

    const RequestGet = async (path) => {
        dispatch({type: "LOADING"})
        path = "http://localhost:9000" + path
        await axios.get(path).then(response => {
            const data = response.data;
            setProducts(() => data ? [...data] : [])
        }).catch(error => {
            console.error(error);
        })
    }

    // Get Current Products

    const indexOfLastProducts = currentPage * ProductsPerPage;
    const indexOfFirstProducts = indexOfLastProducts - ProductsPerPage;
    const currentProduct = Products
        .slice(indexOfFirstProducts, indexOfLastProducts);

    // Change page

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    useEffect(() => {
        dispatch({type: "START"})
        try {
            RequestGet("/product")
            dispatch({type: "LOADED"})
        } catch (error) {
            alert(error?.message);
            dispatch({type: "ERROR"})
        }
    }, [])

    console.log(state?.message);

    const product = Products
        .slice(indexOfFirstProducts, indexOfLastProducts)
        .map(product => {
            return <Cart
                key={product.id}
                id={product.id}
                price={product.price}
                title={product.title}
                image={product.image}
            />
        });

    return (
        <Fragment>
            <section>
                <div className="Container">
                    <h2 className="title-2">Магазин</h2>

                    <div className="main__row">
                        {product}
                    </div>

                    <div className="main__paginations">
                        <Pagination
                            paginate={paginate}
                            totalProducts={Products.length}
                            productsPerPage={ProductsPerPage}
                        />
                    </div>
                </div>
            </section>
        </Fragment>
    )
}

export default Home