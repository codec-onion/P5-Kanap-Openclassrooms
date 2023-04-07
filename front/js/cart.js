//Récupération et désérialisation du panier dans le localStorage ou création si inexistant
const cartStorage = window.localStorage.getItem("cart");
let cart;
if (cartStorage === null) {
    cart = [];
    window.localStorage.setItem("cart", JSON.stringify(cart));
} else {
    cart = JSON.parse(cartStorage);
}

fetch(`http://localhost:3000/api/products/`)
.then(function(response) {
    return response.json();
})
.then(function(products) {
    generateElements(products);
    totalPriceCalculate(products);
    totalQuantityCalculate();
    changeQuantity(products);
    removeProduct(products);
    checkValidInputs();
    sendOrder();
    })
    .catch((error) => {
        console.log(error.message);
        const errorMsgContainer = document.querySelector("#cart__items");
        const errorMsg = document.createElement("h2");
        errorMsg.setAttribute("style", "color: #faa99d; font-weight: bold;");
        errorMsg.innerText = "Désolé, une erreur s'est produite. Impossible d'afficher le panier.";
        errorMsgContainer.appendChild(errorMsg);
});


//Création de la fiche produit
function generateElements (products) {
    if (cart) {
        for (let element of cart) {
            const product = products.find(el => el._id === element.id);

            const productsList = document.querySelector("#cart__items");
            const productArticle = document.createElement("article");
            productArticle.className = "cart__item";
            productArticle.dataset.id = element.id;
            productArticle.dataset.color = element.color;
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
            productTextColor.innerText = element.color;
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
            productQuantityInput.setAttribute("value", element.quantity);

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
    }
}

//Calcul du nombre de produits totaux
function totalQuantityCalculate () {
    let totalQuantity = 0;
    for (let element of cart) {
        totalQuantity +=  element.quantity;
    }
    const totalQuantityText = document.querySelector("#totalQuantity");
    totalQuantityText.innerText = totalQuantity;
}

//Calcul du prix total
function totalPriceCalculate (products) {
    let totalPrice = 0;
    for (let element of cart) {
        const product = products.find(el => el._id === element.id);
        let totalPriceProduct = product.price * element.quantity;
        totalPrice += totalPriceProduct;
    }
    const totalPriceText = document.querySelector("#totalPrice");
    totalPriceText.innerText = totalPrice;
}

//Modification nombre d'articles
function changeQuantity (products) {
    const quantityInput = document.querySelectorAll(`.itemQuantity`);
    for (let input of quantityInput) {
        input.addEventListener("change", function (e){
            const article = input.closest("article.cart__item");
            const id = article.dataset.id;
            const color = article.dataset.color;
            const productCart = cart.find(el => el.id === id && el.color === color);

            let newQuantity = e.target.value;

            if (newQuantity >= 1) {
                productCart.quantity = parseInt(newQuantity);

                window.localStorage.removeItem("cart");
                window.localStorage.setItem("cart", JSON.stringify(cart));

                totalQuantityCalculate();
                totalPriceCalculate(products);
            }
        });
    }
}

//Sppression d'un article du panier
function removeProduct (products) {
    const removeInput = document.querySelectorAll(`.deleteItem`);
    for (let input of removeInput) {
        input.addEventListener("click", function () {
            const article = input.closest("article.cart__item");
            const id = article.dataset.id;
            const color = article.dataset.color;
            const productCart = cart.find(el => el.id === id && el.color === color);
            const productCartIndex = cart.indexOf(productCart);

        
            cart.splice(productCartIndex,1);
            article.remove();

            window.localStorage.removeItem("cart");
            window.localStorage.setItem("cart", JSON.stringify(cart));

            totalQuantityCalculate();
            totalPriceCalculate(products);
        });
    }
}

//Ciblage des différents inputs
const firstNameInput = document.querySelector("#firstName");
const lastNameInput = document.querySelector("#lastName");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const emailInput = document.querySelector("#email");

//Variables de validation pour le formulaire
let isValidFirstName;
let isValidLastName;
let isValidAddress;
let isValidCity;
let isValidEmail;

//Vérification des inputs grâce au regex, affichage d'un message en cas d'invalidité
function checkValidInputs () {
    const nameRegex = /^[A-Za-zÀÁÂÃÄÅàáâãäåÒÓÔÕÖòóôõöÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ-\s]{3,}$/;
    const addressRegex = /^[\w\s,'-]{6,}$/;
    const cityRegex = /^[A-Za-z-]{2,}$/;
    const mailRegex = /^[^.][a-z0-9._-]{2,}[^.]@[^-][a-z0-9-]{2,}[^-]\.[a-z]{2,6}$/;

    

    const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
    firstNameInput.addEventListener("keyup", function () {
        if (nameRegex.test(firstNameInput.value)) {
            firstNameErrorMsg.innerText = "";
            isValidFirstName = true;
        } else {
            firstNameErrorMsg.innerText = "Prénom invalide. Le prénom ne peut contenir de chiffres ou de caractères spéciaux sauf le trait d'union ou l'espace.";
            isValidFirstName = false;
        }
    });
    
    const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
    lastNameInput.addEventListener("keyup", function () {
        if (nameRegex.test(lastNameInput.value)) {
            lastNameErrorMsg.innerText = "";
            isValidLastName = true;
        } else {
            lastNameErrorMsg.innerText = "Nom invalide. Le nom ne peut contenir de chiffres ou de caractères spéciaux sauf le trait d'union ou l'espace.";
            isValidLastName = false;
        }
    });

    const addressErrorMsg = document.querySelector("#addressErrorMsg");
    addressInput.addEventListener("keyup", function () {
        if (addressRegex.test(addressInput.value)) {
            addressErrorMsg.innerText = "";
            isValidAddress = true;
        } else {
            addressErrorMsg.innerText = "Adresse invalide. Si votre adresse contient des lettres accentuées, vous pouvez remplacer par les mêmes lettres sans accents. L'adresse ne peut contenir de caractères spéciaux autre que l'espace, la virgule, l'apostrophe ou le trait d'union.";
            isValidAddress = false;
        }
    });

    const cityErrorMsg = document.querySelector("#cityErrorMsg");
    cityInput.addEventListener("keyup", function () {
        if (cityRegex.test(cityInput.value)) {
            cityErrorMsg.innerText = "";
            isValidCity = true;
        } else {
            cityErrorMsg.innerText = "Nom de ville invalide. Si le nom de votre ville contient des lettres accentuées, vous pouvez remplacer par les mêmes lettres sans accents. Le nom de la ville ne peut contenir de chiffres ou de caractères spéciaux autre que le trait d'union.";
            isValidCity = false;
        }
    });

    const emailErrorMsg = document.querySelector("#emailErrorMsg");
    emailInput.addEventListener("keyup", function () {
        if (mailRegex.test(emailInput.value)) {
            emailErrorMsg.innerText = "";
            isValidEmail = true;
        } else {
            emailErrorMsg.innerText = "Email incorrect. Exemple: ex-am_ple98@exa-mple.com";
            isValidEmail = false;
        }
    });
}

//Envoie de la commande vers l'API
function sendOrder () {
    const sendButton = document.querySelector("#order");
    sendButton.addEventListener("click", function (event) {
        event.preventDefault();

        if (isValidFirstName && isValidLastName && isValidAddress && isValidCity && isValidEmail && cart.length >= 1) {
            const productsId = [];
            for (let element of cart) {
                productsId.push(element.id);
            }

            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contact: {
                        firstName: firstNameInput.value,
                        lastName: lastNameInput.value,
                        address: addressInput.value,
                        city: cityInput.value,
                        email: emailInput.value
                    },
                    products: productsId
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(orderData) {
                localStorage.clear();
                location.assign(`./confirmation.html?orderid=${orderData.orderId}`);
            })
            .catch((error) => {
                alert("Problème d'envoie du formulaire : " + error.message);
            });
        }
    });
}

