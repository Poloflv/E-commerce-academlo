async function getProducts() {
    try {
        const data = await fetch("https://services-academlo-shopping.onrender.com/")

        const res = await data.json()

        window.localStorage.setItem("products", JSON.stringify(res) )

        return res;
    } catch (error) {
        console.log(error);
    }
}

function printProducts(db) {
    const productsHTML = document.querySelector(".products");

    let html = "";

    for (const product of db.products) {

        const buttonAdd = product.quantity ? `<i class="bx" id="${product.id}"></i>` : '<span class="soldOut">sold out</span>'


        html += `
        <div class="mix ${product.category} product" data-order="${product.category}">
            <div class="product__img">
                <img class="img" src="${product.image}" alt"imagen" />
            </div>

            <div class="product__info">
            <h4 class="modal" id="${product.id}">${product.name} | <span><b>Stock:</b> ${product.quantity} </span> </h4>
            <h5>
            $${product.price}
            ${buttonAdd}
            <i class='bx bx-plus' id="${product.id}"></i>
            </h5>
            </div>

        </div>
        ` 
        
    }
    
    productsHTML.innerHTML = html;
}

function handleShowCart() {
    const iconCartHTML = document.querySelector(".bx-cart");
    const cartHTML = document.querySelector(".cart");

    iconCartHTML.addEventListener("click", function() {
        cartHTML.classList.toggle("cart__show")
    });
}

function closeInicio() {
    const pInicial = document.querySelector("#closeP");
    const cartInicioHTML = document.querySelector(".cart");

    pInicial.addEventListener("click", function() {
        cartInicioHTML.classList.toggle("cart__show")
    });
}


function addCartFromProducts(db) {
    const productsHTML = document.querySelector(".products");
    
    productsHTML.addEventListener("click", function(e) {
        if(e.target.classList.contains("bx-plus")){
            const id = Number(e.target.id);
                  
                    const productFind = db.products.find((product) => product.id === id);
                    

                    if(db.cart[productFind.id] ){
                        
                        if(productFind.quantity === db.cart[productFind.id].amount )
                        return alert("No tenemos mas en bodega");
                        
                        
                        db.cart[productFind.id].amount++

                    }else {
                        if( productFind.quantity === 0) return alert("No tenemos mas en bodega");

                        db.cart[productFind.id] = {...productFind, amount: 1};
                    }
                    
                    window.localStorage.setItem("cart", JSON.stringify(db.cart) )
                    printProductsInCart(db);
                    printTotal(db);
                    handlePrintAmountProducts(db);
                    
                }
                
            })
        }

function printProductsInCart(db) {
        const cardProducts = document.querySelector(".card__products");

        let html = ""
        for (const product in db.cart) {
            const {quantity, price, name, image, id , amount} = db.cart[product];
            html += `
            <div class="card__product">
                <div class="card__product--img">
                    <img src="${image}" alt="imagen" />
                </div>
                <div class="card__product--body">
                    <h4>${name} | $${price}</h4>
                    <p>Stock: ${quantity}</p>
    
                    <div class="card__product--body-op" id="${id}">
                    <i class='bx bx-minus'></i>
                    <span>${amount} unit</span>
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash' ></i>
                    </div>
                </div>
            </div>
            `
        }
    
        cardProducts.innerHTML = html;
        
        
};

function handleProductsInCart(db) {
        const cardProducts = document.querySelector(".card__products");
    cardProducts.addEventListener("click", function (e) {
        
        if(e.target.classList.contains("bx-plus")){
            const id = Number(e.target.parentElement.id);
            const productFind = db.products.find((product) => product.id === id);
            
            if(productFind.quantity === db.cart[productFind.id].amount || productFind.quantity === 0)
            return alert("No tenemos mas en bodega");
            db.cart[id].amount++
        }

        if(e.target.classList.contains("bx-minus")){
            const id = Number(e.target.parentElement.id);

            if(db.cart[id].amount === 1){
                const response = confirm("Estas seguro de que quieres eliminar este producto?")
                if( !response) return;
                delete db.cart[id];
            } else {

                db.cart[id].amount--
            }
        }

        if(e.target.classList.contains("bx-trash")){
            const id = Number(e.target.parentElement.id);
            const response = confirm("Estas seguro de que quieres eliminar este producto?")
                if( !response) return;
            delete db.cart[id];
        };


        window.localStorage.setItem("cart", JSON.stringify(db.cart))
        printProductsInCart(db);
        printTotal(db);
        handlePrintAmountProducts(db);
    })
};

