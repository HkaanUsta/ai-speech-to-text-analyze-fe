export async function rewrites() {
    return [
        {
            source: '/api/:path*',
            destination: 'http://127.0.0.1:8000/:path*',
        },
    ];
}
