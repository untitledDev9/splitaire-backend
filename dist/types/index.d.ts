import { Request } from 'express';
import { Document, Types } from 'mongoose';
export interface IUser extends Document {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IAccountDetails {
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
    paymentHandle?: string;
    currency?: string;
}
export interface IParticipant {
    participantId?: string;
    name: string;
    email: string;
    amountOwed: number;
    isPaid: boolean;
    paidAt?: Date;
}
export interface IBillItem {
    description: string;
    amount: number;
    paidBy: string;
    splitBetween: string[];
}
export declare enum SplitMethod {
    EQUAL = "equal",
    PERCENTAGE = "percentage",
    CUSTOM = "custom",
    ITEM_BASED = "itemBased"
}
export interface IBill extends Document {
    _id: Types.ObjectId;
    billId: string;
    billName: string;
    totalAmount: number;
    currency: string;
    createdBy?: Types.ObjectId | string;
    createdByEmail?: string;
    createdByName?: string;
    participants: IParticipant[];
    items?: IBillItem[];
    splitMethod: SplitMethod;
    notes?: string;
    accountDetails?: IAccountDetails;
    isSettled: boolean;
    settledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
}
export interface ICustomSplit {
    participantEmail: string;
    percentage?: number;
    amount?: number;
}
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        fullName: string;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
export interface CreateBillRequest {
    billName: string;
    totalAmount: number;
    currency?: string;
    participants: Array<{
        name: string;
        email: string;
    }>;
    items?: IBillItem[];
    splitMethod: SplitMethod;
    customSplits?: ICustomSplit[];
    notes?: string;
    createdByName?: string;
    createdByEmail?: string;
    accountDetails?: IAccountDetails;
}
export interface UpdateBillRequest {
    billName?: string;
    totalAmount?: number;
    participants?: Array<{
        name: string;
        email: string;
    }>;
    items?: IBillItem[];
    splitMethod?: SplitMethod;
    customSplits?: ICustomSplit[];
    notes?: string;
    accountDetails?: IAccountDetails;
}
export interface MarkPaymentRequest {
    participantEmail: string;
    isPaid: boolean;
}
export interface EmailData {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export interface PaginationOptions {
    page: number;
    limit: number;
    sort?: string;
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
//# sourceMappingURL=index.d.ts.map