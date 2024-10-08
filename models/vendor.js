import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VendorSchema = new Schema(
    {
        department: { type: String, required: true },
        shopName: { type: String, required: true },
        vendorName: { type: String, required: true },
        vendorEmail: { type: String, required: true, unique: true },
        vendorMobileNumber: { type: String, required: true },
        vendorAlternateMobileNumber: { type: String, required: true },
        vendorGpayNo: { type: String, required: true },
        vendorBankAcNo: { type: String, required: true },
        vendorBankName: { type: String, required: true },
        vendorBranch: { type: String, required: true },
        vendorIfsc: { type: String, required: true },
        vendorCommision: { type: String, required: true },
        shopAddress: { type: String, required: true },
        vendorPassword: { type: String, required: true },
        totalSaleAmount: { type: Number, default: 0 },
        vendorBalance: { type: Number, default: 0 },
        commissionAmount: { type: Number, default: 0 },
        role: { type: String, default: "vendor"},
        status: { type: String, enum: ['enabled', 'disabled'], default: 'enabled' },
    },
    { timestamps: true }
);

export default mongoose.model('Vendor', VendorSchema);