import React, { Fragment, useState, useEffect } from 'react'
import Cart from "../components/Cart";
import axios from 'axios';

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

    const RequestGet = async (path) => {
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
        try {
            RequestGet("/product")
        } catch (error) {
            alert(error?.message);
        }
    }, [])

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