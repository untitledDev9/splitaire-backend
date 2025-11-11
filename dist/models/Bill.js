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
const uuid_1 = require("uuid");
const types_1 = require("../types");
const participantSchema = new mongoose_1.Schema({
    participantId: {
        type: String,
        default: () => (0, uuid_1.v4)(),
    },
    name: {
        type: String,
        required: [true, 'Participant name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Participant email is required'],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    amountOwed: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Amount owed cannot be negative'],
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
}, { _id: false });
const billItemSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: [true, 'Item description is required'],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Item amount is required'],
        min: [0.01, 'Item amount must be greater than 0'],
    },
    paidBy: {
        type: String,
        required: [true, 'Paid by field is required'],
    },
    splitBetween: {
        type: [String],
        required: [true, 'Split between field is required'],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one person must be selected for splitting',
        },
    },
}, { _id: false });
const billSchema = new mongoose_1.Schema({
    billId: {
        type: String,
        required: true,
        unique: true,
        default: () => (0, uuid_1.v4)(),
    },
    billName: {
        type: String,
        required: [true, 'Bill name is required'],
        trim: true,
        minlength: [3, 'Bill name must be at least 3 characters long'],
        maxlength: [200, 'Bill name cannot exceed 200 characters'],
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0.01, 'Total amount must be greater than 0'],
    },
    currency: {
        type: String,
        default: 'USD',
        uppercase: true,
        enum: {
            values: ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'INR', 'JPY', 'CNY'],
            message: 'Invalid currency code',
        },
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional for guest users
    },
    createdByEmail: {
        type: String,
        trim: true,
        lowercase: true,
    },
    createdByName: {
        type: String,
        trim: true,
    },
    participants: {
        type: [participantSchema],
        required: [true, 'At least one participant is required'],
        validate: {
            validator: function (v) {
                return v.length >= 2;
            },
            message: 'At least 2 participants are required to split a bill',
        },
    },
    items: {
        type: [billItemSchema],
    },
    splitMethod: {
        type: String,
        enum: {
            values: Object.values(types_1.SplitMethod),
            message: 'Invalid split method',
        },
        default: types_1.SplitMethod.EQUAL,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    // 👇 NEW: Account details for payments
    accountDetails: {
        bankName: {
            type: String,
            trim: true,
        },
        accountNumber: {
            type: String,
            trim: true,
        },
        accountHolderName: {
            type: String,
            trim: true,
        },
        paymentHandle: {
            type: String, // e.g., PayPal, Cash App, Venmo, etc.
            trim: true,
        },
        currency: {
            type: String,
            default: 'USD',
            uppercase: true,
        },
    },
    isSettled: {
        type: Boolean,
        default: false,
    },
    settledAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
        // Guest bills expire after 90 days
        default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
}, {
    timestamps: true,
});
// Indexes
billSchema.index({ billId: 1 });
billSchema.index({ createdBy: 1 });
billSchema.index({ 'participants.email': 1 });
billSchema.index({ createdAt: -1 });
billSchema.index({ expiresAt: 1 });
// Middleware to update settlement status
billSchema.pre('save', function (next) {
    const allPaid = this.participants.every((p) => p.isPaid);
    if (allPaid && !this.isSettled) {
        this.isSettled = true;
        this.settledAt = new Date();
    }
    else if (!allPaid && this.isSettled) {
        this.isSettled = false;
        this.settledAt = undefined;
    }
    next();
});
// Virtual for checking if bill is expired
billSchema.virtual('isExpired').get(function () {
    return this.expiresAt ? new Date() > this.expiresAt : false;
});
const Bill = mongoose_1.default.model('Bill', billSchema);
exports.default = Bill;
//# sourceMappingURL=Bill.js.map