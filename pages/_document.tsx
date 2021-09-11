import React from "react";
import DocumentNext, {Html, Head, Main, NextScript} from "next/document";

export default class extends DocumentNext {
  render() {
    return (
      <Html lang="ru">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
