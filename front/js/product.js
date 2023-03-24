//Récupération de l'id de l'url
let productId = (new URL(document.location)).searchParams.get('id');

//Requête à l'API pour récupérer les infos du produit
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(product) {
        generateElement(product);
        addProductToCart(product);
});

//Création de la fiche produit
function generateElement (product) {
    const productTitle = document.querySelector("title");
    productTitle.innerText = product.name;

    const productImgContainer = document.querySelector(".item__img");
    const productImg = document.createElement("img");
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;
    productImgContainer.appendChild(productImg);

    const productName = document.querySelector("#title");
    productName.innerText = product.name;

    const productPrice = document.querySelector("#price");
    productPrice.innerText = product.price;

    const productDescription = document.querySelector("#description");
    productDescription.innerText = product.description;

    const productColorsContainer = document.querySelector("#colors");
    const productColors = product.colors;
    for (let color of productColors) {
        const productColor = document.createElement("option");
        productColor.setAttribute("value", color);
        productColor.innerText = color;

        productColorsContainer.appendChild(productColor);
    }  
}

//Vérification de l'existence du panier dans le localStorage ou création si pas existant
const cartStorage = window.localStorage.getItem("cart");
let cart;
if (cartStorage === null) {
    cart = [];
    window.localStorage.setItem("cart", JSON.stringify(cart));
} else {
    cart = JSON.parse(cartStorage);
}

//Obtention de la couleur souhaitée
function getColorValue () {
    const productColorsList = document.querySelector("#colors");
    return productColorsList.value;
}

//Obtention de la quantité sélectionnée
function getQuantityValue () {
    const productQuantityInput = document.querySelector("#quantity");
    return parseInt(productQuantityInput.value);
}


//Envoie du ou des produits dans le panier situé dans le localStorage
function addProductToCart () {
    const addProductToCartButton = document.querySelector("#addToCart");
    addProductToCartButton.addEventListener("click", function () {
        let productColor = getColorValue();
        
        let productQuantity = getQuantityValue();

        errorMessage(productColor, productQuantity);

        let sameProduct = cart.find(element => element.id === productId && element.color === productColor);
        if ((productColor.split("")).length > 0 && productQuantity > 0) {
            if (sameProduct){
                sameProduct.quantity += productQuantity;
            } else {
                let productToCart = {
                    id: productId,
                    quantity: productQuantity,
                    color: productColor
                };
                cart.push(productToCart);
            }
        }
        window.localStorage.removeItem("cart");
        window.localStorage.setItem("cart", JSON.stringify(cart));
        
        console.log(cart);
        console.log(window.localStorage.getItem("cart"));
    });
}


//Message d'erreur si pas de couleur ou de quantité sélectionnée ou les deux manquants
function errorMessage (productColor, productQuantity) {
    if ((productColor.split("")).length === 0 && productQuantity != 0) {
        alert("Veuillez indiquer une couleur pour l'ajout au panier")
    }else if (productQuantity === 0 && (productColor.split("")).length != 0) {
        alert("Veuillez indiquer une quantité de produit supérieur à 0 pour l'ajout au panier")
    } else if ((productColor.split("")).length === 0 && productQuantity === 0) {
        alert("Veuillez indiquer une couleur et une quantité de produit supérieur à 0 pour l'ajout au panier")
    }
}