# MacroBoard

This project is split in two parts the embedded device driver and the web part for configuring it.

## Technical

The driver and the web page for configuring talk to each other via web usb.

## Firmware

### Hardware info

seeed studio RP2040

[https://github.com/rp-rs/rp-hal-boards/tree/main/boards/seeeduino-xiao-rp2040](https://github.com/rp-rs/rp-hal-boards/tree/main/boards/seeeduino-xiao-rp2040)

[https://crates.io/crates/embedded-hal](https://crates.io/crates/embedded-hal) [https://crates.io/crates/rp2040-hal](https://crates.io/crates/rp2040-hal) [https://github.com/rp-rs/rp-hal](https://github.com/rp-rs/rp-hal) [https://github.com/rp-rs/rp2040-project-template](https://github.com/rp-rs/rp2040-project-template)

### Requirements

[https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads](https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads)

## Web

RUST GEHT NICHT, da web asm nicht aktuell is. also react daddy und ts-rs type gen

## Ideas

-   Shared Profiles => exported configs so => web parts

## Knowledge

[USB](https://learn.microsoft.com/en-us/windows-hardware/drivers/usbcon/standard-usb-descriptors)