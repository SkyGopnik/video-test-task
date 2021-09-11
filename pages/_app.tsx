import React from "react";
import axios from "axios";
import Head from "next/head";
import Router, { withRouter } from "next/router";

axios.defaults.responseType = 'json';

export class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  static async getServerSideProps({ res }) {
    res.setHeader(
      'Cache-Control',
      'public, maxage=9999999, stale-while-revalidate=59'
    );

    return {
      props: {}
    }
  }

  componentDidMount() {
    const tempFix = () => {
      const allStyleElems = document.querySelectorAll('style[media="x"]');
      allStyleElems.forEach((elem) => {
        elem.removeAttribute("media");
      });
    };

    Router.events.on('routeChangeComplete',  () => tempFix());
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Тестовое задание</title>
          <meta name="viewport" content="width=device-width" />
          <meta name="theme-color" content="#1F1F1F" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

export default withRouter(App);
