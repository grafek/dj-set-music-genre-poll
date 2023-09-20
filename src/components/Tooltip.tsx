import { type TransitionStatus } from "react-transition-group";
import { DefaultStyle, TransitionStyle } from "../types";
import { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  transitionState: TransitionStatus;
  defaultStyle: DefaultStyle;
  transitionStyles: TransitionStyle;
};

const Tooltip = forwardRef<HTMLDivElement | null, Props>(
  ({ children, defaultStyle, transitionState, transitionStyles }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          ...defaultStyle,
          ...transitionStyles[transitionState],
        }}
        className={`bottom-20 gap-4 z-[30] flex flex-col absolute rounded bg-primary-400 border border-primary-100 shadow-2xl p-2 text-xs`}
      >
        {children}
        <div className="h-0 w-0 absolute -bottom-2 z-[40] left-4 border-x-4 border-x-transparent border-t-[0.5rem] border-t-primary-100"></div>
      </div>
    );
  }
);

export default Tooltip;
