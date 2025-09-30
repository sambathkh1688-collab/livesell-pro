"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'Subscription Management - Coming Soon!',
        plans: {
            free: { price: 0, features: 'Basic features' },
            starter: { price: 19, savings: '34% vs SystemKH ($29)' },
            professional: { price: 39, savings: '34% vs SystemKH ($59)' },
            enterprise: { price: 99, savings: '34% vs SystemKH ($149)' }
        }
    });
});
exports.default = router;
//# sourceMappingURL=subscription.js.map