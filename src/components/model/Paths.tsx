import { useEffect, useMemo, useRef, useState } from "react";

export const Cylinder = () => {
  return (
    <>
      <path
        className="cls-27"
        d="m200.5,369.6c-98.6,0-178.5,15.7-178.5,35v437c0,19.3,79.9,34.9,178.5,34.9s178.5-15.6,178.5-34.9v-437c-.1-19.3-80-35-178.5-35h0Zm-177.1,39.4c.2.3.4.6.6.9-.2-.4-.4-.7-.6-.9Zm3.8,4c.6.5,1.3,1,2,1.4-.8-.5-1.4-.9-2-1.4Zm88.7,22.4c2,.2,4.1.4,6.2.6-2.1-.2-4.2-.4-6.2-.6Zm205.3-5.1c1.8-.3,3.6-.7,5.3-1-1.7.4-3.5.7-5.3,1Zm7.9-1.5c1.7-.3,3.4-.7,5-1.1-1.6.4-3.3.8-5,1.1Zm24.7-6.3c-1.9.6-3.9,1.2-6,1.8-1.4.4-2.8.8-4.3,1.2,1.5-.4,2.9-.8,4.3-1.2,2.1-.6,4.1-1.2,6-1.8s3.7-1.3,5.4-1.9c-1.7.6-3.5,1.3-5.4,1.9Zm7.1-2.6c1.1-.4,2.1-.9,3.2-1.3-1.1.4-2.1.9-3.2,1.3Zm3.2-1.3c1-.5,1.9-.9,2.8-1.4-.9.5-1.8.9-2.8,1.4Zm5.2-2.7c2.1-1.2,3.9-2.4,5.3-3.7.4-.4.8-.7,1.2-1.1-1.6,1.7-3.8,3.3-6.5,4.8h0Zm-1.1.6c.3-.2.6-.3.9-.5-.3.2-.6.4-.9.5Zm7.7-5.4c.4-.4.7-.8,1-1.1-.3.3-.7.7-1,1.1Zm1-1.2c.5-.6.9-1.3,1.2-1.9-.3.6-.7,1.3-1.2,1.9Z"
      />
      <path
        className="cls-26"
        d="m378.2,404.9c0,2.6-1.5,5.2-4.3,7.7-17.8,15.6-89,27.3-174.2,27.3s-156.3-11.7-174.2-27.3c-2.8-2.5-4.3-5-4.3-7.7,0-19.3,79.9-35,178.5-35s178.5,15.7,178.5,35h0Z"
      />
      <path
        className="cls-29"
        d="m378.9,841.1c0,2.6-1.5,5.2-4.3,7.7-17.8,15.6-89.1,27.3-174.2,27.3s-156.3-11.7-174.2-27.3c-2.8-2.5-4.3-5-4.3-7.7,0-19.3,79.9-35,178.5-35,98.6.1,178.5,15.7,178.5,35Z"
      />
    </>
  );
};

export const AirPump = () => {
  return (
    <>
      <path
        className="cls-24"
        d="m467.1,829.7c-2.8,0-5.1-2.3-5.1-5.1v-60.6c0-7-5.7-12.6-12.6-12.6s-12.6,5.7-12.6,12.6v32.8c0,6.8-3,7.5-4.6,7.6h-43.1v5h43.1c6.2-.1,9.6-4.7,9.6-12.6v-32.8c0-4.2,3.4-7.6,7.6-7.6s7.6,3.4,7.6,7.6v60.6c0,5.6,4.5,10.1,10.1,10.1,1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5Z"
      />
      <polygon
        className="cls-20"
        points="377 812 389.7 812 389.7 801.9 377 801.9 377 812"
      />
      <polygon
        className="cls-20"
        points="520.1 880.2 464.6 880.2 482.2 870.1 502.5 870.1 520.1 880.2"
      />
      <polygon
        className="cls-24"
        points="482.2 870.1 502.5 870.1 502.5 659.1 482.2 659.1 482.2 870.1"
      />
      <polygon
        className="cls-20"
        points="467.1 837.3 482.2 837.3 482.2 827.1 467.1 827.1 467.1 837.3"
      />
    </>
  );
};

