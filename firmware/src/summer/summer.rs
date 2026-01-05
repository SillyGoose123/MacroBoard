use crate::SUMMER_CHANNEL;
use embassy_executor::task;
use embassy_rp::pwm::{Config as PWMConfig, Pwm};
use embassy_time::{Duration, Timer};

#[task]
pub async fn summer_handler(mut pwm: Pwm<'static>) {
    loop {
        let tone = SUMMER_CHANNEL.receive().await;
        let mut config = PWMConfig::default();
        config.top = (125_000_000 / tone.get_value() as u32) as u16;
        config.compare_b = config.top / 2;

        pwm.set_config(&config);
        Timer::after(Duration::from_millis(500)).await;
        pwm.set_config(&PWMConfig::default());
        SUMMER_CHANNEL.clear();
    }
}
