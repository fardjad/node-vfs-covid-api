const HOST = process.env.HOST || '0.0.0.0';
const PORT = /\d+/.test(String(process.env.PORT))
  ? Number(process.env.PORT)
  : 3000;

const serverConfig = {
  HOST,
  PORT,
};

export type ServerConfig = typeof serverConfig;
export default serverConfig;