export const HandPump = () => {
  return (
    <>
      <g>
        <polygon
          id="handPumpTubePiston"
          className="cls-24"
          points="487.3 749.2 497.4 749.2 497.4 631.1 487.3 631.1 487.3 749.2"
        />
        <path
          className="cls-24"
          d="m517.6,628.6h-15.2c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h15.2c1.4,0,2.5,1.1,2.5,2.5s-1.1,2.5-2.5,2.5"
        />
        <path
          className="cls-24"
          d="m482.2,628.6h-15.2c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5h15.2c1.4,0,2.5,1.1,2.5,2.5.1,1.4-1.1,2.5-2.5,2.5"
        />
      </g>
      <g>
        <polygon
          className="cls-20"
          points="482.2 631.1 502.5 631.1 502.5 621 482.2 621 482.2 631.1"
        />
        <polygon
          className="cls-20"
          points="517.6 631.1 542.9 631.1 542.9 621 517.6 621 517.6 631.1"
        />
        <polygon
          className="cls-20"
          points="441.8 631.1 467.1 631.1 467.1 621 441.8 621 441.8 631.1"
        />
      </g>
    </>
  );
};

export const Barometer = () => {
  return (
    <>
      <g id="Scales">
        <line className="cls-18" x1="434.4" y1="471.5" x2="429.6" y2="480.8" />
        <line className="cls-18" x1="414.7" y1="469" x2="419.2" y2="465.7" />
        <line className="cls-18" x1="405.3" y1="449.8" x2="411.4" y2="448.5" />
        <line className="cls-18" x1="404.8" y1="429.8" x2="410.6" y2="430.3" />
        <line className="cls-18" x1="413.7" y1="409.3" x2="418" y2="414.1" />
        <line className="cls-18" x1="429.6" y1="396.7" x2="431.9" y2="401.8" />
        <line className="cls-18" x1="449.3" y1="391.2" x2="449.3" y2="397.2" />
        <line className="cls-18" x1="469.8" y1="394.4" x2="467.5" y2="400.5" />
        <line className="cls-18" x1="486.7" y1="405.3" x2="482.4" y2="410.6" />
        <line className="cls-18" x1="497.5" y1="425.3" x2="489.5" y2="426.5" />
        <line className="cls-18" x1="499.3" y1="445.5" x2="491.7" y2="444.2" />
        <line className="cls-18" x1="492.2" y1="465.9" x2="486.2" y2="460.9" />
        <line className="cls-18" x1="477.3" y1="480.3" x2="471.8" y2="470.5" />
      </g>
      <path
        className="cls-19"
        d="m500.8,439.4c0,27.4-22.2,49.6-49.6,49.6-22.8,0-42-15.4-47.9-36.4-1.2-4.2-1.8-8.7-1.8-13.3,0-4.9.7-9.6,2-14,6-20.6,25.1-35.6,47.6-35.6,27.5,0,49.7,22.2,49.7,49.7h0Z"
      />
    </>
  );
};

