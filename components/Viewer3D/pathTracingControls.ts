import { presetsObj } from '@react-three/drei/helpers/environment-assets'
import { folder, useControls } from 'leva'

export function PathTracingControls() {
  return {
    Rendering: folder({
      Rendering_Factor: {
        value: 0.75,
        max: 1,
        min: 0,
        step: 0.01,
        label: 'Resolution Factor',
      },
      Rendering_Samples: {
        value: 2,
        max: 20,
        min: 1,
        step: 1,
        label: 'Samples',
      },
      Rendering_Bounces: {
        value: 4,
        max: 20,
        min: 1,
        step: 1,
        label: 'Bounces',
      },
      Rendering_Tiles: {
        value: {
          x: 2,
          y: 2,
        },
        max: 20,
        min: 1,
        step: 1,
        label: 'Tiles',
        joystick: false,
      },
      Rendering_Enabled: {
        value: false,
        label: 'Enabled',
      },
    }),
    Environment: folder({
      Environment_Visible: {
        value: false,
        label: 'Enabled',
      },
      Environment_Preset: {
        options: Object.keys(presetsObj),
        value: 'apartment',
        label: 'Preset',
      },
      Environment_Intensity: {
        value: 1,
        max: 10,
        min: 0,
        step: 0.01,
        label: 'Intensity',
      },
      Environment_Blur: {
        value: 0,
        max: 1,
        min: 0,
        step: 0.01,
        label: 'Blur',
      },
    }),
  }
}
