import type React from "react"

interface ViewerSettingsProps {
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
    <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-10">
      <h3 className="text-lg font-semibold mb-2">Viewer Settings</h3>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={enablePostProcessing}
            onChange={(e) => setEnablePostProcessing(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Enable Post-Processing</span>
        </label>
        <div>
          <label htmlFor="ssaoIntensity" className="block text-sm font-medium text-gray-700">
            SSAO Intensity
          </label>
          <input
            type="range"
            id="ssaoIntensity"
            min="0"
            max="300"
            step="1"
            value={ssaoIntensity}
            onChange={(e) => setSsaoIntensity(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{ssaoIntensity}</span>
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
            DoF Focal Length
          </label>
          <input
            type="range"
            id="dofFocalLength"
            min="0"
            max="0.1"
            step="0.001"
            value={dofFocalLength}
            onChange={(e) => setDofFocalLength(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{dofFocalLength.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}

export default ViewerSettings