export const Volume = () => {
  return (
    <>
      <path
        className="cls-15"
        d="m22.2,405.2v15.2h0c.7,19.1,80.3,34.5,177.8,34.5s177.3-15.5,177.8-34.6h0v-15.9l-355.6.8h0Zm177.9,34.5c-69.5,0-129.7-7.8-158.8-19.3l317.7-.1c-29,11.5-89.3,19.4-158.9,19.4h0Z"
      />
      <g>
        <path
          className="cls-20"
          d="m200.1,440.2c-83.8,0-155.1-11.2-173.4-27.3-2.9-2.6-4.4-5.3-4.4-8,0-9.5,18.6-18.4,52.3-25,33.5-6.6,78.1-10.2,125.5-10.2s92,3.6,125.5,10.2c33.8,6.6,52.3,15.5,52.3,25,0,2.7-1.5,5.4-4.5,8-18.3,16.1-89.6,27.3-173.3,27.3h0Z"
        />
        <path
          className="cls-22"
          d="m200.1,370.2c97.9,0,177.3,15.6,177.3,34.7,0,2.6-1.5,5.2-4.3,7.6-17.7,15.5-88.5,27.1-173.1,27.1s-155.3-11.6-173.1-27.1c-2.8-2.5-4.3-5-4.3-7.6.1-19.1,79.5-34.7,177.5-34.7m0-1c-47.4,0-92,3.6-125.6,10.2-24.1,4.7-52.7,13-52.7,25.5,0,2.9,1.6,5.7,4.6,8.4,8.8,7.7,30.8,14.7,62,19.6,31.5,5,71.2,7.8,111.8,7.8s80.3-2.8,111.7-7.8c31.2-4.9,53.2-11.9,62-19.6,3.1-2.7,4.6-5.5,4.6-8.4,0-12.6-28.7-20.8-52.8-25.5-33.6-6.5-78.2-10.2-125.6-10.2h0Z"
        />
      </g>
      <path className="cls-15" d="m173,397.9V.5h58v398.2s-31.8,11.4-58-.8h0Z" />
    </>
  );
};

export const Oxygen = () => {
  return (
    <>
      <path
        className="cls-12"
        d="m592.2,595.5v-5.8c0-3.1.5-6.1,1.5-9,2.3-6.6,7.9-16.5,20.8-16.5,19.2,0,22.2,17.2,22.2,22.2,0,4.2-1.7,154.9-2.3,208.3-.2,15.2-12.5,27.5-27.7,27.6h-.8c-25.8,0-32.6-23.5-49-7.1s-22.7,18.1-34.3,18.1h-7.2"
      />
      <rect className="cls-21" x="502.2" y="829.6" width="16.7" height="8.1" />
      <g>
        <path
          className="cls-7"
          d="m620.5,642.5v144.6h-56.8l-.4-144.6c-.2-1.2,0-2.5,0-3.7,0-11.9,7.3-22.1,17.7-26.4,3.3-1.4,7-2.1,10.9-2.1s7.9.8,11.4,2.4c10.1,4.4,17.2,14.5,17.2,26.2,0,1,0,3.6,0,3.6Z"
        />
        <path className="cls-7" d="m620.5,766.8h-56.8,56.8Z" />
        <path
          className="cls-4"
          d="m603.3,596.5v16c-3.5-1.5-7.3-2.4-11.4-2.4-3.8,0-7.5.8-10.9,2.1v-15.7h22.3Z"
        />
        <path
          className="cls-1"
          d="m564.4,610.2h0c-1.4,0-2.5-1.1-2.5-2.5v-15.2c0-1.4,1.1-2.5,2.5-2.5h0c1.4,0,2.5,1.1,2.5,2.5v15.2c0,1.4-1.1,2.5-2.5,2.5Z"
        />
        <rect className="cls-3" x="567.4" y="597.6" width="13.6" height="5.1" />
        <text
          className="st22 st6 st23"
          transform="matrix(1 0 0 1 602.5764 681.4803)"
        >
          2
        </text>
        <text
          className="st22 st6 st24"
          transform="matrix(0.9999 1.055186e-02 -1.055186e-02 0.9999 575.1836 703.4986)"
        >
          O
        </text>
      </g>
    </>
  );
};

