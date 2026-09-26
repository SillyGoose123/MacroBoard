#![no_std]
#![no_main]
extern crate alloc;

mod bytes_trait;
mod config;
mod key;
mod knob;
mod led;
mod macros;
mod storage;
mod summer;
mod usb;

use crate::config::Config;
use crate::key::key_action::SlimKeyReport;
use crate::key::switch::init_switches;
use crate::knob::knob::init_knob;
use crate::led::Flash;
use crate::led::led::effect_task;
use crate::storage::Storage;
use crate::summer::summer::summer_handler;
use crate::summer::tones::Tone;
use crate::usb::usb::init_usb;
use defmt::{info};
use embassy_executor::Spawner;
use embassy_rp::{bind_interrupts, dma};
use embassy_rp::gpio::{Input, Pull};
use embassy_rp::peripherals::{PIO0, DMA_CH1, DMA_CH0};
use embassy_rp::pio::{InterruptHandler, Pio};
use embassy_rp::pio_programs::ws2812::{PioWs2812, PioWs2812Program};
use embassy_rp::pwm::{Config as PWMConfig, Pwm};
use embassy_sync::blocking_mutex::raw::ThreadModeRawMutex;
use embassy_sync::channel::Channel;
use embassy_sync::mutex::Mutex;
use embedded_alloc::LlffHeap as Heap;
use usbd_hid::descriptor::MouseReport;


#[allow(unused_imports)]
use {critical_section as _, defmt_rtt as _, panic_probe as _};



bind_interrupts!(struct Irqs {
    PIO0_IRQ_0 => InterruptHandler<PIO0>;
    DMA_IRQ_0 => dma::InterruptHandler<DMA_CH0>, dma::InterruptHandler<DMA_CH1>;
});

//TODO: USB TASK PROBLEM with CONFIG
pub(crate) static CONFIG: Mutex<ThreadModeRawMutex, Option<Config>> = Mutex::new(None);
pub(crate) static STORAGE: Mutex<ThreadModeRawMutex, Option<Storage>> = Mutex::new(None);
pub(crate) static SUMMER_CHANNEL: Channel<ThreadModeRawMutex, Tone, 1> = Channel::new();
pub(crate) static FLASH_CHANNEL: Channel<ThreadModeRawMutex, Flash, 1> = Channel::new();
pub(crate) static KEY_CHANNEL: Channel<ThreadModeRawMutex, SlimKeyReport, 1> = Channel::new();
pub(crate) static MOUSE_CHANNEL: Channel<ThreadModeRawMutex, MouseReport, 1> = Channel::new();

#[global_allocator]
static ALLOCATOR: Heap = Heap::empty();

#[embassy_executor::main]
async fn main(spawner: Spawner) {
    //init
    let rp = embassy_rp::init(Default::default());

  // Initialize the allocator BEFORE you use it
    {
        use core::mem::MaybeUninit;
        const HEAP_SIZE: usize = 50 * 1024;
        static mut HEAP: [MaybeUninit<u8>; HEAP_SIZE] = [MaybeUninit::uninit(); HEAP_SIZE];
        unsafe { ALLOCATOR.init(core::ptr::addr_of_mut!(HEAP) as usize, HEAP_SIZE) }
    }

    // They're in scopes because else the guard keeps the lock forever
    {
        //storage
        let storage = Storage::init(rp.FLASH, rp.DMA_CH0, Irqs);
        let mut guard = STORAGE.lock().await;
        *guard = Some(storage);
        info!("Init storage!");
    }

    {
        //config
        let config = Config::load().await;
        let mut guard = CONFIG.lock().await;
        *guard = Some(config);
        info!("Init config!");
    }

    init_switches(
        spawner,
        [
            Input::new(rp.PIN_3, Pull::Up),
            Input::new(rp.PIN_4, Pull::Up),
            Input::new(rp.PIN_2, Pull::Up),
            Input::new(rp.PIN_1, Pull::Up),
            Input::new(rp.PIN_0, Pull::Up),
            Input::new(rp.PIN_29, Pull::Up)
        ],
    );
    info!("Init switches!");

    init_knob(
        spawner,
        Input::new(rp.PIN_26, Pull::Up),
        [
            Input::new(rp.PIN_27, Pull::Up),
            Input::new(rp.PIN_28, Pull::Up),
        ],
    );
    info!("Init knob!");

    let Pio {
        mut common, sm0, ..
    } = Pio::new(rp.PIO0, Irqs);
    let program = PioWs2812Program::new(&mut common);
    let ws2812 = PioWs2812::new(
      &mut common,
      sm0,
      rp.DMA_CH1,
      Irqs,
      rp.PIN_6,
      &program
    );
    spawner.spawn(effect_task(ws2812).expect("Failed to init leds."));
    info!("Init leds!");

    let summer_conf = PWMConfig::default();
    let pwm = Pwm::new_output_b(rp.PWM_SLICE3, rp.PIN_7, summer_conf);
    spawner.spawn(summer_handler(pwm).expect("Failed to init summer."));
    info!("Init summer!");

    init_usb(spawner, rp.USB);
    info!("Init usb!");
}