# MacroBoard

This project is split in two parts the embedded device firmware and the web part for configuring it.

## Firmware

Built via the embassy framework.

### Hardware info

[seeed studio RP2040](https://wiki.seeedstudio.com/XIAO-RP2040/)
Board was created by [@L-S-2020](https://github.com/L-S-2020/leoboard´).

### Requirements

[https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads)

### Usb descriptor docs

[Microsoft Docs](https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/standard-usb-descriptors)

## Web

Built with react and served by vite. It relios on the [Web USB Api](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API).