export const CarbonDioxide = () => {
  return (
    <>
      <path
        className="cls-13"
        d="m691.3,616.8h0c20,0,36.3,15.6,36.3,34.9v122.2c0,16.4-11.8,30.6-28.5,34-9.6,2-42.4,3.1-48.3,5.4-36.8,14.4-14.2,20.8-46.2,26.8-30,5.6-49.3,2.9-72.5,3.7-3.2.1-15,.5-17.5.5"
      />
      <rect className="cls-25" x="502.2" y="840.2" width="16.7" height="8.1" />
      <g>
        <path
          className="cls-8"
          d="m712.1,656.4v130.4h-67v-132.4c0-14.2,8.8-26.3,21.2-31.2,3.8-1.5,7.9-2.3,12.3-2.3,3.9,0,7.7.7,11.2,1.9,13,4.6,22.2,17,22.2,31.6.1.7.1,2,.1,2Z"
        />
        <path
          className="cls-5"
          d="m689.8,602.6v20.3c-3.5-1.2-7.3-1.9-11.2-1.9-4.3,0-8.5.8-12.3,2.3v-20.7h23.5Z"
        />
        <rect className="cls-2" x="670.4" y="593" width="15.7" height="9.3" />
        <line className="cls-10" x1="665.1" y1="593" x2="691.6" y2="593" />
        <text
          transform="matrix(1 0 0 1 697.1379 707.8611)"
          className="st5 st6 st14"
        >
          2
        </text>
        <text
          transform="matrix(1 0 0 1 673.5854 701.1696)"
          className="st5 st6 st15"
        >
          O
        </text>
        <text
          transform="matrix(1 0 0 1 652.1508 701.1705)"
          className="st5 st6 st15"
        >
          C
        </text>
      </g>
    </>
  );
};

export const Nitrogen = () => {
  return (
    <>
      <path
        className="cls-13"
        d="m779,561.2s48.1-4.4,48.1,48.1v167.2c0,13.6-8.9,25.5-21.9,29.4-11.2,3.3-32.8,5.7-49.2,9.5-36.9,8.8-39.4-4-70.7,10.1s-54.1,32.8-85.9,32.8h-81.3"
      />
      <rect className="cls-23" x="502.2" y="853.3" width="16.7" height="8.1" />
      <g>
        <rect
          className="cls-9"
          x="737.9"
          y="603.6"
          width="67.8"
          height="182.7"
        />
        <path
          className="cls-6"
          d="m745.1,590.8c-3.9,3.2-7.2,7.4-7.2,12.8h67.8s.8-7.5-9.2-14.2c-5.4-3.6-11.7-5.3-18.2-5.4-4.3,0-9.2-.1-13.2-.1-7.1,0-14.3,2.3-20,6.9Z"
        />
        <rect className="cls-6" x="765" y="569.1" width="13.1" height="14.6" />
        <rect className="cls-6" x="768.5" y="550.1" width="5.7" height="19" />
        <rect className="cls-11" x="776" y="559.1" width="2.6" height="4" />
        <rect className="cls-9" x="762.8" y="553.6" width="2.8" height="7.5" />
        <path
          className="cls-11"
          d="m763.1,548.7h17.2s-2-4.1-7.4-4.1-7.8.8-9.8,4.1Z"
        />
        <text
          transform="matrix(1 0 0 1 780.72 706.2307)"
          className="st5 st6 st7"
        >
          2
        </text>
        <text
          transform="matrix(1 0 0 1 756.2708 701.9573)"
          className="st5 st6 st8"
        >
          N
        </text>
      </g>
    </>
  );
};
interface ThermometerProps {
  temperature?: number;
  initialTemperature?: number;
  finalTemperature?: number;
  unit?: "K" | "C" | "F";
  min?: number;
  max?: number;
}

// Helper function to convert temperature to Kelvin
const convertTemperature = (temp: number, unit: "K" | "C" | "F"): number => {
  switch (unit) {
    case "C":
      return temp + 273.15;
    case "F":
      return (temp - 32) * (5 / 9) + 273.15;
    default:
      return temp;
  }
};

