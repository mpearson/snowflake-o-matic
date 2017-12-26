import * as React from "react";
import "./snowflake-controls.less";
import * as classNames from "classnames";

export interface ButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
}
export const Button: React.SFC<ButtonProps> = props => {
  const classList = [];
  if (props.active)
    classList.push("active");
  return (
    <button className={classList.join(" ")} onClick={props.onClick}>
      {props.label}
    </button>
  );
};

export interface SnowflakeControlsProps {
  buttons?: ButtonProps[];
  controls?: SliderProps[];
}

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export const Slider: React.SFC<SliderProps> = props => (
  <div className="slider-control">
  <label>{props.label}: {props.value}</label>
  <input
    type="range"
    min={props.min}
    max={props.max}
    value={props.value}
    onChange={event => props.onChange(parseInt(event.target.value, 10))}
  />
</div>
);

export class SnowflakeControls extends React.Component<SnowflakeControlsProps> {
  public static defaultProps: SnowflakeControlsProps = {
    buttons: [],
    controls: [],
  };

  public render() {
    const { buttons, controls } = this.props;

    return (
      <section>
        <div className="buttons">
          {buttons.map((config, index) => <Button {...config} key={index} />)}
        </div>
        <div className="slider-controls">
          {controls.map((config, index) => <Slider {...config} key={index} />)}
        </div>
      </section>
    );
  }
}
