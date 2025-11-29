import dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'production') {
    import('./dist/server/server.js');
} else {
    import('@babel/register');
    import('./src/server/server.js');
}
