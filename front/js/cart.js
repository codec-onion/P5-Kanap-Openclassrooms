//Récupération et désérialisation du panier dans le localStorage
const cartStorage = window.localStorage.getItem("cart");
const cart = JSON.parse(cartStorage);
console.log(cart);

//Récupération des données des produits présents dans le panier
recoveryElementData();
function recoveryElementData () {
    if (cart) {
        for (element of cart) {
            const productId = element.id;
            const productElement = element;
            fetch(`http://localhost:3000/api/products/${productId}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(product) {
                generateElement(product, productElement);
            });
        }
    }
} 

//Création de la fiche produit
function generateElement (product, productElement) {
    const productsList = document.querySelector("#cart__items");
    const productArticle = document.createElement("article");
    productArticle.className = "cart__item";
    productArticle.dataset.id = product._id;
    productArticle.dataset.color = productElement.color;
    productsList.appendChild(productArticle);


    const productDivImg = document.createElement("div");
    productDivImg.className = "cart__item__img";
    const productImg = document.createElement("img");
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    productDivImg.appendChild(productImg);
    productArticle.appendChild(productDivImg);


    const productDivContent = document.createElement("div");
    productDivContent.className = "cart__item__content";
    productArticle.appendChild(productDivContent);


    const productDescriptionDiv = document.createElement("div");
    productDescriptionDiv.className = "cart__item__content__description";
    const productName = document.createElement("h2");
    productName.innerText = product.name;
    const productTextColor = document.createElement("p");
    productTextColor.innerText = productElement.color;
    const productPrice = document.createElement("p");
    productPrice.innerText = `${product.price} €`;

    productDescriptionDiv.appendChild(productName);
    productDescriptionDiv.appendChild(productTextColor);
    productDescriptionDiv.appendChild(productPrice);
    productDivContent.appendChild(productDescriptionDiv);


    const productDivSettings = document.createElement("div");
    productDivSettings.className = "cart__item__content__settings";
    const productDivQuantity = document.createElement("div");
    productDivQuantity.className = "cart__item__content__settings__quantity";
    const productTextQuantity = document.createElement("p");
    productTextQuantity.innerText = "Qté : ";
    const productQuantityInput = document.createElement("input");
    productQuantityInput.setAttribute("type", "number");
    productQuantityInput.className = "itemQuantity";
    productQuantityInput.setAttribute("name", "itemQuantity");
    productQuantityInput.setAttribute("min", "1");
    productQuantityInput.setAttribute("max", "100");
    productQuantityInput.setAttribute("value", productElement.quantity);

    productDivQuantity.appendChild(productTextQuantity);
    productDivQuantity.appendChild(productQuantityInput);
    productDivSettings.appendChild(productDivQuantity);
    productDivContent.appendChild(productDivSettings);


    const productDivDelete = document.createElement("div");
    productDivDelete.className = "cart__item__content__settings__delete";
    const productTextDelete = document.createElement("p");
    productTextDelete.className = "deleteItem";
    productTextDelete.innerText = "Supprimer";

    productDivDelete.appendChild(productTextDelete);
    productDivSettings.appendChild(productDivDelete);
}

function priceTotal () {

}