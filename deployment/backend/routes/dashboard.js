"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'Dashboard API - Coming Soon!',
        features: [
            'Real-time analytics',
            'AI-powered insights',
            'Revenue tracking',
            'Customer behavior analysis'
        ]
    });
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map