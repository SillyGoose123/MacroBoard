#![no_std]
#![no_main]
extern crate alloc;

mod config;
mod key;
mod knob;
mod led;
mod summer;
mod usb;

// REQUIRED so panic is set up correctly
#[allow(unused_imports)]
use panic_halt as _;

use crate::config::Config;
use crate::key::switches::Switches;
use crate::knob::knob::Knob;
use crate::usb::hid::HID;

use crate::led::led::Led;
use crate::summer::summer::Summer;
use cortex_m::prelude::_embedded_hal_timer_CountDown;
use embedded_alloc::LlffHeap as Heap;
use seeeduino_xiao_rp2040::hal::fugit::ExtU32;
use seeeduino_xiao_rp2040::hal::gpio::{FunctionPio0, FunctionPwm, Pins};
use seeeduino_xiao_rp2040::hal::pio::PIOExt;
use seeeduino_xiao_rp2040::hal::pwm::Slices;
use seeeduino_xiao_rp2040::hal::usb::UsbBus;
use seeeduino_xiao_rp2040::hal::{Clock, Sio};
use seeeduino_xiao_rp2040::{entry, hal, pac};
use usb_device::class_prelude::UsbBusAllocator;
use ws2812_pio::Ws2812Direct;

#[global_allocator]
static ALLOCATOR: Heap = Heap::empty();

#[entry]
fn main() -> ! {
    // Initialize the allocator BEFORE you use it
    {
        use core::mem::MaybeUninit;
        const HEAP_SIZE: usize = 1024;
        static mut HEAP: [MaybeUninit<u8>; HEAP_SIZE] = [MaybeUninit::uninit(); HEAP_SIZE];
        unsafe { ALLOCATOR.init(core::ptr::addr_of_mut!(HEAP) as usize, HEAP_SIZE) }
    }

    let mut pac = pac::Peripherals::take().unwrap();
    let sio = Sio::new(pac.SIO);
    let pins = Pins::new(
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

    let config = Config::load();

    let timer = hal::Timer::new(pac.TIMER, &mut pac.RESETS, &clocks);
    let mut countdown = timer.count_down();
    countdown.start(config.input_delay.millis());

    //init usb
    let usb_alloc = UsbBusAllocator::new(UsbBus::new(
        pac.USBCTRL_REGS,
        pac.USBCTRL_DPRAM,
        clocks.usb_clock,
        true,
        &mut pac.RESETS,
    ));
    let mut hid = HID::init(&usb_alloc, &timer);

    //init components
    let mut switches = Switches::init(
        [
            pins.gpio3.into_pull_down_input().into_dyn_pin(),
            pins.gpio4.into_pull_down_input().into_dyn_pin(),
            pins.gpio2.into_pull_down_input().into_dyn_pin(),
            pins.gpio1.into_pull_down_input().into_dyn_pin(),
            pins.gpio0.into_pull_down_input().into_dyn_pin(),
            pins.gpio29.into_pull_down_input().into_dyn_pin(),
        ],
        &config,
    );
    let mut knob = Knob::init(
        [
            pins.gpio27.into_pull_down_input().into_dyn_pin(),
            pins.gpio28.into_pull_down_input().into_dyn_pin(),
        ],
        pins.gpio26.into_pull_down_input().into_dyn_pin(),
        &config,
    );
    let mut summer = Summer::init(
        pins.gpio7.into_function::<FunctionPwm>(),
        &timer,
        Slices::new(pac.PWM, &mut pac.RESETS),
    );

    let (mut pio, sm01, _, _, _) = pac.PIO0.split(&mut pac.RESETS);
    let mut led = Led::init(Ws2812Direct::new(
      pins.gpio6.into_function::<FunctionPio0>(),
      &mut pio,
      sm01,
      clocks.peripheral_clock.freq(),
    ), &timer);

    loop {
        if countdown.wait().is_ok() {
            switches.check();
            knob.check();
        }

        hid.tick();
        summer.tick();
        led.tick();
    }
}
