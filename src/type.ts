export const Device = {
	"esp32": "esp32",
	"m5atom": "m5atom",
	"m5stickc": "m5stickc",
	"m5stack": "m5stack",
}
export type Device = typeof Device[keyof typeof Device]

export const Platform = {
	"Windows": "Windows",
	"macOS": "macOS",
	"Linux": "Linux",
}
export type Platform = typeof Platform[keyof typeof Platform]

export const Architecture = {
	"ARMv7": "ARMv7",
	"ARM64": "ARM64",
	"32bit": "32bit",
	"64bit": "64bit",
}
export type Architecture = typeof Architecture [keyof typeof Architecture]

export const Extension = {
	".zip": ".zip",
	".tar.gz": ".tar.gz",
}
export type Extension = typeof Extension[keyof typeof Extension]



export type DeviceInfoList = {
	[key in Device]: DeviceInfo
}

export type DeviceInfo = {
	fqbn: string
	sketch: string
	library: string
	repo: string
}
