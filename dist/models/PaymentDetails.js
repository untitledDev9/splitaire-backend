"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const paymentDetailsSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    paymentMethods: [
        {
            type: {
                type: String,
                enum: ['bank_account', 'paypal', 'venmo', 'cashapp', 'zelle', 'crypto', 'other'],
                required: true,
            },
            label: {
                type: String,
                required: true,
                trim: true,
            },
            details: {
                // For bank accounts
                accountName: { type: String, trim: true },
                accountNumber: { type: String, trim: true },
                bankName: { type: String, trim: true },
                routingNumber: { type: String, trim: true },
                // For payment apps
                username: { type: String, trim: true },
                phoneNumber: { type: String, trim: true },
                email: { type: String, trim: true },
                // For crypto
                walletAddress: { type: String, trim: true },
                network: { type: String, trim: true },
                // Additional info
                instructions: { type: String, trim: true },
            },
            isDefault: {
                type: Boolean,
                default: false,
            },
            isActive: {
                type: Boolean,
                default: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    defaultCurrency: {
        type: String,
        default: 'USD',
        trim: true,
    },
}, {
    timestamps: true,
});
// Ensure only one default payment method per user
paymentDetailsSchema.pre('save', function (next) {
    if (this.paymentMethods && this.paymentMethods.length > 0) {
        const defaultMethods = this.paymentMethods.filter((method) => method.isDefault);
        if (defaultMethods.length > 1) {
            // Keep only the first default, set others to false
            this.paymentMethods.forEach((method, index) => {
                if (index > 0 && method.isDefault) {
                    method.isDefault = false;
                }
            });
        }
    }
    next();
});
const PaymentDetails = mongoose_1.default.model('PaymentDetails', paymentDetailsSchema);
exports.default = PaymentDetails;
//# sourceMappingURL=PaymentDetails.js.map