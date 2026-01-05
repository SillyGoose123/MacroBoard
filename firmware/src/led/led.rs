use crate::led::NUM_LEDS;
use crate::{CONFIG, FLASH_CHANNEL};
use embassy_executor::task;
use embassy_rp::peripherals::PIO0;
use embassy_rp::pio_programs::ws2812::{Grb, PioWs2812};
use embassy_time::{Duration, Ticker, Timer};

#[task]
pub async fn effect_task(mut ws2812: PioWs2812<'static, PIO0, 0, NUM_LEDS, Grb>) {
    let mut ticker = Ticker::every(Duration::from_millis(1));
    let mut ticks: u32 = 0;
    let mut index: u32 = 0;

    loop {
        if let Ok(flash) = FLASH_CHANNEL.try_receive() {
            ws2812.write(&[flash.rgb; NUM_LEDS]).await;
            Timer::after(Duration::from_millis(flash.duration as u64)).await;
            FLASH_CHANNEL.clear();
        }
        let mut cfg = CONFIG.lock().await;
        let data = cfg.as_mut().unwrap().effect.tick(&mut ticks, &mut index);
        ws2812.write(&data).await;

        ticks += 1;
        ticker.next().await;
    }
}
