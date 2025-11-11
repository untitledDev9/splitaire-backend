"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (config_1.default.corsOrigin.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parser middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging in development
if (config_1.default.nodeEnv === 'development') {
    app.use((req, _res, next) => {
        console.log(`📨 ${req.method} ${req.path}`);
        next();
    });
}
// API Routes
app.use('/api', routes_1.default);
// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Bill Splitter API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});
// 404 Handler - must be after all routes
app.use(errorHandler_1.notFoundHandler);
// Global error handler - must be last
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map