"use strict";
// // src/routes/paymentRoutes.ts
// import express from 'express';
// import { authenticate } from '../middleware/auth';
// import {
//   getPaymentDetails,
//   addPaymentMethod,
//   updatePaymentMethod,
//   deletePaymentMethod,
//   setDefaultPaymentMethod,
// } from '../controllers/paymentdetailscontroller';
// import {
//   markPaymentAsPaid,
//   confirmPayment,
//   getPaymentStatus,
//   addPaymentDetailsToBill,
//   getBillPaymentDetails,
// } from '../controllers/billController';
// const router = express.Router();
// // Payment Details Management Routes
// router.get('/payment-details', authenticate, getPaymentDetails);
// router.post('/payment-details/methods', authenticate, addPaymentMethod);
// router.put('/payment-details/methods/:methodId', authenticate, updatePaymentMethod);
// router.delete('/payment-details/methods/:methodId', authenticate, deletePaymentMethod);
// router.patch('/payment-details/methods/:methodId/default', authenticate, setDefaultPaymentMethod);
// // Bill Payment Tracking Routes
// router.post('/bills/:billId/payments/mark-paid', markPaymentAsPaid); // Can be public for guests
// router.post('/bills/:billId/payments/confirm', authenticate, confirmPayment); // Creator only
// router.get('/bills/:billId/payments/status', getPaymentStatus); // Can be public
// router.post('/bills/:billId/payment-details', authenticate, addPaymentDetailsToBill); // Creator only
// router.get('/bills/:billId/payment-details', getBillPaymentDetails); // Can be public
// export default router;
//# sourceMappingURL=paymentRoutes.js.map