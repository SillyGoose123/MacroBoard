#![no_std]
#![no_main]
extern crate alloc;

mod config;
mod driver_trait;
mod key;
mod knob;
mod led;
mod macros;
mod summer;
mod usb;

use crate::config::Config;
use crate::driver_trait::Driver;
use crate::key::switches_driver::SwitchesDriver;
use crate::knob::knob_driver::KnobDriver;
use crate::summer::summer_driver::SummerDriver;
use crate::usb::usb_driver::UsbDriver;
use alloc::string::String;
use embassy_executor::Spawner;
use embedded_alloc::LlffHeap as Heap;

#[global_allocator]
static ALLOCATOR: Heap = Heap::empty();

#[embassy_executor::main]
async fn main(spawner: Spawner) {
    // Initialize the allocator BEFORE you use it
    {
        use core::mem::MaybeUninit;
        const HEAP_SIZE: usize = 1024;
        static mut HEAP: [MaybeUninit<u8>; HEAP_SIZE] = [MaybeUninit::uninit(); HEAP_SIZE];
        unsafe { ALLOCATOR.init(core::ptr::addr_of_mut!(HEAP) as usize, HEAP_SIZE) }
    }

    //init
    let rp = embassy_rp::init(Default::default());
    let config = Config::load();
    let _usb = UsbDriver::init(spawner, &config, rp.USB);
    let _switches = SwitchesDriver::init(spawner.clone(), &config, String::new());
    let _knob = KnobDriver::init(spawner.clone(), &config, String::new());
    let _summer = SummerDriver::init(spawner.clone(), &config, String::new());
}


#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
  loop {

  }
}