function printTotal(db) {
        const infoTotal = document.querySelector(".info__total");
        const infoAmount = document.querySelector(".info__amount");
    
    
        let totalProducts = 0;
        let amountProducts = 0;
    
        for (const product in db.cart) {
            const {amount, price} = db.cart[product];
            totalProducts += price * amount;
            amountProducts += amount;
        }
    
        infoAmount.textContent =  amountProducts  + " units";
        infoTotal.textContent =  "$" + totalProducts + ".00" ;
        // console.log(amountProducts, totalProducts);
};

function handleTotal(db) {
        const btnBuy = document.querySelector(".btn__buy");

        btnBuy.addEventListener("click",function() {
            if(!Object.values(db.cart).length) return alert("Tienes que seleccionar un producto antes de comprar.");
    
            const response = confirm("Seguro que quieres comprar?")
            if(!response) return;
            
            const currentProducts = []
    
            for (const product of db.products) {
                const productCart = db.cart[product.id];
                if(product.id === productCart?.id ){
                    currentProducts.push({
                        ...product,
                        quantity: product.quantity - productCart.amount
    
                    });
    
                } else {
                    currentProducts.push(product);
                }
            }
    
            db.products = currentProducts;
            db.cart = {}
    
            window.localStorage.setItem("products", JSON.stringify(db.products));
            window.localStorage.setItem("cart", JSON.stringify(db.cart));
    
            printTotal(db);
            printProductsInCart(db);
            printProducts(db);
            handlePrintAmountProducts(db);
            addModal(db);
            
        });
};

function handlePrintAmountProducts(db) {
        const amountProducts = document.querySelector(".amountProducts");
    
    let amount = 0;
    for (const product in db.cart) {

        amount += db.cart[product].amount;
    }

    amountProducts.textContent = amount;
        
};

function MoodDark() {
    const changeThemeHTML = document.querySelector("#changeTheme1");

    const isDark = () => JSON.parse(localStorage.getItem("isDark"));
    document.body.classList.toggle("darkmode", isDark());

    changeThemeHTML.addEventListener("click", () => {
        if (isDark()) {
            localStorage.setItem("isDark", JSON.stringify(false));
            document.body.classList.remove("darkmode");
        } else {
            localStorage.setItem("isDark", JSON.stringify(true));
            document.body.classList.add("darkmode");

        }
});



    
}

function filterProducts() {
    document.addEventListener("DOMContentLoaded",function () {
        var mixer = mixitup('.products');

        
    });
    
}

function filterProducts2() {
    const padre = document.querySelector("#products")
    const btns = document.querySelectorAll(".button__filter");

    btns.forEach((buttons__filter) =>{
        buttons__filter.addEventListener("click",(e) => {
            btns.forEach((button__filter) => button__filter.classList.remove("btn--active"));
            btns.forEach((button__filter) => button__filter.classList.add("button__filter"));
            
            
            if (buttons__filter.classList.contains("button__filter") ) {
                buttons__filter.classList.add("btn--active");
                buttons__filter.classList.remove("button__filter");
            } 
            
        });
    });

    window.addEventListener("load", function () {
        padre.classList.add("btn--active")
        padre.classList.remove("button__filter")
    })
}

function loader() {
    window.addEventListener("load", function () {
        document.getElementById("loader").classList.toggle("loader2")
    })


    
}





