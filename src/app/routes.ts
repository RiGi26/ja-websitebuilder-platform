import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { TemplateDetail } from "./pages/TemplateDetail";
import { Pricing } from "./pages/Pricing";
import { OrderForm } from "./pages/OrderForm";
import { Portfolio } from "./pages/Portfolio";
import { CaseStudy } from "./pages/CaseStudy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "template/:id", Component: TemplateDetail },
      { path: "pricing", Component: Pricing },
      { path: "order", Component: OrderForm },
      { path: "portfolio", Component: Portfolio },
      { path: "portfolio/:id", Component: CaseStudy },
    ],
  },
]);
