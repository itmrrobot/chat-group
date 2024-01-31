import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import GlobalStyles from "./components/GlobalStyles/index.tsx";
import { AppProvider } from "./context/index.tsx";
import { ChannelProvider } from "./context/channel.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStyles>
      <AppProvider>
        <ChannelProvider>
          <App />
        </ChannelProvider>
      </AppProvider>
    </GlobalStyles>
  </React.StrictMode>
);
