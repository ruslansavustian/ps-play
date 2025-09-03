import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ps-play.s3.amazonaws.com",
        port: "",
        pathname: "/photos/**",
        search: "",
      },
    ],
  },
};

export default withNextIntl(config);
