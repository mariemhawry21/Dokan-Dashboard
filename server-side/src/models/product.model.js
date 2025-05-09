const mongoose = require('mongoose');

const ALLOWED_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Dark Brown', hex: '#5C4033' },
    { name: 'Light Blue', hex: '#ADD8E6' },
    { name: 'Dark Blue', hex: '#00008B' },
    { name: 'Graphite Black', hex: '#1C1C1C' },
    { name: 'Navy Blue', hex: '#000080' },
    { name: 'Light Gray', hex: '#D3D3D3' },
    { name: 'Dark Gray', hex: '#A9A9A9' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Turquoise', hex: '#40E0D0' },
    { name: 'Light Green', hex: '#90EE90' },
    { name: 'Dark Green', hex: '#006400' },
    { name: 'Light Grey', hex: '#D3D3D3' },
    { name: 'Dark Grey', hex: '#A9A9A9' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Burgundy', hex: '#800020' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Mustard', hex: '#FFDB58' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Salmon', hex: '#FA8072' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Peach', hex: '#FFDAB9' },
    { name: 'walnut', hex: '#8B4513' },
    { name: 'White Stained', hex: '#F5F5F5' },
    { name: 'Pine', hex: '#F0E68C' },
    { name: 'Oak', hex: '#8B4513' },
];

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String },
        subtitle: { type: String, },
        price: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        sale: { type: Number, default: 0 },
        totalQuantity: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
        description: { type: String },
        brand: { type: String },
        colors: [
            {
                name: {
                    type: String,
                    required: true,
                    enum: ALLOWED_COLORS.map((c) => c.name),
                },
                hex: { type: String },
            images: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Image', // تأكدي إن 'Image' هو اسم الـ Model بتاع الصور عندك ('Gallary' في الكنترولر)
              },
            ],
                quantity: { type: Number, required: true },
                sku: { type: String, unique: true },
            },
        ],
        additionalInformation: {
            general: {
                salesPackage: { type: String },
                modelNumber: { type: String },
                secondaryMaterial: { type: String },
                configuration: { type: String },
                upholsteryMaterial: { type: String },
                upholsteryColor: { type: String },
            },
            productDetails: {
                fillingMaterial: { type: String },
                finishType: { type: String },
                adjustableHeadrest: { type: Boolean },
                maximumLoadCapacity: { type: Number },
                originOfManufacture: { type: String },
            },
            dimensions: {
                width: { type: Number },
                height: { type: Number },
                depth: { type: Number },
                seatHeight: { type: Number },
                legHeight: { type: Number },
            },
            materials: {
                primaryMaterial: { type: String },
                upholsteryMaterial: { type: String },
                upholsteryColor: { type: String },
                fillingMaterial: { type: String },
                finishType: { type: String },
            },
            specifications: {
                adjustableHeadrest: { type: Boolean },
                maximumLoadCapacity: { type: Number },
                originOfManufacture: { type: String },
                weight: { type: Number },
                brand: { type: String },
            },
            warranty: {
                summary: { type: String },
                serviceType: { type: String },
                covered: { type: String },
                notCovered: { type: String },
                domesticWarranty: { type: String },
            },
        },
    },
    { timestamps: true }
);

ProductSchema.pre('save', function (next) {
    this.colors.forEach((color) => {
        const colorInfo = ALLOWED_COLORS.find((c) => c.name === color.name);
        if (colorInfo) {
            color.hex = colorInfo.hex;
        } else {
            return next(new Error(`Invalid color name: ${color.name}`));
        }
        if (!color.sku) {
            color.sku = `${this.name}-${color.name}`
                .toUpperCase()
                .replace(/\s+/g, '-');
        }
    });

    this.totalQuantity = this.colors.reduce((sum, color) => sum + color.quantity, 0);

    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }

    next();
});

module.exports = mongoose.model('Product', ProductSchema);
