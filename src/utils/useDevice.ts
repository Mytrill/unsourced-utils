import { createContext, useContext } from "react"
import { isMobile as isMobileUA } from "is-mobile"

export type DeviceType = "mobile" | "tablet" | "desktop"

export interface Device {
  device: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function getDevice(ua?: string): Device {
  const mobile = isMobileUA({ ua })
  const tablet = isMobileUA({ ua, tablet: true })

  const isMobile = mobile
  const isTablet = !mobile && tablet
  const isDesktop = !mobile && !tablet
  const device: DeviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop"

  return {
    device,
    isDesktop,
    isMobile,
    isTablet,
  }
}

const DeviceContext = createContext<Device>(getDevice())

export const DeviceProvider = DeviceContext.Provider

export function useDevice() {
  return useContext(DeviceContext)
}
