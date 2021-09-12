import React from "react";

import style from "./index.module.scss";

export interface Timestamp {
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
  url: string,
  data: Array<Timestamp>;
}

interface IState {
  timestamps: Array<Timestamp>
}

export default class extends React.Component<IProps, IState> {
  private readonly video;

  constructor(props) {
    super(props);

    this.state = {
      timestamps: []
    };

    this.video = React.createRef();
  }

  componentDidMount() {
    this.video.current.addEventListener("timeupdate", () => {
      const { data } = this.props;
      const { timestamps } = this.state;

      const video = this.video.current;

      const newTimestamps = [...timestamps];

      const ms = video.currentTime * 1000;

      // Check new timestamps
      data.forEach((item) => {
        // Check on exist
        if (newTimestamps.indexOf(item) !== -1) {
          return;
        }

        if (ms < item.timestamp) {
          return;
        }

        if (ms > (item.timestamp + item.duration)) {
          return;
        }

        newTimestamps.push(item);
      });

      // Check old timestamps
      timestamps.forEach((item, index) => {
        if (
          (ms > (item.timestamp + item.duration))
          || (ms < item.timestamp)
        ) {
          newTimestamps.splice(index, 1);
        }
      });

      this.setState({
        timestamps: newTimestamps
      });
    });
  }

  gotoTimestamp(timestamp: number): void {
    const video = this.video.current;

    video.currentTime = timestamp / 1000;
  }

  formatTimestamp(ms: number): string {
    const m = Math.floor(ms / 60000);
    const s = ((ms % 60000) / 1000);

    const formatNumber = (number: number) => {
      if (number < 10) {
        return "0" + number;
      }

      return number;
    };

    return `${m}:${formatNumber(s)}`;
  }

  render() {
    const { url, data } = this.props;
    const { timestamps } = this.state;

    return (
      <div className={style.index}>
        <label className={style.video}>
          <video
            ref={this.video}
            src={url}
            controls
          />
          {timestamps.map((item, index) => (
            <div
              className={style.timestamp}
              key={index}
              style={{
                width: item.zone.width,
                height: item.zone.height,
                top: item.zone.top,
                left: item.zone.left
              }}
            />
          ))}
        </label>
        <table className={style.table}>
          <thead>
          <tr>
            <th>#</th>
            <th>От</th>
            <th>До</th>
            <th>Продолжительность</th>
            <th>Действие</th>
          </tr>
          </thead>
          <tbody>
          {data.map((item, index) => (
            <tr className={timestamps.indexOf(item) !== -1 ? style.active : ""} key={index}>
              <td>{item.id}</td>
              <td>{this.formatTimestamp(item.timestamp)}</td>
              <td>{this.formatTimestamp(item.timestamp + item.duration)}</td>
              <td>{this.formatTimestamp(item.duration)}</td>
              <td>
                <a onClick={() => this.gotoTimestamp(item.timestamp)}>Перейти</a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}
