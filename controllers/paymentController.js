// Hardcode the test secret key directly to bypass environment variable load order issues
const stripe = require('stripe')('sk_test_yourStripeKeyHere');

// Create a Stripe checkout session for processing payments
exports.processPayment = async (req, res) => {
    try {
        const { items } = req.body; // Array of food items sent from front-end cart

        // Map the items into the specific object structure Stripe expects
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: { 
                    name: item.name 
                },
                unit_amount: item.price * 100, // Convert rupees to paise
            },
            quantity: item.quantity,
        }));

        // Initialize the official checkout session setup
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cart`,
        });

        // Send back the session URL so the frontend can redirect the user
        res.status(200).json({ 
            status: 'success', 
            url: session.url 
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};