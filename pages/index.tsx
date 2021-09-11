import React from "react";
import axios from "axios";

import style from "./index.module.scss";

interface Timestamp {
  id: number,
  timestamp: number,
  duration: number,
  zone: {
    left: number,
    top: number,
    width: number,
    height: number
  }
}

interface IProps {
  data: Array<Timestamp>;
}

interface IState {
  url: string,
  lastId: number,
  timestamps: Array<Timestamp>
}

export default class Index extends React.Component<IProps, IState> {
  private readonly video;

  constructor(props) {
    super(props);

    this.state = {
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      lastId: 0,
      timestamps: []
    };

    this.video = React.createRef();
  }

  static async getInitialProps() {
    const { data } = await axios.get("http://www.mocky.io/v2/5e60c5f53300005fcc97bbdd");

    return {
      data: data.sort((a, b) => a.timestamp - b.timestamp)
    };
  }

  componentDidMount() {
    console.log(this.props.data);
    this.video.current.addEventListener("timeupdate", () => {
      const { data } = this.props;
      const { timestamps, lastId } = this.state;

      const video = this.video.current;

      const newTimestamps = [...timestamps];

      const ms = video.currentTime * 1000;

      // Check new timestamps
      data.forEach((item) => {
        /*
          timestamp - 1000
          duration - 500
          ms - 1200
         */
        if (ms < item.timestamp) {
          return;
        }

        if (ms > (item.timestamp + item.duration)) {
         return;
        }

        console.log("push new item", item);

        newTimestamps.push(item);
      });

      // Check old timestamps
      timestamps.forEach((item, index) => {
        if (ms > (item.timestamp + item.duration)) {
          console.log("remove item", item);
          newTimestamps.splice(index, 1);
        }
      });
      console.log(ms);

      this.setState({
        timestamps: newTimestamps
      });
      console.log("---");
    });
  }

  render() {
    const { url, timestamps } = this.state;

    return (
      <div>
        <label className={style.video}>
          <video
            ref={this.video}
            src={url}
            controls
          />
          {timestamps.map((item) => (
            <div
              className={style.timestamp}
              style={{
                width: item.zone.width,
                height: item.zone.height,
                top: item.zone.top,
                left: item.zone.left
              }}
            />
          ))}
        </label>
      </div>
    );
  }
}
