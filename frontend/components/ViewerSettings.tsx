import React from 'react'

type ViewerSettingsProps = {
  enablePostProcessing: boolean
  ssaoIntensity: number
  bloomIntensity: number
  dofFocalLength: number
  setEnablePostProcessing: (value: boolean) => void
  setSsaoIntensity: (value: number) => void
  setBloomIntensity: (value: number) => void
  setDofFocalLength: (value: number) => void
}

const ViewerSettings: React.FC<ViewerSettingsProps> = ({
  enablePostProcessing,
  ssaoIntensity,
  bloomIntensity,
  dofFocalLength,
  setEnablePostProcessing,
  setSsaoIntensity,
  setBloomIntensity,
  setDofFocalLength,
}) => {
  return (
    <div className="absolute bottom-0 right-0 z-10 p-4 bg-white shadow-md">
      <div>
        <label htmlFor="enablePostProcessing" className="block text-sm font-medium text-gray-700">
          Enable Post Processing
        </label>
        <input
          type="checkbox"
          id="enablePostProcessing"
          checked={enablePostProcessing}
          onChange={(e) => setEnablePostProcessing(e.target.checked)}
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="ssaoIntensity" className="block text-sm font-medium text-gray-700">
          SSAO Intensity
        </label>
        <input
          type="range"
          id="ssaoIntensity"
          min="0"
          max="300"
          value={ssaoIntensity}
          onChange={(e) => setSsaoIntensity(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{ssaoIntensity.toFixed(1)}</span>
      </div>
      <div>
        <label htmlFor="bloomIntensity" className="block text-sm font-medium text-gray-700">
          Bloom Intensity
        </label>
        <input
          type="range"
          id="bloomIntensity"
          min="0"
          max="3"
          step="0.1"
          value={bloomIntensity}
          onChange={(e) => setBloomIntensity(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{bloomIntensity.toFixed(1)}</span>
      </div>
      <div>
        <label htmlFor="dofFocalLength" className="block text-sm font-medium text-gray-700">
          DOF Focal Length
        </label>
        <input
          type="range"
          id="dofFocalLength"
          min="0"
          max="0.1"
          step="0.01"
          value={dofFocalLength}
          onChange={(e) => setDofFocalLength(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{dofFocalLength.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default ViewerSettings