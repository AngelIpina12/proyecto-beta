import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder = env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;


const certificateName = "WMS.UI.CustomerPortal";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = 'https://3.90.94.64/CUSTOMERBKEND';  // La URL de tu API en producción

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    base: '/CUSTOMERBKEND/',
    build: {
        assetsDir: 'assets',  // Asegura que los recursos estáticos se ubiquen en la carpeta assets
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/CUSTOMERBKEND/api': {
                target: target,  // Redirige todas las solicitudes con ese prefijo a tu API
                changeOrigin: true,  // Cambia el origen de la solicitud
                secure: false,  // Si tu API está en HTTPS, asegúrate de que sea true
                rewrite: (path) => path.replace(/^\/CUSTOMERBKEND/, ''),  // Elimina el prefijo /CUSTOMERBKEND en la solicitud
            }
        },
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
