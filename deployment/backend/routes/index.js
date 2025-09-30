"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const facebook_1 = __importDefault(require("./facebook"));
const dashboard_1 = __importDefault(require("./dashboard"));
const subscription_1 = __importDefault(require("./subscription"));
const router = express_1.default.Router();
// Health check for API
router.get('/', (req, res) => {
    res.json({
        message: '🚀 LiveSell Pro API - The SystemKH Killer!',
        version: '1.0.0',
        status: 'operational',
        features: {
            aiPowered: true,
            realTimeUpdates: true,
            multiChannel: true,
            modernTech: true,
            betterPricing: '34% cheaper than SystemKH'
        }
    });
});
// Route modules
router.use('/auth', auth_1.default);
router.use('/facebook', facebook_1.default);
router.use('/dashboard', dashboard_1.default);
router.use('/subscription', subscription_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map