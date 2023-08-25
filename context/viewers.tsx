import { SetState } from '@types'
import CameraControls from 'camera-controls'
import React, { SetStateAction, createContext, useContext } from 'react'
import { Event, EventDispatcher } from 'three'

type Context = {
  isPathTracing: boolean
  isShiftKey: boolean
  setIsPathTracing: SetState<boolean>
  controls: EventDispatcher<Event>
  setControls: SetState<EventDispatcher<Event>>
}

type Provider = { value: Context; children: JSX.Element[] }

const context = {
  isPathTracing: false,
  setIsPathTracing: () => null,
  isShiftKey: false,
  controls: {} as {
    zoom: (zoom: number, bool: boolean) => void
    dolly: (dolly: number) => void
    forward: (a: number, b: boolean) => void
    truck: (a: number, b: number, c: boolean) => void
  },
  setControls: (controls: EventDispatcher<Event>) => null,
}
const ViewersContext = createContext(context)

const ViewersContextProvider = ({ value, children }: Provider) => (
  //TODO this context is a mess
  //@ts-expect-error
  <ViewersContext.Provider value={value}>{children}</ViewersContext.Provider>
)

const useViewerContext = () => useContext(ViewersContext)

export { ViewersContextProvider, useViewerContext }
