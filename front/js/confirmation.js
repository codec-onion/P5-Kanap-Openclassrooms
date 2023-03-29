//Récupération du numéro de commande dans l'url
const orderId = (new URL(document.location)).searchParams.get('orderid');

//Affichage du numéro sur la page
const orderIdText = document.querySelector("#orderId");
orderIdText.innerText = orderId;
