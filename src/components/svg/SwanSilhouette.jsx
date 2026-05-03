import React from 'react';

const SwanSilhouette = ({ opacity = 0.04, ...rest }) => (
  <svg
    viewBox="0 0 600 480"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...rest}
  >
    <path
      d="M80 360 C 110 330, 150 320, 200 322 C 260 324, 320 340, 380 340 C 450 340, 500 320, 520 280 C 500 320, 460 348, 420 358 C 430 352, 438 342, 444 330 C 446 322, 444 314, 438 308 C 426 296, 414 286, 410 270 C 406 250, 414 232, 426 218 C 438 204, 446 188, 446 170 C 446 150, 432 134, 414 130 C 402 128, 392 132, 386 142 C 382 150, 384 158, 392 164 C 398 168, 404 168, 410 166"
      fill="none"
      stroke="#83DFE9"
      strokeOpacity={opacity * 6}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M210 322 C 240 300, 280 290, 320 296 C 350 300, 372 312, 380 332"
      fill="none"
      stroke="#83DFE9"
      strokeOpacity={opacity * 6}
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default SwanSilhouette;
