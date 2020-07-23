"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV, process.env.HOST, process.env.PORT);
const host = process.env.HOST;
const port = Number(process.env.PORT);
app
    .use(helmet_1.default())
    .use(body_parser_1.default.json())
    .use(body_parser_1.default.urlencoded({
    extended: true,
}))
    .use(cookie_parser_1.default())
    .use(connect_history_api_fallback_1.default({
    verbose: false,
}));
if (!isDev) {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
    app.listen(port, host, () => {
        console.log('Server listening on ' + host + ':' + port);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map