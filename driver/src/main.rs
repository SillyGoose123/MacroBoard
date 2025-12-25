#![no_std]
#![no_main]
extern crate alloc;

mod config;
mod key;
mod knob;
mod summer;
mod usb;

// REQUIRED so panic is set up correctly
use crate::key::switches::Switches;
use seeeduino_xiao_rp2040::hal::Sio;
use seeeduino_xiao_rp2040::{entry, hal, pac};

#[entry]
fn main() -> ! {
    let mut pac = pac::Peripherals::take().unwrap();
    let sio = Sio::new(pac.SIO);
    let pins = hal::gpio::Pins::new(
        pac.IO_BANK0,
        pac.PADS_BANK0,
        sio.gpio_bank0,
        &mut pac.RESETS,
    );

    let mut watchdog = hal::Watchdog::new(pac.WATCHDOG);
    let clocks = hal::clocks::init_clocks_and_plls(
        seeeduino_xiao_rp2040::XOSC_CRYSTAL_FREQ,
        pac.XOSC,
        pac.CLOCKS,
        pac.PLL_SYS,
        pac.PLL_USB,
        &mut pac.RESETS,
        &mut watchdog,
    )
    .ok()
    .unwrap();

    let timer = hal::Timer::new(pac.TIMER, &mut pac.RESETS, &clocks);

    let mut switches = Switches::init(timer, pins);

    loop {
        switches.check();
    }
}