export const Thermometer: React.FC<ThermometerProps> = ({
  temperature = 22,
  initialTemperature,
  finalTemperature,
  unit = "K",
  min,
  max,
}) => {
  const [currentTemp, setCurrentTemp] = useState(temperature);
  const animationRef = useRef<number | null>(null);

  // Define default ranges based on unit
  const defaultRanges = {
    K: { min: 0, max: 373.15 }, // 0K to 100°C
    C: { min: -50, max: 100 }, // -50°C to 100°C
    F: { min: -58, max: 212 }, // -58°F to 212°F
  };

  // Determine min and max, prioritizing prop values
  const { min: minTemp, max: maxTemp } = {
    min: min ?? defaultRanges[unit].min,
    max: max ?? defaultRanges[unit].max,
  };

  useEffect(() => {
    // If no animation is needed, just set the temperature directly
    if (initialTemperature === undefined || finalTemperature === undefined) {
      setCurrentTemp(temperature);
      return;
    }

    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTemp = initialTemperature;
    const endTemp = finalTemperature;
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const animateTemperature = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic ease in-out
      const easedProgress =
        progress < 0.5
          ? 4 * progress ** 3
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newTemp = startTemp + (endTemp - startTemp) * easedProgress;
      setCurrentTemp(newTemp);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateTemperature);
      } else {
        setCurrentTemp(endTemp);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animateTemperature);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initialTemperature, finalTemperature, temperature]);

  // Convert temperature to Kelvin for consistent calculations
  const kTemp = convertTemperature(currentTemp, unit);
  const kMinTemp = convertTemperature(minTemp, unit);
  const kMaxTemp = convertTemperature(maxTemp, unit);

  // Calculate fill height
  const minY = 457; // Top of thermometer
  const maxY = 527; // Bottom of thermometer
  const fillHeight = useMemo(() => {
    // Normalize temperature within range
    const normalizedTemp = (kTemp - kMinTemp) / (kMaxTemp - kMinTemp);
    // Ensure the fill is within bounds
    const clampedNormalizedTemp = Math.max(0, Math.min(1, normalizedTemp));
    return maxY - clampedNormalizedTemp * (maxY - minY);
  }, [kTemp, kMinTemp, kMaxTemp]);

  // Dynamic color based on temperature
  const mercuryColor = useMemo(() => {
    // Interpolate color from blue (cold) to red (hot)
    const hue = Math.max(
      0,
      Math.min(120, 120 * (1 - (kTemp - kMinTemp) / (kMaxTemp - kMinTemp)))
    );
    return `hsl(${hue}, 100%, 50%)`;
  }, [kTemp, kMinTemp, kMaxTemp]);

  return (
    <>
      {/* Mercury fill */}
      <path
        d={`M352.65,536.62
            a10.23,10.23 0 1,1 -20.46,0
            c0,-3.69 1.95,-6.93 4.89,-8.72
            v-${maxY - fillHeight}
            h10.74
            v${maxY - fillHeight}
            c2.8,1.82 4.65,4.98 4.65,8.57Z`}
        transform="translate(10, 0)"
        fill={mercuryColor}
        opacity="0.8"
      />
      {/* Thermometer outline */}
      <path
        className="cls-14"
        d="m362.9,536.7c0,5.7-4.6,10.2-10.2,10.2s-10.2-4.6-10.2-10.2c0-3.7,2-6.9,4.9-8.7-.1-.3-.1-.7-.1-1v-70.2c0-3,2.4-5.4,5.4-5.4h.3c3,0,5.4,2.4,5.4,5.4v70.2c0,.4,0,.8-.1,1.2,2.7,1.7,4.6,4.9,4.6,8.5h0Z"
      />
      <path className="cls-16" d="m345.8,536.8s1.6,5.9,5.6,5.9" />
      {/* Measurement lines */}
      <g id="Measurement">
        {[
          514.64, 507.44, 500.49, 493.42, 487.11, 460.2, 479.91, 472.96, 465.88,
        ].map((y, index) => (
          <line
            key={index}
            className="cls-14"
            x1={y > 500 ? "347.73" : "347.85"}
            y1={y}
            x2={y > 500 ? "353.66" : "350.89"}
            y2={y}
          />
        ))}
      </g>
      {/* Temperature label */}
      <text
        x="370"
        y="500"
        fill="black"
        fontSize="16"
        transform="translate(20, 38)"
      >
        {currentTemp.toFixed(1)} {unit}
      </text>
    </>
  );
};
