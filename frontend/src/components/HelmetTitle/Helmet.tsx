import React from "react";
import HelmetExport from "react-helmet";

interface Props {
    children: React.ReactNode
}
export default function Helmet({children} : Props) {
    return <HelmetExport>
          <meta charSet="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{children}</title>
    </HelmetExport>
}