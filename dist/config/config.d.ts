interface Config {
    port: number;
    nodeEnv: string;
    mongoUri: string;
    jwtSecret: string;
    jwtExpire: string;
    email: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
    };
    frontendUrl: string;
    corsOrigin: string[];
}
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map