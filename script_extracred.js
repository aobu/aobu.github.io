// Define an associative array for item prices
const itemPrices = {
    'hotdog': 3.75,
    'fries': 3.00,
    'soda': 2.50,
};
const itemQuantities = {};
function formatCurrency(amount) {
    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);
    const decimalString = (decimalPart < 10 ? '0' : '') + decimalPart;
    return '$' + integerPart + '.' + decimalString;
}
function calculateSubtotal() {
    let subtotal = 0;
    for (const item in itemQuantities) {
        if (itemQuantities.hasOwnProperty(item)) {
            subtotal += itemQuantities[item] * itemPrices[item];
        }
    }
    return subtotal;
}

for (const item in itemPrices) {
    if (itemPrices.hasOwnProperty(item)) {
        const quantity = parseInt(prompt(`How many ${item}s do you want?`));
        itemQuantities[item] = quantity;
    }
}
const subtotal = calculateSubtotal();

let discount = 0;
if (subtotal >= 25) {
    discount = subtotal * 0.10;
}
const TAX_RATE = 0.0625;
const tax = (subtotal - discount) * TAX_RATE;
const total = (subtotal - discount) + tax;

const orderSummary = document.getElementById('order-summary');
orderSummary.innerHTML = '<h2>Order Summary</h2>';

for (const item in itemQuantities) {
    if (itemQuantities.hasOwnProperty(item)) {
        orderSummary.innerHTML += `<p>${item.charAt(0).toUpperCase() + item.slice(1)}: ${itemQuantities[item]} x ${formatCurrency(itemPrices[item])} = ${formatCurrency(itemQuantities[item] * itemPrices[item])}</p>`;
    }
}

orderSummary.innerHTML += `
    <p>Subtotal before discount: ${formatCurrency(subtotal)}</p>
    <p>Discount: ${formatCurrency(discount)}</p>
    <p>Subtotal after discount: ${formatCurrency(subtotal - discount)}</p>
    <p>Tax: ${formatCurrency(tax)}</p>
    <p><strong>Final Total: ${formatCurrency(total)}</strong></p>
`;
