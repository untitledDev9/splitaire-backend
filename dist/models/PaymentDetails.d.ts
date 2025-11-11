import mongoose, { Document } from 'mongoose';
export interface IPaymentMethod {
    type: 'bank_account' | 'paypal' | 'venmo' | 'cashapp' | 'zelle' | 'crypto' | 'other';
    label: string;
    details: {
        accountName?: string;
        accountNumber?: string;
        bankName?: string;
        routingNumber?: string;
        username?: string;
        phoneNumber?: string;
        email?: string;
        walletAddress?: string;
        network?: string;
        instructions?: string;
    };
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
}
export interface IPaymentDetails extends Document {
    userId: mongoose.Types.ObjectId;
    paymentMethods: IPaymentMethod[];
    defaultCurrency: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const PaymentDetails: mongoose.Model<IPaymentDetails, {}, {}, {}, mongoose.Document<unknown, {}, IPaymentDetails, {}, {}> & IPaymentDetails & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default PaymentDetails;
//# sourceMappingURL=PaymentDetails.d.ts.map