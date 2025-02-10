import type React from "react"

const LoadingCube: React.FC = () => {
  return (
    <div className="loading-cube-container">
      <div className="loading-cube">
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face right"></div>
        <div className="face left"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>
      <style jsx>{`
        .loading-cube-container {
          width: 50px;
          height: 50px;
          perspective: 100px;
        }
        .loading-cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotate 2s linear infinite;
        }
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 123, 255, 0.8);
          border: 2px solid #fff;
          opacity: 0.75;
        }
        .front  { transform: rotateY(0deg) translateZ(25px); }
        .back   { transform: rotateY(180deg) translateZ(25px); }
        .right  { transform: rotateY(90deg) translateZ(25px); }
        .left   { transform: rotateY(-90deg) translateZ(25px); }
        .top    { transform: rotateX(90deg) translateZ(25px); }
        .bottom { transform: rotateX(-90deg) translateZ(25px); }
        @keyframes rotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoadingCube

