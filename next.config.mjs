/** @type {import('next').NextConfig} */
const nextConfig = {
  // Les images sont servies depuis Supabase Storage ; on autorise le domaine au besoin.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
