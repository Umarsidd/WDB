const api = (process.env.API_ORIGIN || 'http://127.0.0.1:4000').replace(/\/$/,'');
export default {
  poweredByHeader:false,
  async rewrites() { return [{ source:'/api/:path*', destination:`${api}/api/:path*` }]; },
  async headers() {
    return [{ source:'/:path*', headers:[
      { key:'X-Content-Type-Options', value:'nosniff' },
      { key:'Referrer-Policy', value:'strict-origin-when-cross-origin' },
      { key:'X-Frame-Options', value:'DENY' },
      { key:'Permissions-Policy', value:'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};
