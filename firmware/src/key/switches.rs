use crate::config::Config;
use crate::key::key_action::KeyAction;
use alloc::vec::Vec;
use embassy_executor::Spawner;
use embassy_rp::gpio::Input;

#[embassy_executor::task]
async fn switch_check(mut pin: &'static Input<'static>, key_action: Vec<KeyAction>) {
    loop {
        pin.wait_for_high().await;
        for action in &key_action {
            action.execute();
        }
    }
}

pub fn init(spawner: Spawner, pins: [Input<'static>; 6], config: &'static Config) {
    for (index, pin) in pins.iter().enumerate() {
        spawner
            .spawn(switch_check(pin, config.key_action[index]))
            .expect("Switch creation failed.");
    }
}
