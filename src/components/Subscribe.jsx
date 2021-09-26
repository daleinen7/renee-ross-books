import React, { useEffect } from "react";
import { Card } from "react-bootstrap";

export default function Subscribe() {
  useEffect(() => {
    const script = document.createElement("script");
    // script['data-form'] = '4b2750ed-163b-11ec-96e5-06b4694bee2a'
    script.async = true;
    script.src =
      "https://eomail5.com/form/4b2750ed-163b-11ec-96e5-06b4694bee2a.js";
    script.setAttribute("data-form", "4b2750ed-163b-11ec-96e5-06b4694bee2a");
    console.log(script);
    document.querySelector("#subscribe").append(script);
  }, []);

  return <div id="subscribe"></div>;
}
