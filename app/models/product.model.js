module.exports = mongoose => {
    const Product = mongoose.model(
        "product",
        mongoose.Schema(
            {
                name: String,
                image: String,
                price: String
            },
            { timestamps: true }
        )
    );

    return Product;
};