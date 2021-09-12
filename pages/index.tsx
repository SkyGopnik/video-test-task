import React from "react";
import axios from "axios";

import TimestampVideo, {Timestamp} from "components/TimestampVideo";

interface IProps {
  data: Array<Timestamp>;
}

export default class extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  static async getInitialProps() {
    const { data } = await axios.get("https://www.mocky.io/v2/5e60c5f53300005fcc97bbdd");

    return {
      data: data.sort((a, b) => a.timestamp - b.timestamp)
    };
  }

  render() {
    const { data } = this.props;
    return (
      <TimestampVideo
        url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        data={data}
      />
    );
  }
}