function addModal(db) {
    const productsHTML = document.querySelector(".products");
    
    productsHTML.addEventListener("click", function(e) {
        if(e.target.classList.contains("modal")){
            const idconst = Number(e.target.id);

            
            const containerProductFind = db.products.find((product) => product.id === idconst);
            const {image, category,id, description, name,price,quantity} = containerProductFind;
            const modalContentInfoHTML = document.querySelector(".modal__content__info");
            
            
            const modalPoloHTML = document.querySelector(".modal-polo");
            const iconCloseHTML = document.querySelector(".iconClose");
            
            modalContentInfoHTML.innerHTML = `
            <div class="modal__content__img">
            <img src="${image}" alt="" />
            </div>
            <h2>${name}</h2>
            <p>${description}</p>
            <div class="priceModal">
            <h3>$${price}</h3>
            <i class='bx bx-plus' id="${id}"></i>
            <span><b>Stock:</b> ${quantity} </span>
            </div>
            `;
            
            

            modalPoloHTML.classList.add("modal-polo-hidden")
            
            iconCloseHTML.addEventListener("click", () => {
                modalPoloHTML.classList.remove("modal-polo-hidden")
            });
            
            
            
            
            
                }
                
            })
        }
        
        
        function modal(db) {
        
            const modalContentInfoHTML = document.querySelector(".modal__content__info");
            
            
            modalContentInfoHTML.addEventListener("click", (e) => {

                if(e.target.classList.contains("bx-plus")){
                    const id = Number(e.target.id);
                    const containerProductFind = db.products.find((product) => product.id === id);
                    

                    if(db.cart[containerProductFind.id] ){
                        
                        if(containerProductFind.quantity === db.cart[containerProductFind.id].amount ) return alert("No tenemos mas en bodega");
                        
                        
                        db.cart[containerProductFind.id].amount++;
        
                    }else {
                        if( containerProductFind.quantity === 0) return alert("No tenemos mas en bodega");
        
                        db.cart[containerProductFind.id] = {...containerProductFind, amount: 1};
        
                    }
        
                    
                    
                    window.localStorage.setItem("cart", JSON.stringify(db.cart) )
                    printProductsInCart(db);
                    
                    printTotal(db);
                    handlePrintAmountProducts(db);
                    return;
                    
                }
            } )
        }

function showNav() {

    const navbar = document.querySelector("#header");
    const aChange = document.querySelector("#link");
    const changeCart = document.querySelector("#cart");
    
    // window.addEventListener("scroll", () => {
    //     if (window.scroll === 150) {
    //         navbar.classList.add("show__header");
    //     } else {
    //         navbar.classList.remove("show__header");

    //     }})

    window.addEventListener("load", function () {
        if (changeCart.classList.contains("cart")) {
            changeCart.classList.remove("cart");
            changeCart.classList.add("cart__inicio");
        }
    })

    window.onscroll = function() {
        if (window.scrollY >= 88) {
            navbar.classList.add("show__header");
        } 

        if (window.scrollY <= 87) {
            navbar.classList.remove("show__header");
        } 

        if (window.scrollY <= 499) {
            
            if (changeCart.classList.contains("cart")) {
                changeCart.classList.remove("cart");
                changeCart.classList.add("cart__inicio");
            }

            if (aChange.classList.contains("link__change")) {
                aChange.classList.remove("link__change");
            }
        } 

        if (window.scrollY >= 500) {


            if (changeCart.classList.contains("cart__inicio")) {
                changeCart.classList.remove("cart__inicio");
                changeCart.classList.add("cart");
            }
            
            aChange.classList.add("link__change");
        } 

      };
}



    async function main () {
            const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || await getProducts(),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };
    

    // console.log(db.products);

    printProducts(db);
    handleShowCart();
    addCartFromProducts(db);
    printProductsInCart(db);
    handleProductsInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db);
    MoodDark();
    filterProducts();
    loader();
    addModal(db);
    showNav();
    modal(db);
    closeInicio();
    filterProducts2();
}

main();